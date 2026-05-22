import re

def validate_username(username):
    """Valider le nom d'utilisateur"""
    if not username or not isinstance(username, str):
        return False, "Username must be a non-empty string"
    if len(username) < 3:
        return False, "Username must be at least 3 characters"
    if len(username) > 50:
        return False, "Username must not exceed 50 characters"
    if not re.match("^[a-zA-Z0-9_]+$", username):
        return False, "Username can only contain alphanumeric characters and underscores"
    return True, "Valid"

def validate_email(email):
    """Valider l'email"""
    if not email or not isinstance(email, str):
        return False, "Email must be a non-empty string"
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        return False, "Invalid email format"
    return True, "Valid"

def validate_password(password):
    """Valider le mot de passe"""
    if not password or not isinstance(password, str):
        return False, "Password must be a non-empty string"
    if len(password) < 6:
        return False, "Password must be at least 6 characters"
    return True, "Valid"

def validate_confirm_password(password, confirm_password):
    """Valider la confirmation du mot de passe"""
    if password != confirm_password:
        return False, "Passwords do not match"
    return True, "Valid"


def validate_verification_code(code):
    """Valider le code de vérification envoyé par email"""
    if not code or not isinstance(code, str):
        return False, "Le code de vérification est requis"
    if len(code) != 4:
        return False, "Le code doit contenir exactement 4 chiffres"
    if not code.isdigit():
        return False, "Le code doit contenir uniquement des chiffres"
    return True, "Valid"


def validate_family_name(name):
    """Valider le nom de la famille"""
    if not name or not isinstance(name, str):
        return False, "Family name must be a non-empty string"
    if len(name) < 1:
        return False, "Family name must not be empty"
    if len(name) > 100:
        return False, "Family name must not exceed 100 characters"
    return True, "Valid"

def validate_family_member_name(name):
    """Valider le nom du membre de la famille"""
    if not name or not isinstance(name, str):
        return False, "Member name must be a non-empty string"
    if len(name) < 1:
        return False, "Member name must not be empty"
    if len(name) > 100:
        return False, "Member name must not exceed 100 characters"
    return True, "Valid"

def validate_role(role):
    """Valider le rôle"""
    valid_roles = ['Parent', 'Enfant', 'Tonton', 'Tante', 'Grand-mère', 'Grand-père', 'Autres']
    if role not in valid_roles:
        return False, f"Role must be one of: {', '.join(valid_roles)}"
    return True, "Valid"

def validate_shopping_list_name(name):
    """Valider le nom de la liste de courses"""
    if not name or not isinstance(name, str):
        return False, "Shopping list name must be a non-empty string"
    if len(name) < 1:
        return False, "Shopping list name must not be empty"
    if len(name) > 100:
        return False, "Shopping list name must not exceed 100 characters"
    return True, "Valid"

def validate_shopping_item_name(name):
    """Valider le nom de l'article"""
    if not name or not isinstance(name, str):
        return False, "Item name must be a non-empty string"
    if len(name) < 1:
        return False, "Item name must not be empty"
    if len(name) > 200:
        return False, "Item name must not exceed 200 characters"
    return True, "Valid"

def validate_user_data(data):
    """Valider les données d'inscription"""
    errors = {}
    
    # Validate username
    username_valid, username_msg = validate_username(data.get('username'))
    if not username_valid:
        errors['username'] = username_msg
    
    # Validate email
    email_valid, email_msg = validate_email(data.get('email'))
    if not email_valid:
        errors['email'] = email_msg
    
    # Validate password
    password_valid, password_msg = validate_password(data.get('password'))
    if not password_valid:
        errors['password'] = password_msg
    
    # Validate confirm password
    confirm_valid, confirm_msg = validate_confirm_password(
        data.get('password'),
        data.get('confirmPassword')
    )
    if not confirm_valid:
        errors['confirmPassword'] = confirm_msg
    
    # Validate display name (optional)
    if data.get('display_name'):
        if len(data.get('display_name')) > 100:
            errors['display_name'] = "Display name must not exceed 100 characters"
    
    return errors

def validate_family_data(data):
    """Valider les données de création de famille"""
    errors = {}
    
    # Validate name
    name_valid, name_msg = validate_family_name(data.get('name'))
    if not name_valid:
        errors['name'] = name_msg
    
    # Validate description (optional)
    if data.get('description'):
        if len(data.get('description')) > 500:
            errors['description'] = "Description must not exceed 500 characters"
    
    return errors

def validate_shopping_list_data(data):
    """Valider les données de création de liste de courses"""
    errors = {}
    
    # Validate name
    name_valid, name_msg = validate_shopping_list_name(data.get('name'))
    if not name_valid:
        errors['name'] = name_msg
    
    # Validate family_id
    if not data.get('family_id'):
        errors['family_id'] = "Family ID is required"
    elif not isinstance(data.get('family_id'), int):
        errors['family_id'] = "Family ID must be an integer"
    
    return errors

def validate_shopping_item_data(data):
    """Valider les données d'article de course"""
    errors = {}
    
    # Validate shopping_list_id
    if not data.get('shopping_list_id'):
        errors['shopping_list_id'] = "Shopping list ID is required"
    elif not isinstance(data.get('shopping_list_id'), int):
        errors['shopping_list_id'] = "Shopping list ID must be an integer"
    
    # Validate name
    name_valid, name_msg = validate_shopping_item_name(data.get('name'))
    if not name_valid:
        errors['name'] = name_msg
    
    # Optional fields validation
    if data.get('category') and len(data.get('category')) > 50:
        errors['category'] = "Category must not exceed 50 characters"
    
    if data.get('icon') and len(data.get('icon')) > 10:
        errors['icon'] = "Icon must not exceed 10 characters"
    
    if data.get('quantity') and len(data.get('quantity')) > 50:
        errors['quantity'] = "Quantity must not exceed 50 characters"
    
    return errors

def validate_family_member_data(data):
    """Valider les données de membre de famille"""
    errors = {}
    
    # Validate family_id
    if not data.get('family_id'):
        errors['family_id'] = "Family ID is required"
    elif not isinstance(data.get('family_id'), int):
        errors['family_id'] = "Family ID must be an integer"
    
    # Validate member_name
    name_valid, name_msg = validate_family_member_name(data.get('member_name'))
    if not name_valid:
        errors['member_name'] = name_msg
    
    # Validate role
    if data.get('role'):
        role_valid, role_msg = validate_role(data.get('role'))
        if not role_valid:
            errors['role'] = role_msg
    else:
        errors['role'] = "Role is required"
    
    return errors
