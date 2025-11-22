from . import mail, serial
from flask import url_for
from flask_mail import Message
from urllib.parse import quote

def enviar_email(email):
    token = serial.dumps(email, salt="verificar-email")
    link = url_for("main.redefinirsenha", token=quote(token), _external=True)
    
    mensagem = Message(
        subject="Redefinição de Senha",
        recipients=[email],
        body=f"Clique no link para redefinir sua senha: {link}"
    )
    
    mail.send(mensagem)
    
def verificar_token(token, max_age=3600):
    try:
        email = serial.loads(token, salt="verificar-email", max_age=max_age)
        return email
    except:
        return None