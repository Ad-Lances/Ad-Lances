from app import db
import bcrypt
import re

class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(100), nullable=False)
    tipo_pessoa = db.Column(db.String(50), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    datanasc = db.Column(db.Date, nullable=False)
    cep = db.Column(db.String(50), nullable=False)
    unid_federativa = db.Column(db.String(50), nullable=False)
    cidade = db.Column(db.String(100), nullable=False)
    rua = db.Column(db.String(150), nullable=False)
    numero = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)
        
    def set_senha(self, senha):
        salt = bcrypt.gensalt()
        print(salt)
        self.senha_hash = bcrypt.hashpw(senha.encode('utf-8'), salt).decode('utf-8')
        
    def verify_senha(self, senha):
        return bcrypt.checkpw(senha.encode('utf-8'), self.senha_hash.encode('utf-8'))
    
    def verificar_email(self, email):
        regex_email = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(regex_email, email))
    
    def verificar_senha(self, senha):
        caracteres_especiais = ['#', '@', '_']
        if senha.length()<6:
            return False
        
        if not any(char in senha for char in caracteres_especiais):
            return False
        
    def validar_cpf(self, cpf):
        if len(cpf)<14:
            return False
        
        soma = 0
        i = 0
        while(i<len(cpf)):
            numero = int(cpf[i])
            multiplicado = numero*9

            soma += multiplicado
            i += 1

        soma 

        #if(soma)
        
        