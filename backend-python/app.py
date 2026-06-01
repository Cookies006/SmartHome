import os
from flask import Flask, current_app
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from models import db
from datetime import timedelta
from dotenv import load_dotenv
from flask_mail import Mail, Message

load_dotenv()

# Initialize extensions
jwt = JWTManager()
mail = Mail()



def create_app(config_name=None):
    """Application factory"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # =======================================================
    # Empêche Render de changer la clé au redémarrage
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'une-cle-secrete-par-defaut-pour-le-local')
    
    # Applique votre expiration (168h par défaut)
    jwt_expire_hours = int(os.getenv('JWT_EXPIRE_HOURS', 168))
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=jwt_expire_hours)
    # =======================================================
    
    # Configuration Mail
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    
    # Setup CORS
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:8081,http://localhost:3000').split(',')
    CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)
    
    # Register blueprints
    print(">>> Importing auth_bp")
    from routes.auth_routes import auth_bp
    print(">>> Importing family_bp")
    from routes.family_routes import family_bp
    print(">>> Importing shopping_bp")
    from routes.shopping_routes import shopping_bp
    
    
    
    print(">>> Registering blueprints")
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(family_bp, url_prefix='/api/families')
    app.register_blueprint(shopping_bp, url_prefix='/api/shopping')
    print(">>> Done")
    
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Internal server error'}, 500
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'ok', 'message': 'SmartHome Backend API'}, 200
    

    
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
