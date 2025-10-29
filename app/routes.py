from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from .models.user import UserModel
from . import db

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