from flask import Blueprint
from middleware import token_required
from controllers.family_controller import (
    create_family, get_family, add_member, update_member, remove_member, join_family
)
from controllers.family_controller import generate_family_code 

family_bp = Blueprint('families', __name__)

@family_bp.route('', methods=['POST'])
@token_required
def create_family_route():
    return create_family()

@family_bp.route('/<int:family_id>', methods=['GET'])
@token_required
def get_family_route(family_id):
    return get_family(family_id)

@family_bp.route('/<int:family_id>/members', methods=['POST'])
@token_required
def add_member_route(family_id):
    return add_member(family_id)

@family_bp.route('/members/<int:member_id>', methods=['PUT'])
@token_required
def update_member_route(member_id):
    return update_member(member_id)

@family_bp.route('/members/<int:member_id>', methods=['DELETE'])
@token_required
def remove_member_route(member_id):
    return remove_member(member_id)

@family_bp.route('/join', methods=['POST'])
@token_required
def join_family_route():
    return join_family()



@family_bp.route('/<int:family_id>/generate-code', methods=['POST'])
@token_required
def generate_family_code_route(family_id):
    return generate_family_code(family_id)
