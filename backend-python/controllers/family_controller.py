from flask import request
import random
import string
from models import db, Family, FamilyMember, User
from middleware import get_current_user, ErrorResponse
from validation import validate_family_data, validate_family_member_data, validate_role
from activity_log import log_activity

# Family Controller

def create_family():
    """Créer une nouvelle famille"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        data = request.get_json()
        
        # Validate input
        errors = validate_family_data(data)
        if errors:
            return {'error': 'Validation failed', 'details': errors}, 400
        
        name = data['name']
        description = data.get('description', '')
        
        # Generate invite code
        invite_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        
        # Create family
        family = Family(
            name=name,
            description=description,
            created_by_user_id=user.id,
            invite_code=invite_code
        )
        db.session.add(family)
        db.session.commit()
        
        # Add creator as first member
        member = FamilyMember(
            family_id=family.id,
            user_id=user.id,
            member_name=user.username,
            role='Parent'
        )
        db.session.add(member)
        db.session.commit()
        
        # Log activity
        log_activity(family.id, user.id, 'CREATE_FAMILY', f'Created family: {name}')
        
        return {
            'message': 'Family created successfully',
            'family': family.to_dict()
        }, 201
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def get_family(family_id):
    """Obtenir les détails d'une famille"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        family = Family.query.get(family_id)
        if not family:
            return {'error': 'Family not found'}, 404
        
        members = [m.to_dict() for m in family.members]
        
        return {
            'family': family.to_dict(),
            'members': members
        }, 200
    
    except Exception as e:
        return {'error': str(e)}, 500

def add_member(family_id):
    """Ajouter un membre à la famille"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        data = request.get_json()
        data['family_id'] = family_id
        
        # Validate input
        errors = validate_family_member_data(data)
        if errors:
            return {'error': 'Validation failed', 'details': errors}, 400
        
        family = Family.query.get(family_id)
        if not family:
            return {'error': 'Family not found'}, 404
        
        member_name = data['member_name']
        role = data['role']
        user_id = data.get('user_id')
        
        # Create member
        member = FamilyMember(
            family_id=family_id,
            user_id=user_id,
            member_name=member_name,
            role=role
        )
        db.session.add(member)
        db.session.commit()
        
        # Log activity
        log_activity(family_id, user.id, 'ADD_MEMBER', f'Added member: {member_name}')
        
        return {
            'message': 'Member added successfully',
            'member': member.to_dict()
        }, 201
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def update_member(member_id):
    """Mettre à jour un membre de la famille"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        data = request.get_json()
        
        member = FamilyMember.query.get(member_id)
        if not member:
            return {'error': 'Member not found'}, 404
        
        if data.get('member_name'):
            member.member_name = data['member_name']
        
        if data.get('role'):
            role_valid, role_msg = validate_role(data['role'])
            if not role_valid:
                return {'error': role_msg}, 400
            member.role = data['role']
        
        db.session.commit()
        
        # Log activity
        log_activity(member.family_id, user.id, 'UPDATE_MEMBER', f'Updated member: {member.member_name}')
        
        return {
            'message': 'Member updated successfully',
            'member': member.to_dict()
        }, 200
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def remove_member(member_id):
    """Supprimer un membre de la famille"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        member = FamilyMember.query.get(member_id)
        if not member:
            return {'error': 'Member not found'}, 404
        
        if not member.can_delete:
            return {'error': 'Cannot delete this member'}, 400
        
        family_id = member.family_id
        db.session.delete(member)
        db.session.commit()
        
        # Log activity
        log_activity(family_id, user.id, 'REMOVE_MEMBER', f'Removed member: {member.member_name}')
        
        return {
            'message': 'Member removed successfully'
        }, 200
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def join_family():
    """Rejoindre une famille avec un code d'invitation"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        data = request.get_json()
        invite_code = data.get('invite_code')
        
        if not invite_code:
            return {'error': 'Invite code required'}, 400
        
        family = Family.query.filter_by(invite_code=invite_code).first()
        if not family:
            return {'error': 'Invalid or expired invite code'}, 404
        
        # Check if user is already a member
        existing_member = FamilyMember.query.filter_by(
            family_id=family.id,
            user_id=user.id
        ).first()
        if existing_member:
            return {'error': 'Already a member of this family'}, 409
        
        # Add user as member
        member = FamilyMember(
            family_id=family.id,
            user_id=user.id,
            member_name=user.username,
            role='Enfant'
        )
        db.session.add(member)
        db.session.commit()
        
        # Log activity
        log_activity(family.id, user.id, 'JOIN_FAMILY', f'Joined family: {family.name}')
        
        return {
            'message': 'Successfully joined family',
            'family_id': family.id,
            'member': member.to_dict()
        }, 201
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
