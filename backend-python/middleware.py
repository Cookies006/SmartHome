from flask import request, jsonify
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def token_required(f):
    """Décorateur pour vérifier le token JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            from models import User
            user = User.query.get(user_id)
            if not user:
                return {'error': 'User not found'}, 401
            return f(*args, **kwargs)
        except Exception as e:
            return {'error': 'Invalid or expired token'}, 401
    return decorated

def get_current_user():
    """Obtenir l'utilisateur actuel du token"""
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        from models import User
        return User.query.get(user_id)
    except:
        return None

class ErrorResponse:
    """Classe utilitaire pour les réponses d'erreur"""
    
    @staticmethod
    def error(message, status_code=400):
        return {'error': message}, status_code
    
    @staticmethod
    def not_found(message='Resource not found'):
        return {'error': message}, 404
    
    @staticmethod
    def unauthorized(message='Unauthorized'):
        return {'error': message}, 401
    
    @staticmethod
    def forbidden(message='Forbidden'):
        return {'error': message}, 403
    
    @staticmethod
    def conflict(message='Conflict'):
        return {'error': message}, 409
    
    @staticmethod
    def success(message, data=None, status_code=200):
        response = {'message': message}
        if data:
            response.update(data)
        return response, status_code
