from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, flash, abort
from app.models import *
from . import db
from . import cloudinary
from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo
import cloudinary.uploader
import re
from sqlalchemy import select, or_
from app import stripe, socketio, sqids
from config import Config
from app.controllers.user_controller import (
    verificar_idade,
    verificar_email,
    verificar_senha,
    verificar_campos,
    verificar_camposlog
)

bp = Blueprint('main', __name__)

ENDPOINTS = [Config.STRIPE_WEBHOOK_ACCOUNT, Config.STRIPE_WEBHOOK_PAYMENT]

def salvar_dados(dados: object) -> bool:
    try:
        db.session.add(dados)
        db.session.commit()
        return True
    except Exception as e:
        print(f'Erro ao salvar dados: {e}')
        db.session.rollback()
        return False
    
def get_leilao(hashid):
    dihsah = sqids.decode(hashid)
    if dihsah:
        return LeilaoModel.query.get(dihsah[0])
    else: 
        return None     


@bp.route('/')
def index():
    pagina = request.args.get('pagina', 1, type=int)
    por_pagina = request.args.get('por_pagina', 12, type=int)
    leiloes = LeilaoModel.query.all()
    leiloes_paginados = LeilaoModel.query.filter(
        LeilaoModel.data_fim > datetime.now(ZoneInfo("America/Sao_Paulo"))
    ).order_by(
        LeilaoModel.data_inicio.desc()
    ).paginate(
        page=pagina,
        per_page=por_pagina,
        error_out=False
    )
    for i in leiloes:
        print(i.hashid)
    return render_template('index.html', leiloes=leiloes_paginados)

@bp.route('/pesquisar')
def pesquisar():
    busca = request.args.get('p', '').lower()

    if not busca:
        return jsonify([])
    
    resultados = LeilaoModel.query.filter(
        or_(
            LeilaoModel.nome.ilike(f'%{busca}%'),
            LeilaoModel.descricao.ilike(f'%{busca}%')
        )
    ).limit(10).all()
    
    dados_results = [{"hashid": leilao.hashid, "nome": leilao.nome, "descricao": leilao.descricao} for leilao in resultados]
    return jsonify(dados_results)

@bp.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@bp.route('/cadastrar', methods=['POST'])
def cadastrar():
    if request.is_json:
        dados = request.get_json()
    else:
        dados = request.form.to_dict()
    print('ta validando')
        
    usuario_exist = UserModel.query.filter_by(email=dados.get('email')).first()

    erro = verificar_campos(dados)
    if erro:
        return jsonify({'erro': erro})

    erro = verificar_idade(dados.get("datanasc"))
    if erro:
        return jsonify({'erro': erro})

    erro = verificar_email(dados.get('email'))
    if erro:
        return jsonify({'erro': erro})
    
    erro = verificar_senha(dados.get('senha'))
    if erro:
        print("oillucas")
        return jsonify({'erro': erro})
    
    
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
            bairro=dados['bairro'],
            numero=dados['numero_casa'],
            email=dados['email']
        )
        novo_usuario.set_senha(dados['senha'])
    
        if salvar_dados(novo_usuario):
            return jsonify({
            'sucesso': f"Usuário {novo_usuario.nome_completo} cadastrado com sucesso!"
        })
        return jsonify({'erro': "Erro ao salvar usuário no banco de dados. Tente novamente"})

    else:

        return jsonify({'erro': "Email ja cadastrado. Faca login ou utilize outro email."})

@bp.route('/login')
def login():
    return render_template('login.html')

@bp.route('/logar', methods=['POST'])
def logar():

    if request.is_json:
        dados = request.get_json()
    else:
        dados = request.form.to_dict()

    email = dados.get('email')
    senha = dados.get('senha')

    erro = verificar_camposlog(email, senha)
    if erro:
        return jsonify({'erro': erro})

    erro = verificar_email(email)
    if erro:
        return jsonify({'erro': erro})

    usuario = UserModel.query.filter_by(email=email).first()

    if usuario and usuario.verify_senha(senha):
        session['logado'] = True
        session['usuario_id'] = usuario.id
        session['nome_completo'] = usuario.nome_completo

        return jsonify({
            "sucesso": f"Bem-Vindo, {usuario.nome_completo}!",
            "redirect": url_for('main.index')
        })

    return jsonify({"erro": "Email ou senha inválidos."})


@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('main.index'))
    
