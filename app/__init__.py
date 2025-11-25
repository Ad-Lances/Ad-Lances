from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import cloudinary
from config import Config
import stripe
from flask_socketio import SocketIO
from sqids import Sqids
from flask_mail import Mail
from itsdangerous import URLSafeTimedSerializer
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from redis import Redis

db = SQLAlchemy()
socketio = SocketIO(cors_allowed_origins="*", async_mode='gevent')
sqids = Sqids(min_length=6)
mail = Mail()
serial = None
limiter = Limiter(get_remote_address, default_limits=['30 per day', '20 per hour'])
red = None

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    cloudinary.config(cloudinary_url=app.config['CLOUDINARY_URL'], secure=True)
    stripe.api_key = app.config['STRIPE_KEY']
    global red
    red = Redis.from_url(
        app.config['REDIS_URL'],
        decode_responses = True
    )
    
    socketio.init_app(app)
    db.init_app(app)
    mail.init_app(app)
    limiter.init_app(app)
    
    global serial
    serial = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    
    from . import routes
    app.register_blueprint(routes.bp)
    
    with app.app_context():
        db.create_all()
    
    return app