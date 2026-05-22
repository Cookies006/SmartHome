import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuration de base"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ALGORITHM = 'HS256'
    
    # CORS - Support local development and production
    CORS_ORIGINS = os.getenv('CORS_ORIGIN', 'http://localhost:8081,http://localhost:3000,https://smarthome-i3kj.onrender.com').split(',')

class DevelopmentConfig(Config):
    """Configuration de développement - SQLite par défaut"""
    DEBUG = True
    # Utiliser SQLite pour le développement (aucune installation requise)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'SQLALCHEMY_DATABASE_URI',
        'sqlite:///smarthome.db'
    )

class ProductionConfig(Config):
    """Configuration de production - PostgreSQL"""
    DEBUG = False
    # PostgreSQL Database pour la production
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
        f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )

class TestingConfig(Config):
    """Configuration de test"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
