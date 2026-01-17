from datetime import datetime
from bson import ObjectId

class User:
    @staticmethod
    def create_user(email, password, role='Student'):
        """Create a new user"""
        from utils.database import users_collection
        from utils.auth import hash_password
        
        # Check if user already exists
        if users_collection.find_one({'email': email}):
            return None
        
        user = {
            'email': email,
            'password': hash_password(password),
            'role': role,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user)
        user['_id'] = str(result.inserted_id)
        user.pop('password', None)
        return user
    
    @staticmethod
    def get_user_by_email(email):
        """Get user by email"""
        from utils.database import users_collection
        return users_collection.find_one({'email': email})
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        from utils.database import users_collection
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])
            user.pop('password', None)
        return user
    
    @staticmethod
    def delete_user(user_id):
        """Delete user by ID"""
        from utils.database import users_collection, profiles_collection
        users_collection.delete_one({'_id': ObjectId(user_id)})
        profiles_collection.delete_one({'user_id': user_id})
        return True
