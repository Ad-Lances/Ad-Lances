from datetime import datetime
import re
from flask import request


def verificar_idade(data_nasc: str):
    try:
        data_nasc_obj = datetime.strptime(data_nasc, "%Y-%m-%d")
    except ValueError:
        return "Data de nascimento inválida."

    hoje = datetime.now()
    idade = hoje.year - data_nasc_obj.year

    if (hoje.month, hoje.day) < (data_nasc_obj.month, data_nasc_obj.day):
        idade -= 1

    if idade < 18:
        return "Você deve ter mais de 18 anos para criar uma conta."

    return None

def verificar_email(email: str):
    regex = r"^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"
    if not re.match(regex, email):
        return "Insira um e-mail válido."
    return None

def verificar_senha(senha: str):
    maiuscula = bool(re.search(r"[A-Z]", senha))
    especiais = bool(re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", senha))

    if len(senha) < 6:
        print("senha mortta")
        return "A senha deve ter mais de 6 caracteres."
    if not especiais:
        return "A senha deve conter ao menos um caractere especial."
    if not maiuscula:
        return "A senha deve conter ao menos um caractere maiusculo."

    return None

def verificar_campos(dados):

    nome = dados.get("nome")
    unid_federativa = dados.get("estado")
    cidade = dados.get("cidade")
    rua = dados.get("logradouro")
    cep = dados.get("cep")
    bairro = dados.get("bairro")
    numero_casa = dados.get("numero_casa")
    email = dados.get("email")
    senha = dados.get("senha")
    telefone = dados.get("telefone_celular")
    tipo_pessoa = dados.get("tipo-de-conta")
    cpf = dados.get("cpf")
    cnpj = dados.get("cnpj")
    nome_empresa = dados.get("nome_empresa")

    obrigatorios = [
        nome, unid_federativa, cidade, rua, cep, bairro, numero_casa, email, senha, telefone, tipo_pessoa
    ]

    print(obrigatorios)
    print(dados)
    if any(not campo for campo in obrigatorios):
        return "Por favor, preencha todos os campos obrigatorios."

    if tipo_pessoa not in ["Pessoa Física", "Pessoa Jurídica"]:
        return "Selecione um tipo de pessoa."

    if tipo_pessoa == "Pessoa Física":
        if not cpf:
            return "CPF obrigatorio para Pessoa Fisica."

    elif tipo_pessoa == "Pessoa Jurídica":
        if not cnpj:
            return "CNPJ obrigatorio para Pessoa Juridica."
        if not nome_empresa:
            return "Nome da empresa obrigatorio."

    return None
