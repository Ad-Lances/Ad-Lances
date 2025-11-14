from app import db

class SubcategoriaModel(db.Model):
    __tablename__ = 'subcategorias'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), nullable=False, unique=True)
    id_categoria = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    categoria = db.relationship('CategoriaModel', back_populates='subcategorias')
    leiloes = db.relationship('LeilaoModel', back_populates='subcategoria')