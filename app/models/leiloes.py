from app import db

class LeilaoModel(db.Model):
    __tablename__ = 'leiloes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    id_categoria = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    subcategoria = db.Column(db.String(50), nullable=False)
    data_inicio = db.Column(db.DateTime, nullable=False)
    data_fim = db.Column(db.DateTime, nullable=False)
    lance_inicial = db.Column(db.Float, nullable=False)
    lance_atual = db.Column(db.Float, nullable=True)
    pagamento = db.Column(db.String(50), nullable=False)
    parcelas = db.Column(db.String(3), nullable=False)
    foto = db.Column(db.String(255), nullable=False)
    
    categoria = db.relationship('CategoriaModel', back_populates='leiloes')
    
    def get_data_inicio_str(self):
        return self.data_inicio.strftime("%d/%m/%y às %H:%M")
    
    def get_data_fim_str(self):
        return self.data_fim.strftime("%d/%m/%y às %H:%M")
    
    def get_lance_inicial_str(self):
        return f"R$ {self.lance_inicial:,.2f}".replace(',', 'p').replace('.', ',').replace('p', '.')
    
    def get_lance_atual_str(self):
        return f"R$ {self.lance_atual:,.2f}".replace(',', 'p').replace('.', ',').replace('p', '.')
    
    def get_foto(self):
        return self.foto if self.foto else '/static/img/logo.png'