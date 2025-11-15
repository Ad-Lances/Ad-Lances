from app import db

class PagamentoModel(db.Model):
    __tablename__ = 'pagamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50), nullable=False)
    
    leiloes = db.relationship('LeilaoModel', secondary="leiloes_pagamentos", back_populates='pagamentos')