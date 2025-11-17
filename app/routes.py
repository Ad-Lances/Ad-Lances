from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, flash
from app.models import *
from . import db
from . import cloudinary
from datetime import datetime, date
import cloudinary.uploader
import re
from app import stripe
from config import Config
from validators_user import (
    verificar_idade,
    verificar_email,
    verificar_senha,
    verificar_campos
)

bp = Blueprint('main', __name__)

ENDPOINTS = [Config.STRIPE_WEBHOOK_ACCOUNT, Config.STRIPE_WEBHOOK_PAYMENT]

@bp.route('/')
def index():
    return render_template('index.html')

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

    erro = verificar_campos(request.form)
    if erro:
        return jsonify({"erro": erro}), 400
    
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
    categoria_exist = CategoriaModel.query.filter_by(nome=categoria).first()
    if categoria_exist:
        leiloes = categoria_exist.leiloes
        return render_template(f'categorias/{categoria_exist.slug}.html', leiloes=leiloes)
    else:
        return redirect(url_for('main.index'))

@bp.route('/novoleilao')
def pagina_criar_leilao():
    return render_template('criarleilao.html')

@bp.route('/detalhes')
def detalhes_leilao():
    leilao = LeilaoModel.query.get(1)
    return render_template('detalhes_leilao.html', leilao=leilao)

@bp.post('/verificarstripe')
def verificar_stripe():
    usuario = UserModel.query.get(session['usuario_id'])
    if usuario.id_stripe is None:
        stripe_conta = stripe.Account.create(type="express")
        link = stripe.AccountLink.create(
            account=stripe_conta.id,
            refresh_url="https://ad-lances.onrender.com/verificarstripe",
            return_url="https://ad-lances.onrender.com/perfil",
            type="account_onboarding"
        )
        return jsonify({'stripe_url': link.url})
    return redirect(url_for('main.criar_leilao'))

@bp.post('/criarleilao')
def criar_leilao():
    dados = {
        "nome": request.form.get("nome"),
        "descricao": request.form.get("descricao"),
        "categoria": request.form.get("categoria"),
        "subcategoria": request.form.get("subcategoria"),
        "data_inicio": request.form.get("data_inicio"),
        "data_fim": request.form.get("data_fim"),
        "lance_inicial": request.form.get("lance_inicial"),
        "pagamento": request.form.get("pagamento"),
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
        pagamento=dados['pagamento'],
        parcelas=dados['parcelas'],
        foto=url_imagem,
        id_user=session['usuario_id'],
    )
    novo_leilao.subcategoria = SubcategoriaModel.query.get(dados['subcategoria'])
    novo_leilao.user = UserModel.query.get(session['usuario_id'])    
        
    db.session.add(novo_leilao)
    db.session.commit()
    
    return jsonify({'sucesso': f'Leilão {novo_leilao.nome} criado com sucesso!', "redirect": 'detalhes'})

@bp.post('/novolance')
def novo_lance():
    dados = request.get_json()
    leilaoid = request.args.get('leilao')
    leilao = LeilaoModel.query.filter_by(id=leilaoid).first()   
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