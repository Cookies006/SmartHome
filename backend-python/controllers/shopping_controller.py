from flask import request
from datetime import datetime
from models import db, ShoppingList, ShoppingItem, Family
from middleware import get_current_user
from validation import validate_shopping_list_data, validate_shopping_item_data
from activity_log import log_activity

# Shopping Controller

def create_shopping_list():
    """Créer une nouvelle liste de courses"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        data = request.get_json()
        
        # Validate input
        errors = validate_shopping_list_data(data)
        if errors:
            return {'error': 'Validation failed', 'details': errors}, 400
        
        family_id = data['family_id']
        name = data['name']
        
        # Check family exists
        family = Family.query.get(family_id)
        if not family:
            return {'error': 'Family not found'}, 404
        
        # Create shopping list
        shopping_list = ShoppingList(
            family_id=family_id,
            name=name,
            created_by_user_id=user.id
        )
        db.session.add(shopping_list)
        db.session.commit()
        
        # Log activity
        log_activity(family_id, user.id, 'CREATE_LIST', f'Created shopping list: {name}')
        
        return {
            'message': 'Shopping list created successfully',
            'list': shopping_list.to_dict()
        }, 201
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def get_shopping_list(list_id):
    """Obtenir une liste de courses avec ses articles"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        shopping_list = ShoppingList.query.get(list_id)
        if not shopping_list:
            return {'error': 'Shopping list not found'}, 404
        
        items = [item.to_dict() for item in shopping_list.items]
        
        return {
            'list': shopping_list.to_dict(),
            'items': items
        }, 200
    
    except Exception as e:
        return {'error': str(e)}, 500

def get_family_shopping_lists(family_id):
    """Obtenir toutes les listes de courses d'une famille"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        family = Family.query.get(family_id)
        if not family:
            return {'error': 'Family not found'}, 404
        
        lists = ShoppingList.query.filter_by(family_id=family_id).order_by(ShoppingList.created_at.desc()).all()
        lists_data = [lst.to_dict() for lst in lists]
        
        return {
            'lists': lists_data
        }, 200
    
    except Exception as e:
        return {'error': str(e)}, 500

def update_shopping_list(list_id):
    """Mettre à jour une liste de courses"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        data = request.get_json()
        
        shopping_list = ShoppingList.query.get(list_id)
        if not shopping_list:
            return {'error': 'Shopping list not found'}, 404
        
        if data.get('name'):
            shopping_list.name = data['name']
        
        db.session.commit()
        
        # Log activity
        log_activity(shopping_list.family_id, user.id, 'UPDATE_LIST', f'Updated list: {shopping_list.name}')
        
        return {
            'message': 'Shopping list updated successfully',
            'list': shopping_list.to_dict()
        }, 200
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def delete_shopping_list(list_id):
    """Supprimer une liste de courses"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        shopping_list = ShoppingList.query.get(list_id)
        if not shopping_list:
            return {'error': 'Shopping list not found'}, 404
        
        family_id = shopping_list.family_id
        list_name = shopping_list.name
        
        db.session.delete(shopping_list)
        db.session.commit()
        
        # Log activity
        log_activity(family_id, user.id, 'DELETE_LIST', f'Deleted list: {list_name}')
        
        return {
            'message': 'Shopping list deleted successfully'
        }, 200
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def add_shopping_item():
    """Ajouter un article à la liste de courses"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        data = request.get_json()
        
        # Validate input
        errors = validate_shopping_item_data(data)
        if errors:
            return {'error': 'Validation failed', 'details': errors}, 400
        
        list_id = data['shopping_list_id']
        shopping_list = ShoppingList.query.get(list_id)
        if not shopping_list:
            return {'error': 'Shopping list not found'}, 404
        
        # Create item
        item = ShoppingItem(
            shopping_list_id=list_id,
            name=data['name'],
            icon=data.get('icon'),
            category=data.get('category'),
            urgent=data.get('urgent', False),
            quantity=data.get('quantity'),
            added_by_user_id=user.id
        )
        db.session.add(item)
        db.session.commit()
        
        # Log activity
        log_activity(shopping_list.family_id, user.id, 'ADD_ITEM', f'Added item: {data["name"]}')
        
        return {
            'message': 'Shopping item added successfully',
            'item': item.to_dict()
        }, 201
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def update_shopping_item(item_id):
    """Mettre à jour un article"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        data = request.get_json()
        
        item = ShoppingItem.query.get(item_id)
        if not item:
            return {'error': 'Shopping item not found'}, 404
        
        if data.get('name'):
            item.name = data['name']
        if data.get('icon') is not None:
            item.icon = data['icon']
        if data.get('category') is not None:
            item.category = data['category']
        if data.get('urgent') is not None:
            item.urgent = data['urgent']
        if data.get('quantity') is not None:
            item.quantity = data['quantity']
        if data.get('checked') is not None:
            item.checked = data['checked']
            if data['checked']:
                item.bought_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log activity
        shopping_list = ShoppingList.query.get(item.shopping_list_id)
        log_activity(shopping_list.family_id, user.id, 'UPDATE_ITEM', f'Updated item: {item.name}')
        
        return {
            'message': 'Shopping item updated successfully',
            'item': item.to_dict()
        }, 200
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def delete_shopping_item(item_id):
    """Supprimer un article"""
    try:
        user = get_current_user()
        if not user:
            return {'error': 'Unauthorized'}, 401
        
        item = ShoppingItem.query.get(item_id)
        if not item:
            return {'error': 'Shopping item not found'}, 404
        
        shopping_list = ShoppingList.query.get(item.shopping_list_id)
        item_name = item.name
        
        db.session.delete(item)
        db.session.commit()
        
        # Log activity
        log_activity(shopping_list.family_id, user.id, 'DELETE_ITEM', f'Deleted item: {item_name}')
        
        return {
            'message': 'Shopping item deleted successfully'
        }, 200
    
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
