from app import db

class LeilaoPagamentoModel(db.Model):
    __tablename__ = 'leiloes_pagamentos'
    
    id_leilao = db.Column(db.Integer, db.ForeignKey('leiloes.id'), nullable=False, primary_key=True)
    id_pagamento = db.Column(db.Integer, db.ForeignKey('pagamentos.id'), nullable=False, primary_key=True)