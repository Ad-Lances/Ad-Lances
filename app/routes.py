from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from app.models import *
from . import db
from . import cloudinary
from datetime import datetime, date, timedelta
import cloudinary.uploader
import re
from app import stripe
from config import Config

bp = Blueprint('main', __name__)

ENDPOINTS = [Config.STRIPE_WEBHOOK_ACCOUNT, Config.STRIPE_WEBHOOK_PAYMENT]

@bp.route('/')
@bp.route('/')
def index():
    pagina = request.args.get('pagina', 1, type=int)
    por_pagina = request.args.get('por_pagina', 12, type=int)
    
    leiloes_paginados = LeilaoModel.query.filter(
        LeilaoModel.data_fim > datetime.now()
    ).order_by(
        LeilaoModel.data_inicio.desc()
    ).paginate(
        page=pagina,
        per_page=por_pagina,
        error_out=False
    )
    
    return render_template('index.html', leiloes=leiloes_paginados)

@bp.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@bp.route('/cadastrar', methods=['POST'])
def cadastrar():
    dados = request.get_json()
    
    for i in list(dados.values()):
        if i == '':
            return jsonify({'erro': 'Preencha todos os campos.'})
        
    if re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', dados['email']) is None:
        return jsonify({'erro': 'Digite um email válido.'})
        
    usuario_exist = UserModel.query.filter_by(email=dados.get('email')).first()
    
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
        session['nome_completo'] = usuario.nome_completo

        return jsonify({"sucesso": 'Bem-vindo!', "redirect": "/"})
    else:
        return jsonify({"erro": "Email ou senha inválidos."})
    
@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('main.index'))
    
@bp.route('/perfil')
def perfil_user():
    usuario = UserModel.query.get(session['usuario_id'])
    return render_template('perfil.html', usuario=usuario)

@bp.route('/categorias/<string:categoria>')
def imoveis(categoria):
    # Obter parâmetros
    subcategoria = request.args.get('subcategoria', '')
    pagina = request.args.get('pagina', 1, type=int)
    por_pagina = 10

    categoria_exist = CategoriaModel.query.filter_by(nome=categoria).first()
    
    if categoria_exist:
        if subcategoria:
            # Filtrar por subcategoria específica
            subcategoria_obj = SubcategoriaModel.query.filter_by(
                id_categoria=categoria_exist.id,
                nome=subcategoria
            ).first()
            
            if subcategoria_obj:
                # Leilões encerrando em breve da subcategoria
                leiloes_encerrando = LeilaoModel.query.filter(
                    LeilaoModel.id_subcategoria == subcategoria_obj.id,
                    LeilaoModel.data_fim > datetime.now(),
                    LeilaoModel.data_fim <= datetime.now() + timedelta(hours=24)  # Próximas 24h
                ).order_by(
                    LeilaoModel.data_fim.asc()
                ).limit(5).all()

                # Todos os leilões da subcategoria (com paginação)
                leiloes = LeilaoModel.query.filter(
                    LeilaoModel.id_subcategoria == subcategoria_obj.id,
                    LeilaoModel.data_fim > datetime.now()
                ).order_by(
                    LeilaoModel.data_inicio.desc()
                ).paginate(
                    page=pagina,
                    per_page=por_pagina,
                    error_out=False
                )
            else:
                leiloes_encerrando = []
                leiloes = None
        else:
            # Leilões encerrando em breve de toda a categoria
            leiloes_encerrando = LeilaoModel.query.filter(
                LeilaoModel.id_subcategoria.in_([sub.id for sub in categoria_exist.subcategorias]),
                LeilaoModel.data_fim > datetime.now(),
                LeilaoModel.data_fim <= datetime.now() + timedelta(hours=24)
            ).order_by(
                LeilaoModel.data_fim.asc()
            ).limit(5).all()

            # Todos os leilões da categoria (com paginação)
            leiloes = LeilaoModel.query.filter(
                LeilaoModel.id_subcategoria.in_([sub.id for sub in categoria_exist.subcategorias]),
                LeilaoModel.data_fim > datetime.now()
            ).order_by(
                LeilaoModel.data_inicio.desc()
            ).paginate(
                page=pagina,
                per_page=por_pagina,
                error_out=False
            )

        return render_template(
            f'categorias/{categoria_exist.slug}.html', 
            leiloes=leiloes,
            leiloes_encerrando=leiloes_encerrando,
            subcategoria=subcategoria,
            categoria=categoria_exist
        )
    else:
        return redirect(url_for('main.index'))

@bp.route('/novoleilao')
def pagina_criar_leilao():
    return render_template('criarleilao.html')

@bp.route('/<id_leilao>')
def detalhes_leilao(id_leilao):
    leilao = LeilaoModel.query.get(id_leilao)
    if leilao:
        return render_template('detalhes_leilao.html', leilao=leilao)
    return redirect(url_for('main.index'))

