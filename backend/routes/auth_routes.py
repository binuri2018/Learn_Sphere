import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify
from models.user import User
from utils.auth import verify_password, generate_token
from middleware.auth_middleware import token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'Student')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Validate role
        if role not in ['Admin', 'Instructor', 'Student']:
            return jsonify({'message': 'Invalid role'}), 400
        
        user = User.create_user(email, password, role)
        
        if not user:
            return jsonify({'message': 'User already exists'}), 400
        
        token = generate_token(user['_id'], user['role'])
        
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': user
        }), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = User.get_user_by_email(email)
        
        if not user or not verify_password(password, user['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        token = generate_token(str(user['_id']), user['role'])
        
        user['_id'] = str(user['_id'])
        user.pop('password', None)
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current user info"""
    try:
        from flask import request
        user = User.get_user_by_id(request.current_user['user_id'])
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({'user': user}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/delete', methods=['DELETE'])
@token_required
def delete_account():
    """Delete user account"""
    try:
        from flask import request
        user_id = request.current_user['user_id']
        
        User.delete_user(user_id)
        
        return jsonify({'message': 'Account deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500
