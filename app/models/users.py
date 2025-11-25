from app import db
import bcrypt
import re

class UserModel(db.Model):
    """
    Classe que representa um usuário no sistema.
    Attributes:
        id (int): Identificador único do usuário.
        nome_completo (str): Nome completo do usuário.
        tipo_pessoa (str): Tipo de pessoa (física ou jurídica).
        cpf (str): CPF do usuário.
        cnpj (str): CNPJ do usuário.
        datanasc (date): Data de nascimento do usuário.
        cep (str): CEP do endereço do usuário.
        unid_federativa (str): Unidade federativa do endereço do usuário.
        cidade (str): Cidade do endereço do usuário.
        rua (str): Rua do endereço do usuário.
        bairro (str): Bairro do endereço do usuário.
        numero (str): Número do endereço do usuário.
        email (str): Email do usuário.
        senha_hash (str): Hash da senha do usuário.
        id_stripe (str): Identificador da conta Stripe do usuário.
        telefone_cel (str): Telefone celular.
        telefone_res (str): Telefone residencial.
        leiloes (list): Relação com os leilões criados pelo usuário.
        lances (list): Relação com os lances feitos pelo usuário.   
    Methods:
        set_senha(senha): Define a senha do usuário, armazenando seu hash.
        verify_senha(senha): Verifica se a senha fornecida corresponde ao hash armazenado.
        verificar_email(email): Verifica se o email fornecido está em um formato válido.
        verificar_senha(senha): Verifica se a senha atende aos critérios de segurança.
        validar_cpf(cpf): Valida o CPF fornecido.
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(100), nullable=False)
    tipo_pessoa = db.Column(db.String(50), nullable=False)
    cpf = db.Column(db.String(11), unique=True, nullable=True)
    cnpj = db.Column(db.String(14), unique=True, nullable=True)
    datanasc = db.Column(db.Date, nullable=False)
    cep = db.Column(db.String(50), nullable=False)
    unid_federativa = db.Column(db.String(50), nullable=False)
    cidade = db.Column(db.String(100), nullable=False)
    rua = db.Column(db.String(150), nullable=False)
    bairro = db.Column(db.String(100), nullable=False)
    numero = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)
    id_stripe = db.Column(db.String(255), nullable=True)
    telefone_cel = db.Column(db.String(15), nullable=True)
    telefone_res = db.Column(db.String(15), nullable=True)
    
    lances = db.relationship('LanceModel', back_populates='user')
    leiloes = db.relationship('LeilaoModel', back_populates='user')
        
    def set_senha(self, senha):
        salt = bcrypt.gensalt()
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
        
    def validar_cpf(cpf):
        cpf = ''.join(filter(str.isdigit, cpf))
    
        if len(cpf) != 11:
            return False
        
        if cpf == cpf[0] * 11:
            return False
        
        soma = 0
        for i in range(9):
            soma += int(cpf[i]) * (10 - i)
        
        resto = soma % 11
        digito1 = 0 if resto < 2 else 11 - resto
        
        if digito1 != int(cpf[9]):
            return False
        
        soma = 0
        for i in range(10):
            soma += int(cpf[i]) * (11 - i)
        
        resto = soma % 11
        digito2 = 0 if resto < 2 else 11 - resto
        
        return digito2 == int(cpf[10])
        
        