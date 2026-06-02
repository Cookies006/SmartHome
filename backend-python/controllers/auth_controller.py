from flask import request
from flask_jwt_extended import create_access_token
from datetime import timedelta
import bcrypt
import os
from models import db, User
from middleware import ErrorResponse, token_required, get_current_user
from validation import validate_user_data
from email_utils import envoyer_code_verification

# Auth Controller

import random
from datetime import datetime, timedelta

# Dictionnaire temporaire pour stocker les codes
verification_codes = {}

def register():
    """Enregistrer un nouvel utilisateur"""
    try:
        data = request.get_json()
        
        # Validate input
        errors = validate_user_data(data)
        if errors:
            return {'error': 'Validation failed', 'details': errors}, 400
        
        username = data['username']
        email = data['email']
        password = data['password']
        display_name = data.get('display_name', username)
        
        # Vérifier si l'utilisateur existe déjà
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return {'error': 'Username already exists'}, 409
        
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            return {'error': 'Email already exists'}, 409
        
        # Générer le code de vérification
        code = str(random.randint(1000, 9999))
        
        # Stocker le code temporairement avec expiration 10 min
        verification_codes[email] = {
            'code': code,
            'expires_at': datetime.utcnow() + timedelta(minutes=10),
            'data': {
                'username': username,
                'email': email,
                'password': password,
                'display_name': display_name
            }
        }
        
        # Envoyer le mail
        try:
            envoyer_code_verification(email, code)
        except Exception as e:
            print(f"⚠ Warning: Email could not be sent: {e}")
        
        return {
            'message': 'Code de vérification envoyé sur ' + email,
        }
    
    except Exception as e:
        return {'error': str(e)}, 500


def verify_code():
    """Vérifier le code et créer le compte"""
    try:
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')
        
        # Vérifier si le code existe
        if email not in verification_codes:
            return {'error': 'Aucun code trouvé pour cet email'}, 400
        
        stored = verification_codes[email]
        
        # Vérifier expiration
        if datetime.utcnow() > stored['expires_at']:
            del verification_codes[email]
            return {'error': 'Code expiré, veuillez recommencer'}, 400
        
        # Vérifier le code
        if stored['code'] != code:
            return {'error': 'Code incorrect'}, 400
        
        # Créer le compte
        user_data = stored['data']
        password_hash = bcrypt.hashpw(
            user_data['password'].encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        user = User(
            username=user_data['username'],
            email=user_data['email'],
            password_hash=password_hash,
            display_name=user_data['display_name']
        )
        db.session.add(user)
        db.session.commit()
        
        # Supprimer le code utilisé
        del verification_codes[email]
        
        # 🌟 CORRECTION ICI : identity=str(user.id) au lieu de user.id
        access_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=int(os.getenv('JWT_EXPIRE_HOURS', 168)))
        )
        
        return {
            'message': 'Compte créé avec succès',
            'user': user.to_dict(),
            'token': access_token
        }, 201
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def login():
    """Connexion utilisateur"""
    try:
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return {'error': 'Username and password required'}, 400
        
        # Find user
        user = User.query.filter_by(username=username).first()
        if not user:
            return {'error': 'Invalid username or password'}, 401
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return {'error': 'Invalid username or password'}, 401
        
        # 🌟 CORRECTION ICI : identity=str(user.id) au lieu de user.id
        access_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=int(os.getenv('JWT_EXPIRE_HOURS', 168)))
        )
        
        return {
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'display_name': user.display_name,
                'active_family_id': user.active_family_id,
            },
            'token': access_token
        }, 200
    
    except Exception as e:
        return {'error': str(e)}, 500

def get_profile():
    """Obtenir le profil utilisateur"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'User not found'}, 401
        
        # Get user families
        families = [f.to_dict() for f in user.family_members]
        
        return {
            'user': user.to_dict(),
            'families': families
        }, 200
    
    except Exception as e:
        return {'error': str(e)}, 500

def update_profile():
    """Mettre à jour le profil utilisateur"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'User not found'}, 401
        
        data = request.get_json()
        
        if data.get('display_name'):
            user.display_name = data['display_name']
        
        if data.get('active_family_id'):
            user.active_family_id = data['active_family_id']
        
        db.session.commit()
        
        return {
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }, 200
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