@bp.route('/verificarstripe')
def verificar_stripe():
    if session.get('usuario_id') is None:
        return redirect(url_for('main.login'))
    usuario = UserModel.query.get(session['usuario_id'])
    if usuario.id_stripe is None:
        stripe_conta = stripe.Account.create(type="express")
        link = stripe.AccountLink.create(
            account=stripe_conta.id,
            refresh_url="https://ad-lances.onrender.com/verificarstripe",
            return_url="https://ad-lances.onrender.com/verificarstripe/sucesso",
            type="account_onboarding"
        )
        usuario.id_stripe = stripe_conta.id
        db.session.commit()
        return redirect(link.url)
    return redirect(url_for('main.pagina_criar_leilao'))

@bp.route('/verificarstripe/sucesso')
def sucesso_stripe():
    return render_template('sucesso_stripe.html')

@bp.post('/criarleilao')
def criar_leilao():
    dados = {
        "nome": request.form.get("nome"),
        "descricao": request.form.get("descricao"),
        "id_subcategoria": request.form.get("id_subcategoria"),
        "data_inicio": request.form.get("data_inicio"),
        "data_fim": request.form.get("data_fim"),
        "lance_inicial": request.form.get("lance_inicial"),
        "min_incremento": request.form.get("min_incremento"),
        "parcelas": request.form.get("parcelas")
    }
    foto = request.files.get("foto")

    if foto:
        upload = cloudinary.uploader.upload(foto, transformation=[{"fetch_format": "auto", "quality": "auto:best"}])
        url_imagem = upload.get('secure_url')
    else:
        url_imagem = None
    
    novo_leilao = LeilaoModel(
        nome=dados['nome'],
        descricao=dados['descricao'],
        id_subcategoria=int(dados['subcategoria']),
        data_inicio=dados['data_inicio'],
        data_fim=dados['data_fim'],
        lance_inicial=dados['lance_inicial'],
        lance_atual=dados['lance_inicial'],
        min_incremento=dados.get('min_incremento'),
        parcelas=dados['parcelas'],
        foto=url_imagem,
        id_user=session['usuario_id']
    )
    novo_leilao.subcategoria = SubcategoriaModel.query.get(dados['subcategoria'])
    novo_leilao.user = UserModel.query.get(session['usuario_id'])

        
    db.session.add(novo_leilao)
    db.session.commit()
    
    return jsonify({'sucesso': f'Leilão {novo_leilao.nome} criado com sucesso!', "redirect": 'detalhes'})

@bp.post('/<id_leilao>/novolance')
def novo_lance(id_leilao):
    dados = request.get_json()
    leilao = LeilaoModel.query.filter_by(id=id_leilao).first()   
    if leilao:
        if dados['lance'] > leilao.lance_atual:
            leilao.lance_atual = dados['lance']
            novo_lance = LanceModel(
                valor=dados['lance'],
                horario=dados['horario'],
                id_leilao=leilao.id,
                id_usuario=session['usuario_id']
            )
            db.session.add(novo_lance)
            db.session.commit()
            return jsonify({'sucesso': 'Lance registrado com sucesso!'})
        return jsonify({'erro': 'O valor do lance deve ser maior que o lance atual.'})
    return jsonify({'erro': 'Leilão não encontrado.'})
        
@bp.post('/<id_leilao>/criarpagamento')
def criar_pagamento(id_leilao):
    user = UserModel.query.get(session['usuario_id'])
    leilao = LeilaoModel.query.get(id_leilao)
    
    if user and leilao:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'brl',
                    'product_data': {
                        'name': leilao.nome,
                        'description': leilao.descricao,
                    },
                    'unit_amount': int(leilao.lance_atual * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            payment_intent_data={
                'transfer_data': {
                    'destination': leilao.user.id_stripe,
                },
            },
            customer_email=user.email,
            success_url=url_for('main.perfil_user', _external=True) + '?payment_success=true',
            cancel_url=url_for('main.perfil_user', _external=True) + '?payment_canceled=true',
        )
        return jsonify({'url_pagamento': session.url})
    return jsonify({'erro': 'Usuário ou leilão não encontrado.'})

@bp.post('/webhook')
def webhook():
    data = request.data
    header_ass = request.headers.get('Stripe-Signature')
    
    for endpoint in ENDPOINTS:
        try:
            event = stripe.Webhook.construct_event(
                data, header_ass, endpoint
            )
            break
        except Exception:
            continue
        
    if event is None:
        return "", 400
        
    if event["type"]=="payment_intent.succeeded":
        payment = event["data"]["object"]
        print(payment)
        
    if event["type"]=="v2.core.account.created":
        account = event["data"]["object"]
        print(account)
        
    return "", 200

@bp.route('/401')
def erro_401():
    return render_template('error-pages/401.html')

@bp.route('/404')
def erro_404():
    return render_template('error-pages/404.html')

@bp.route('/500')
def erro_500():
    return render_template('error-pages/500.html')