@bp.route('/perfil')
def perfil_user():
    usuario = UserModel.query.get(session['usuario_id'])
    leiloes_usuario = LeilaoModel.query.filter_by(id_user=session['usuario_id']).all()
    lances_usuario = LanceModel.query.filter_by(id_user=session['usuario_id']).all()
    #leiloes_usuario_participou
    #leiloes_usuario_ganhou

    return render_template('perfil.html', usuario=usuario, leiloes=leiloes_usuario, lances=lances_usuario)

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
                    LeilaoModel.data_fim > datetime.now(ZoneInfo("America/Sao_Paulo")),
                    LeilaoModel.data_fim <= datetime.now(ZoneInfo("America/Sao_Paulo")) + timedelta(hours=24)  # Próximas 24h
                ).order_by(
                    LeilaoModel.data_fim.asc()
                ).limit(5).all()

                # Todos os leilões da subcategoria (com paginação)
                leiloes = LeilaoModel.query.filter(
                    LeilaoModel.id_subcategoria == subcategoria_obj.id,
                    LeilaoModel.data_fim > datetime.now(ZoneInfo("America/Sao_Paulo"))
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
                LeilaoModel.data_fim > datetime.now(ZoneInfo("America/Sao_Paulo")),
                LeilaoModel.data_fim <= datetime.now(ZoneInfo("America/Sao_Paulo")) + timedelta(hours=24)
            ).order_by(
                LeilaoModel.data_fim.asc()
            ).limit(5).all()

            # Todos os leilões da categoria (com paginação)
            leiloes = LeilaoModel.query.filter(
                LeilaoModel.id_subcategoria.in_([sub.id for sub in categoria_exist.subcategorias]),
                LeilaoModel.data_fim > datetime.now(ZoneInfo("America/Sao_Paulo"))
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

@bp.route('/esqueciasenha')
def redefinirsenha():
    return render_template('esqueci_senha.html')

@bp.route('/redefinirsenha', methods=['POST'])
def redefinicao():
    return None

@bp.route('/<hashid>')
def detalhes_leilao(hashid):
    leilao = get_leilao(hashid)

    if leilao:
        horas = datetime.now(ZoneInfo("America/Sao_Paulo")).replace(microsecond=0)
        data_fim = leilao.data_fim.replace(tzinfo=ZoneInfo("America/Sao_Paulo"))
        
        if horas >= data_fim and leilao.status == "Aberto":
            leilao.status = "Encerrado"
            db.session.commit
        if len(leilao.lances) == 0:
            return render_template('detalhes_leilao.html', leilao=leilao, data_fim=data_fim.isoformat())
        lance_atual = LanceModel.get_ultimo_lance(leilao.id)
        return render_template('detalhes_leilao.html', leilao=leilao, data_fim=data_fim.isoformat(), lance_atual = lance_atual)
    
    abort(404)

@bp.route('/verificarstripe')
def verificar_stripe():
    if session.get('usuario_id') is None:
        return redirect(url_for('main.login'))
    usuario = UserModel.query.get(session['usuario_id'])
    if usuario is None:
        return redirect(url_for('main.login'))
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
        "pagamentos": request.form.get("pagamento"),
        "parcelas": request.form.get("parcelas"),
        "cep": request.form.get("cep"),
        "uf": request.form.get("uf"),
        "cidade": request.form.get("cidade"),
        "bairro": request.form.get("bairro"),
        "logradouro": request.form.get("logradouro"),
        "numero_morada": request.form.get("numero_morada"),
        "complemento": request.form.get("complemento")
    }
    foto = request.files.get("foto")

    if foto:
        upload = cloudinary.uploader.upload(foto, transformation=[{"fetch_format": "auto", "quality": "auto:best"}])
        url_imagem = upload.get('secure_url')
    else:
        url_imagem = None
        
    try:
        novo_leilao = LeilaoModel(
            nome=dados['nome'],
            descricao=dados['descricao'],
            id_subcategoria=dados['id_subcategoria'],
            data_inicio=dados['data_inicio'],
            data_fim=dados['data_fim'],
            lance_inicial=dados['lance_inicial'],
            min_incremento=dados['min_incremento'] if dados['min_incremento'] != '' else 0.1,
            parcelas=dados['parcelas'],
            foto=url_imagem,
            id_user=session['usuario_id'],
            cep=dados['cep'],
            uf=dados['uf'],
            cidade=dados['cidade'],
            bairro=dados['bairro'],
            logradouro=dados['logradouro'],
            numero_morada=dados['numero_morada'],
            complemento=dados['complemento']
        )    
    except Exception:
        return jsonify({'erro': 'Erro ao criar leilão. Tente novamente.'})
    
    if salvar_dados(novo_leilao):
        novo_leilao.hashid = sqids.encode([novo_leilao.id])
        db.session.commit()
        
        pagamentoslist = dados["pagamentos"].split(",")

        for pagamento in pagamentoslist:
            novo_leilaopagamento = LeilaoPagamentoModel(
                id_leilao = novo_leilao.id,
                id_pagamento = pagamento
            )
            db.session.add(novo_leilaopagamento)
            db.session.commit()
        
        return jsonify({'sucesso': f'Leilão {novo_leilao.nome} criado com sucesso!', "redirect": 'detalhes'})
    return jsonify({'erro': 'Erro ao salvar leilão no banco de dados. Tente novamente.'})

