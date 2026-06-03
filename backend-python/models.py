from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
import uuid

db = SQLAlchemy()

class User(db.Model):
    """Modèle utilisateur"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(100))
    active_family_id = db.Column(db.Integer, db.ForeignKey('families.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    push_token = db.Column(db.String(255), nullable=True)
    
    # Relationships
    family_members = db.relationship('FamilyMember', back_populates='user', cascade='all, delete-orphan')
    shopping_items = db.relationship('ShoppingItem', back_populates='added_by_user')
    shopping_lists = db.relationship('ShoppingList', back_populates='created_by_user')
    activity_logs = db.relationship('ActivityLog', back_populates='user')
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'display_name': self.display_name,
            'active_family_id': self.active_family_id,
            'created_at': self.created_at.isoformat(),
        }

class Family(db.Model):
    """Modèle famille"""
    __tablename__ = 'families'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    invite_code = db.Column(db.String(10), unique=True, nullable=True, index=True)
    
    # 🌟 NOUVEAU : La colonne d'expiration du code
    code_expires_at = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    members = db.relationship('FamilyMember', back_populates='family', cascade='all, delete-orphan')
    shopping_lists = db.relationship('ShoppingList', back_populates='family', cascade='all, delete-orphan')
    activity_logs = db.relationship('ActivityLog', back_populates='family', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_by_user_id': self.created_by_user_id,
            'invite_code': self.invite_code,
            # 🌟 NOUVEAU : On l'ajoute au dictionnaire renvoyé à l'application
            'code_expires_at': self.code_expires_at.isoformat() if self.code_expires_at else None,
            'created_at': self.created_at.isoformat(),
        }

class FamilyMember(db.Model):
    """Modèle membre de famille"""
    __tablename__ = 'family_members'
    
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.Integer, db.ForeignKey('families.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    member_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # Parent, Enfant, Tonton, etc.
    can_delete = db.Column(db.Boolean, default=True)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    family = db.relationship('Family', back_populates='members')
    user = db.relationship('User', back_populates='family_members')
    
    def to_dict(self):
        return {
            'id': self.id,
            'family_id': self.family_id,
            'user_id': self.user_id,
            'member_name': self.member_name,
            'role': self.role,
            'can_delete': self.can_delete,
            'joined_at': self.joined_at.isoformat(),
        }

class ShoppingList(db.Model):
    """Modèle liste de courses"""
    __tablename__ = 'shopping_lists'
    
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.Integer, db.ForeignKey('families.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    family = db.relationship('Family', back_populates='shopping_lists')
    created_by_user = db.relationship('User', back_populates='shopping_lists')
    items = db.relationship('ShoppingItem', back_populates='shopping_list', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'family_id': self.family_id,
            'name': self.name,
            'created_by_user_id': self.created_by_user_id,
            'created_at': self.created_at.isoformat(),
        }

class ShoppingItem(db.Model):
    """Modèle article de course"""
    __tablename__ = 'shopping_items'
    
    id = db.Column(db.Integer, primary_key=True)
    shopping_list_id = db.Column(db.Integer, db.ForeignKey('shopping_lists.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    icon = db.Column(db.String(10))
    category = db.Column(db.String(50))
    urgent = db.Column(db.Boolean, default=False)
    quantity = db.Column(db.String(50))
    checked = db.Column(db.Boolean, default=False)
    added_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bought_at = db.Column(db.DateTime, nullable=True)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    shopping_list = db.relationship('ShoppingList', back_populates='items')
    added_by_user = db.relationship('User', back_populates='shopping_items')
    
    def to_dict(self):
        return {
            'id': self.id,
            'shopping_list_id': self.shopping_list_id,
            'name': self.name,
            'icon': self.icon,
            'category': self.category,
            'urgent': self.urgent,
            'quantity': self.quantity,
            'checked': self.checked,
            'added_by_user_id': self.added_by_user_id,
            'bought_at': self.bought_at.isoformat() if self.bought_at else None,
            'added_at': self.added_at.isoformat(),
        }

class ActivityLog(db.Model):
    """Modèle journal d'activité"""
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.Integer, db.ForeignKey('families.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    item_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    family = db.relationship('Family', back_populates='activity_logs')
    user = db.relationship('User', back_populates='activity_logs')
    
    def to_dict(self):
        return {
            'id': self.id,
            'family_id': self.family_id,
            'user_id': self.user_id,
            'action': self.action,
            'description': self.description,
            'item_id': self.item_id,
            'created_at': self.created_at.isoformat(),
        }
