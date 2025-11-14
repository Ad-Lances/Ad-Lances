from app import db

class CategoriaModel(db.Model):
    __tablename__ = 'categorias'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), nullable=False, unique=True)
    leiloes = db.relationship('LeilaoModel', back_populates='categoria')
    subcategorias = db.relationship('SubcategoriaModel', back_populates='categoria')