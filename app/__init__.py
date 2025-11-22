from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import cloudinary
from config import Config
import stripe
from flask_socketio import SocketIO
from sqids import Sqids
from flask_mail import Mail
from itsdangerous import URLSafeTimedSerializer

db = SQLAlchemy()
socketio = SocketIO(cors_allowed_origins="*", async_mode='gevent')
sqids = Sqids(min_length=6)
mail = Mail()
serial = None

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    cloudinary.config(cloudinary_url=app.config['CLOUDINARY_URL'], secure=True)
    stripe.api_key = app.config['STRIPE_KEY']
    
    socketio.init_app(app)
    db.init_app(app)
    mail.init_app(app)
    
    global serial
    serial = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    
    from . import routes
    app.register_blueprint(routes.bp)
    
    with app.app_context():
        db.create_all()
    
    return app