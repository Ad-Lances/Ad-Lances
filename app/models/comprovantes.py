from app import db

class ComprovanteModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    horario = db.Column(db.DateTime, nullable=False)
    valor = db.Column(db.Float, nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    id_leilao = db.Column(db.Integer, db.ForeignKey('leiloes.id'), nullable=False)