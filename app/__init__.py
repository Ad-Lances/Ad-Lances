from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from dotenv import load_dotenv  # Adicione esta linha

load_dotenv()  # Adicione esta linha

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    
    from . import routes
    app.register_blueprint(routes.bp)
    
    with app.app_context():
        db.create_all()
    
    return app