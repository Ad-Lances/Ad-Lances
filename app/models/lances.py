from app import db

class LanceModel(db.Model):
    __tablename__ = "lances"
    
    id = db.Column(db.Integer, primary_key=True)
    valor = db.Column(db.Float, nullable=False)
    horario = db.Column(db.DateTime(timezone=True), nullable=False)
    id_leilao = db.Column(db.Integer, db.ForeignKey('leiloes.id'), nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('UserModel', back_populates='lances')
    leilao = db.relationship('LeilaoModel', back_populates='lances')
    
    def get_ultimo_lance(id_leilao:int):
        return LanceModel.query.filter_by(id_leilao=id_leilao).order_by(LanceModel.horario.desc()).first()
    
    def get_valor_str(self):
        return f"R$ {self.valor:,.2f}".replace(",", "p").replace(".", ",").replace("p", ".")