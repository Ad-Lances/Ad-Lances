import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"connect_args": {"ssl": {"ssl-disabled": False}}}
    SECRET_KEY = os.getenv('SECRET_KEY', 'aderbal')
    CLOUDINARY_URL = os.getenv('CLOUDINARY_URL')
    STRIPE_KEY = os.getenv('STRIPE_API_KEY') 
    STRIPE_WEBHOOK_PAYMENT = os.getenv('STRIPE_WEBHOOK_PAYMENT')
    STRIPE_WEBHOOK_ACCOUNT = os.getenv('STRIPE_WEBHOOK_ACCOUNT')
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'adlances.noreply@gmail.com'
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = 'adlances.noreply@gmail.com'