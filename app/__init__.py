from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import cloudinary
from config import Config
from dotenv import load_dotenv 
import stripe

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    cloudinary.config(cloudinary_url=app.config['CLOUDINARY_URL'], secure=True)
    stripe.api_key = app.config['STRIPE_KEY']
    
    db.init_app(app)
    
    from . import routes
    app.register_blueprint(routes.bp)
    
    with app.app_context():
        db.create_all()
    
    return app