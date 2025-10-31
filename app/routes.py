from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from .models.user import UserModel
from .models.leiloes import LeilaoModel
from . import db
from . import cloudinary
import cloudinary.uploader


bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@bp.route('/cadastrar', methods=['POST'])
def cadastrar():
    dados = request.get_json()

    usuario_exist = UserModel.query.filter_by(email=dados['email']).first()
    
    if not usuario_exist:
        novo_usuario = UserModel(
            nome_completo=dados['nome'],
            tipo_pessoa=dados['tipo_pessoa'],
            cpf = dados['cpf'],
            datanasc=dados['datanasc'],
            cep=dados['cep'],
            unid_federativa=dados['unid_federativa'],
            cidade=dados['cidade'],
            rua=dados['rua'],
            numero=dados['numero_casa'],
            email=dados['email']
        )
        novo_usuario.set_senha(dados['senha'])
    
        db.session.add(novo_usuario)
        db.session.commit()
    
        return jsonify({'sucesso': f'Usuário {novo_usuario.nome_completo} cadastrado com sucesso!'})
    else:
        return jsonify({'erro': 'Email já cadastrado. Faça login ou utilize outro email.'})

@bp.route('/login')
def login():
    return render_template('login.html')

@bp.route('/logar', methods=['POST'])
def logar():
    dados = request.get_json()
    
    email = dados['email']
    senha = dados['senha']
    
    usuario = UserModel.query.filter_by(email=email).first()
    if usuario and usuario.verify_senha(senha):
        session['logado'] = True
        session['usuario_id'] = usuario.id
        return jsonify({"sucesso": f"Bem-vindo(a), {usuario.nome_completo}!"})
    else:
        return jsonify({"erro": "Email ou senha inválidos."})

@bp.route('/imoveis')
def imoveis():
    return render_template('categorias/imoveis.html')

@bp.route('/veiculos')
def veiculos():
    return render_template('categorias/veiculos.html')

@bp.route('/eletronicos')
def eletronicos():
    return render_template('categorias/eletronicos.html')

@bp.route('/eletrodomesticos')
def eletrodomesticos():
    return render_template('categorias/eletrodomesticos.html')

@bp.route('/moveis')
def moveis():
    return render_template('categorias/moveis.html')

@bp.route('/industriais')
def industriais():
    return render_template('categorias/industriais.html')

@bp.route('/novoleilao')
def pagina_criar_leilao():
    return render_template('criarleilao.html')

@bp.route('/criarleilao', methods=['POST'])
def criar_leilao():
    dados = request.get_json()
    imagem = request.files.get('img')
    
    if imagem:
        upload = cloudinary.uploader.upload(imagem, transformation=[{"fetch_format": "auto", "quality": "auto:best"}])
        url_imagem = upload.get('secure_url')
    else:
        url_imagem = None
    
    novo_leilao = LeilaoModel(
        nome=dados['nome'],
        descricao=dados['descricao'],
        categoria=dados['categoria'],
        subcategoria=dados['subcategoria'],
        data_inicio=dados['data_inicio'],
        data_fim=dados['data_fim'],
        lance_inicial=dados['lance_inicial'],
        pagamento=dados['pagamento'],
        parcelas=dados['parcelas'],
        imagem_url=url_imagem
    )
    
    db.session.add(novo_leilao)
    db.session.commit()
    
    return jsonify({'sucesso': f'Leilão {novo_leilao.nome} criado com sucesso!'})