from flask import Flask
from flask_argon2 import Argon2
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
argon2 = Argon2()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Mentecapto#171@localhost/adlances'
    
    argon2.init_app(app)
    db.init_app(app)
    
    from . import routes
    app.register_blueprint(routes.bp)
    
    with app.app_context():
        db.create_all()
    
    return app