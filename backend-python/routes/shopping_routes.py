from flask import Blueprint
from middleware import token_required
from controllers.shopping_controller import (
    create_shopping_list, get_shopping_list, get_family_shopping_lists,
    update_shopping_list, delete_shopping_list, add_shopping_item,
    update_shopping_item, delete_shopping_item
)

shopping_bp = Blueprint('shopping', __name__)

# Shopping list routes
@shopping_bp.route('/', methods=['POST'])
@token_required
def create_shopping_list_route():
    return create_shopping_list()

@shopping_bp.route('/list/<int:list_id>', methods=['GET'])
@token_required
def get_shopping_list_route(list_id):
    return get_shopping_list(list_id)

@shopping_bp.route('/family/<int:family_id>', methods=['GET'])
@token_required
def get_family_shopping_lists_route(family_id):
    return get_family_shopping_lists(family_id)

@shopping_bp.route('/list/<int:list_id>', methods=['PUT'])
@token_required
def update_shopping_list_route(list_id):
    return update_shopping_list(list_id)

@shopping_bp.route('/list/<int:list_id>', methods=['DELETE'])
@token_required
def delete_shopping_list_route(list_id):
    return delete_shopping_list(list_id)

# Shopping item routes
@shopping_bp.route('/item', methods=['POST'])
@token_required
def add_shopping_item_route():
    return add_shopping_item()

@shopping_bp.route('/item/<int:item_id>', methods=['PUT'])
@token_required
def update_shopping_item_route(item_id):
    return update_shopping_item(item_id)

@shopping_bp.route('/item/<int:item_id>', methods=['DELETE'])
@token_required
def delete_shopping_item_route(item_id):
    return delete_shopping_item(item_id)
