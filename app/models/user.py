from app import argon2, db
import re

class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(100), nullable=False)
    tipo_pessoa = db.Column(db.String(50), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    datanasc = db.Column(db.Date, nullable=False)
    unid_federativa = db.Column(db.String(50), nullable=False)
    cidade = db.Column(db.String(100), nullable=False)
    rua = db.Column(db.String(150), nullable=False)
    numero = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)
        
    def set_senha(self, senha):
        self.senha_hash = argon2.generate_password_hash(senha)
        
    def verify_senha(self, senha):
        return argon2.check_password_hash(self.senha_hash, senha)
    
    def verificar_email(self, email):
        regex_email = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return bool(re.match(regex_email, email))
    
    def verificar_senha(self, senha):
        caracteres_especiais = ['#', '@', '_']
        if senha.length()<6 and senha.includes(caracteres_especiais) == False:
            return False
        
        