@bp.get("/<hashid>/encerrar_leilao")
def encerrar_leilao(hashid):
    leilao = get_leilao(hashid)
    if leilao:
        if leilao.id_user == session.get('usuario_id'):
            if leilao.status == "Aberto" or leilao.status == "Não iniciado":
                leilao.status = "Encerrado"
                db.session.commit()
                return jsonify({"sucesso": f"Leilão {leilao.nome} encerrado com sucesso."})
            else:
                return jsonify({"sucesso": "Leilão já encerrado."})
        abort(401)
    abort(404)

@bp.post('/<hashid>/novolance')
def novo_lance(hashid):
    dados = request.get_json()
    horas = datetime.now(ZoneInfo("America/Sao_Paulo"))
    leilao = get_leilao(hashid)
    
    if leilao is None:
        return jsonify({'erro': 'Leilão não encontrado.'})
    
    if leilao.data_fim.replace(tzinfo=ZoneInfo("America/Sao_Paulo")) < horas and leilao.status == "Aberto":
        leilao.status = 'Encerrado'
        db.session.commit()
        return jsonify({'erro': 'Leilão já encerrado.'})
    if leilao.status == "Encerrado":
        return jsonify({"erro": "Leilão já encerrado."})
    
    try:
        valor_lance = float(dados['lance'])
    except:
        return jsonify({'erro': 'Digite um lance válido.'})
    
    if valor_lance < (LanceModel.get_ultimo_lance(leilao.id).valor if len(leilao.lances) > 0 else leilao.lance_inicial) + leilao.min_incremento:
        return jsonify({'erro': 'O valor do lance deve ser maior que o lance atual + incremento mínimo.'})
    
    try:
        locked = db.session.execute(
            select(LeilaoModel).
            where(LeilaoModel.id == leilao.id).
            with_for_update()
        ).scalar_one_or_none()
        
        lance_atual = db.session.execute(
            select(LanceModel)
            .where(LanceModel.id_leilao == leilao.id)
            .order_by(LanceModel.horario.desc())
            .with_for_update()
            .limit(1)
        ).scalar_one_or_none()
        
        ultimo_lance = db.session.execute(
            select(LanceModel)
            .where(LanceModel.id_leilao == leilao.id)
            .where(LanceModel.id_user == session['usuario_id'])
            .order_by(LanceModel.id.desc())
            .limit(1)
        ).scalar_one_or_none()
        
        valor_atual = lance_atual.valor if lance_atual else locked.lance_inicial
        if valor_lance < valor_atual + locked.min_incremento: 
            db.session.rollback()
            return jsonify({'erro': 'O valor do lance deve ser maior que o lance atual + incremento mínimo.'})
        
        if ultimo_lance and ultimo_lance.horario.replace(tzinfo=ZoneInfo("America/Sao_Paulo")) > datetime.now(ZoneInfo("America/Sao_Paulo")) - timedelta(seconds=5):
            db.session.rollback()
            return jsonify({'erro': 'Espere um pouco para fazer outro lance...'})
        
        novo_lance = LanceModel(
            valor=valor_lance,
            horario=datetime.now(ZoneInfo("America/Sao_Paulo")),
            id_leilao=leilao.id,
            id_user=session['usuario_id']
        )
        db.session.add(novo_lance)            
        db.session.commit()
        socketio.emit("novo_lance", (valor_lance, len(leilao.lances)))
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'erro': 'Erro ao salvar lance. Tente novamente.'})
    return jsonify({'sucesso': 'Lance registrado com sucesso!'})
    
        
@bp.post('/<hashid>/criarpagamento')
def criar_pagamento(hashid):
    user = UserModel.query.get(session['usuario_id'])
    leilao = get_leilao(hashid)
    
    if user and leilao:
        ultimo_lance = LanceModel.get_ultimo_lance(leilao.id)
        session_stripe = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'brl',
                    'product_data': {
                        'name': leilao.nome,
                        'description': leilao.descricao,
                    },
                    'unit_amount': int(ultimo_lance.valor * 100),
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
        return jsonify({'url': session_stripe.url})
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
        
    if event["type"]=="checkout.session.completed":
        payment = event["data"]["object"]
        print(payment)
        
    if event["type"]=="v2.core.account.created":
        account = event["data"]["object"]
        print(account)
        
    return "", 200

@bp.get('/api/horas')
def get_horas():
    horas = datetime.now(ZoneInfo("America/Sao_Paulo")).replace(microsecond=0)
    return jsonify({"horas": horas.isoformat()})

@bp.errorhandler(401)
def erro_401(error):
    return render_template('error-pages/401.html'), 401

@bp.errorhandler(404)
def page_not_found(error):
    return render_template('error-pages/404.html'), 404

@bp.errorhandler(500)
def erro_500(error):
    return render_template('error-pages/500.html'), 500

@bp.route('/forcar404')
def forcar404():
    abort(404)
