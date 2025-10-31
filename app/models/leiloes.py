from app import db

class LeilaoModel(db.Model):
    __tablename__ = 'leiloes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    subcategoria = db.Column(db.String(50), nullable=False)
    data_inicio = db.Column(db.DateTime, nullable=False)
    data_fim = db.Column(db.DateTime, nullable=False)
    lance_inicial = db.Column(db.Float, nullable=False)
    pagamento = db.Column(db.String(50), nullable=False)
    parcelas = db.Column(db.String(3), nullable=False)
    foto = db.Column(db.String(255), nullable=False)
    
    