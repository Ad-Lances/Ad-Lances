from datetime import datetime
import re

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