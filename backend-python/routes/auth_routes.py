from flask import Blueprint
from middleware import token_required
from controllers.auth_controller import register, login, get_profile, update_profile, verify_code, save_push_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_route():
    return register()

@auth_bp.route('/verify-code', methods=['POST'])
def verify_code_route():
    return verify_code()

@auth_bp.route('/login', methods=['POST'])
def login_route():
    return login()

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile_route():
    return get_profile()

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile_route():
    return update_profile()

@auth_bp.route('/push-token', methods=['PUT'])
@token_required
def save_push_token_route():
    return save_push_token()
