import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from middleware.auth_middleware import token_required, role_required
from utils.database import courses_collection, lessons_collection

course_bp = Blueprint('course', __name__, url_prefix='/api/courses')

@course_bp.route('', methods=['POST'])
@role_required('Admin', 'Instructor')
def create_course():
    """Create a new course (Admin/Instructor only)"""
    try:
        from flask import request as req
        instructor_id = req.current_user['user_id']
        data = request.get_json()
        
        course = {
            'title': data.get('title'),
            'description': data.get('description', ''),
            'instructor_id': instructor_id,
            'category': data.get('category', ''),
            'price': data.get('price', 0),
            'duration': data.get('duration', 0),
            'level': data.get('level', 'Beginner'),
            'is_published': data.get('is_published', False),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        if not course['title']:
            return jsonify({'message': 'Title is required'}), 400
        
        result = courses_collection.insert_one(course)
        course['_id'] = str(result.inserted_id)
        
        return jsonify({
            'message': 'Course created successfully',
            'course': course
        }), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@course_bp.route('', methods=['GET'])
@token_required
def get_courses():
    """Get all courses"""
    try:
        courses = list(courses_collection.find())
        
        for course in courses:
            course['_id'] = str(course['_id'])
            # Get lesson count
            lesson_count = lessons_collection.count_documents({'course_id': str(course['_id'])})
            course['lesson_count'] = lesson_count
        
        return jsonify({'courses': courses}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@course_bp.route('/<course_id>', methods=['GET'])
@token_required
def get_course(course_id):
    """Get a specific course"""
    try:
        course = courses_collection.find_one({'_id': ObjectId(course_id)})
        
        if not course:
            return jsonify({'message': 'Course not found'}), 404
        
        course['_id'] = str(course['_id'])
        
        # Get lessons for this course
        lessons = list(lessons_collection.find({'course_id': course_id}))
        for lesson in lessons:
            lesson['_id'] = str(lesson['_id'])
        
        course['lessons'] = lessons
        course['lesson_count'] = len(lessons)
        
        return jsonify({'course': course}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@course_bp.route('/<course_id>', methods=['PUT'])
@role_required('Admin', 'Instructor')
def update_course(course_id):
    """Update a course (Admin/Instructor only)"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        data = request.get_json()
        
        course = courses_collection.find_one({'_id': ObjectId(course_id)})
        
        if not course:
            return jsonify({'message': 'Course not found'}), 404
        
        # Check if user is the instructor or admin
        if course['instructor_id'] != user_id and req.current_user['role'] != 'Admin':
            return jsonify({'message': 'You can only update your own courses'}), 403
        
        update_data = {
            'title': data.get('title', course.get('title')),
            'description': data.get('description', course.get('description', '')),
            'category': data.get('category', course.get('category', '')),
            'price': data.get('price', course.get('price', 0)),
            'duration': data.get('duration', course.get('duration', 0)),
            'level': data.get('level', course.get('level', 'Beginner')),
            'is_published': data.get('is_published', course.get('is_published', False)),
            'updated_at': datetime.utcnow()
        }
        
        courses_collection.update_one(
            {'_id': ObjectId(course_id)},
            {'$set': update_data}
        )
        
        updated_course = courses_collection.find_one({'_id': ObjectId(course_id)})
        updated_course['_id'] = str(updated_course['_id'])
        
        return jsonify({
            'message': 'Course updated successfully',
            'course': updated_course
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@course_bp.route('/<course_id>', methods=['DELETE'])
@role_required('Admin', 'Instructor')
def delete_course(course_id):
    """Delete a course (Admin/Instructor only)"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        
        course = courses_collection.find_one({'_id': ObjectId(course_id)})
        
        if not course:
            return jsonify({'message': 'Course not found'}), 404
        
        # Check if user is the instructor or admin
        if course['instructor_id'] != user_id and req.current_user['role'] != 'Admin':
            return jsonify({'message': 'You can only delete your own courses'}), 403
        
        # Delete course and its lessons
        courses_collection.delete_one({'_id': ObjectId(course_id)})
        lessons_collection.delete_many({'course_id': course_id})
        
        return jsonify({'message': 'Course deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500
