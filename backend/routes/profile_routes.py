import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from middleware.auth_middleware import token_required
from utils.database import profiles_collection

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

@profile_bp.route('', methods=['POST'])
@token_required
def create_profile():
    """Create user profile"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        data = request.get_json()
        
        # Check if profile already exists
        existing = profiles_collection.find_one({'user_id': user_id})
        if existing:
            return jsonify({'message': 'Profile already exists'}), 400
        
        profile = {
            'user_id': user_id,
            'first_name': data.get('first_name', ''),
            'last_name': data.get('last_name', ''),
            'bio': data.get('bio', ''),
            'phone': data.get('phone', ''),
            'address': data.get('address', ''),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = profiles_collection.insert_one(profile)
        profile['_id'] = str(result.inserted_id)
        
        return jsonify({
            'message': 'Profile created successfully',
            'profile': profile
        }), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@profile_bp.route('', methods=['GET'])
@token_required
def get_profile():
    """Get user profile"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        
        profile = profiles_collection.find_one({'user_id': user_id})
        
        if not profile:
            return jsonify({'message': 'Profile not found'}), 404
        
        profile['_id'] = str(profile['_id'])
        
        return jsonify({'profile': profile}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@profile_bp.route('', methods=['PUT'])
@token_required
def update_profile():
    """Update user profile"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        data = request.get_json()
        
        profile = profiles_collection.find_one({'user_id': user_id})
        
        if not profile:
            return jsonify({'message': 'Profile not found'}), 404
        
        update_data = {
            'first_name': data.get('first_name', profile.get('first_name', '')),
            'last_name': data.get('last_name', profile.get('last_name', '')),
            'bio': data.get('bio', profile.get('bio', '')),
            'phone': data.get('phone', profile.get('phone', '')),
            'address': data.get('address', profile.get('address', '')),
            'updated_at': datetime.utcnow()
        }
        
        profiles_collection.update_one(
            {'user_id': user_id},
            {'$set': update_data}
        )
        
        updated_profile = profiles_collection.find_one({'user_id': user_id})
        updated_profile['_id'] = str(updated_profile['_id'])
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': updated_profile
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@profile_bp.route('', methods=['DELETE'])
@token_required
def delete_profile():
    """Delete user profile"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        
        result = profiles_collection.delete_one({'user_id': user_id})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Profile not found'}), 404
        
        return jsonify({'message': 'Profile deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500
