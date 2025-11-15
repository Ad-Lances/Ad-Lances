from app import db

class LeilaoModel(db.Model):
    """
    Classe que representa um leilão no sistema.
    Attributes:
        id (int): Identificador único do leilão.
        nome (str): Nome do leilão.
        descricao (str): Descrição do leilão.
        id_subcategoria (int): Identificado da subcategoria do leilão.
        data_inicio (datetime): Data e hora de início do leilão.
        data_fim (datetime): Data e hora de término do leilão.
        lance_inicial (float): Valor do lance inicial do leilão.
        lance_atual (float): Valor do lance atual do leilão.
        min_incremento (float): Incremento mínimo para os lances no leilão.
        pagamento (str): Método de pagamento aceito no leilão.
        parcelas (str): Número de parcelas permitidas para o pagamento.
        foto (str): URL da foto associada ao leilão.
        id_user (int): Identificador do usuário que criou o leilão.
        categoria (CategoriaModel): Relação com a categoria do leilão.
        subcategoria (SubcategoriaModel): Relação com a subcategoria do leilão.
        user (UserModel): Relação com o usuário que criou o leilão.
        lances (list): Relação com os lances feitos no leilão.
        pagamentos (list): Relação com os pagamentos associados ao leilão.        
    Methods:
        get_data_inicio_str(): Retorna a data de início formatada como string.
        get_data_fim_str(): Retorna a data de fim formatada como string.
        get_lance_inicial_str(): Retorna o lance inicial formatado como string monetária.
        get_lance_atual_str(): Retorna o lance atual formatado como string monetária.
        get_foto(): Retorna a URL da foto do leilão ou uma imagem padrão se não houver foto.
        
    """
    __tablename__ = 'leiloes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    id_subcategoria = db.Column(db.Integer, db.ForeignKey('subcategorias.id'), nullable=False)
    data_inicio = db.Column(db.DateTime, nullable=False)
    data_fim = db.Column(db.DateTime, nullable=False)
    lance_inicial = db.Column(db.Float, nullable=False)
    lance_atual = db.Column(db.Float, nullable=True)
    min_incremento = db.Column(db.Float, nullable=False, server_default="0.1")
    parcelas = db.Column(db.String(3), nullable=False)
    foto = db.Column(db.String(255), nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    user = db.relationship('UserModel', back_populates='leiloes')
    subcategoria = db.relationship('SubcategoriaModel', back_populates='leiloes')
    lances = db.relationship('LanceModel', back_populates='leilao')
    pagamentos = db.relationship('PagamentoModel', secondary="leiloes_pagamentos", back_populates='leiloes')
    
    def get_data_inicio_str(self):
        """Retorna a data de início formatada como string."""
        return self.data_inicio.strftime("%d/%m/%y às %H:%M")
    
    def get_data_fim_str(self):
        """Retorna a data de fim formatada como string."""
        return self.data_fim.strftime("%d/%m/%y às %H:%M")
    
    def get_lance_inicial_str(self):
        """Retorna o lance inicial formatado como string monetária."""
        return f"R$ {self.lance_inicial:,.2f}".replace(',', 'p').replace('.', ',').replace('p', '.')
    
    def get_lance_atual_str(self):
        """Retorna o lance atual formatado como string monetária."""
        return f"R$ {self.lance_atual:,.2f}".replace(',', 'p').replace('.', ',').replace('p', '.')
    
    def get_foto(self):
        """Retorna a URL da foto do leilão ou uma imagem padrão se não houver foto."""
        return self.foto if self.foto else '/static/img/logo.png'