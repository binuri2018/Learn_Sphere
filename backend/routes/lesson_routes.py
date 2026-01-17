import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from middleware.auth_middleware import token_required, role_required
from utils.database import lessons_collection, courses_collection

lesson_bp = Blueprint('lesson', __name__, url_prefix='/api')

@lesson_bp.route('/courses/<course_id>/lessons', methods=['POST'])
@role_required('Admin', 'Instructor')
def create_lesson(course_id):
    """Create a lesson for a course (Admin/Instructor only)"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        data = request.get_json()
        
        # Verify course exists and user has permission
        course = courses_collection.find_one({'_id': ObjectId(course_id)})
        if not course:
            return jsonify({'message': 'Course not found'}), 404
        
        if course['instructor_id'] != user_id and req.current_user['role'] != 'Admin':
            return jsonify({'message': 'You can only add lessons to your own courses'}), 403
        
        lesson = {
            'course_id': course_id,
            'title': data.get('title'),
            'content': data.get('content', ''),
            'lesson_type': data.get('lesson_type', 'text'),  # 'text' or 'video'
            'video_url': data.get('video_url', ''),
            'order': data.get('order', 0),
            'duration': data.get('duration', 0),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        if not lesson['title']:
            return jsonify({'message': 'Title is required'}), 400
        
        result = lessons_collection.insert_one(lesson)
        lesson['_id'] = str(result.inserted_id)
        
        return jsonify({
            'message': 'Lesson created successfully',
            'lesson': lesson
        }), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@lesson_bp.route('/courses/<course_id>/lessons', methods=['GET'])
@token_required
def get_lessons(course_id):
    """Get all lessons for a course"""
    try:
        # Verify course exists
        course = courses_collection.find_one({'_id': ObjectId(course_id)})
        if not course:
            return jsonify({'message': 'Course not found'}), 404
        
        lessons = list(lessons_collection.find({'course_id': course_id}).sort('order', 1))
        
        for lesson in lessons:
            lesson['_id'] = str(lesson['_id'])
        
        return jsonify({'lessons': lessons}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@lesson_bp.route('/lessons/<lesson_id>', methods=['PUT'])
@role_required('Admin', 'Instructor')
def update_lesson(lesson_id):
    """Update a lesson (Admin/Instructor only)"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        data = request.get_json()
        
        lesson = lessons_collection.find_one({'_id': ObjectId(lesson_id)})
        
        if not lesson:
            return jsonify({'message': 'Lesson not found'}), 404
        
        # Verify course ownership
        course = courses_collection.find_one({'_id': ObjectId(lesson['course_id'])})
        if course['instructor_id'] != user_id and req.current_user['role'] != 'Admin':
            return jsonify({'message': 'You can only update lessons in your own courses'}), 403
        
        update_data = {
            'title': data.get('title', lesson.get('title')),
            'content': data.get('content', lesson.get('content', '')),
            'lesson_type': data.get('lesson_type', lesson.get('lesson_type', 'text')),
            'video_url': data.get('video_url', lesson.get('video_url', '')),
            'order': data.get('order', lesson.get('order', 0)),
            'duration': data.get('duration', lesson.get('duration', 0)),
            'updated_at': datetime.utcnow()
        }
        
        lessons_collection.update_one(
            {'_id': ObjectId(lesson_id)},
            {'$set': update_data}
        )
        
        updated_lesson = lessons_collection.find_one({'_id': ObjectId(lesson_id)})
        updated_lesson['_id'] = str(updated_lesson['_id'])
        
        return jsonify({
            'message': 'Lesson updated successfully',
            'lesson': updated_lesson
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@lesson_bp.route('/lessons/<lesson_id>', methods=['DELETE'])
@role_required('Admin', 'Instructor')
def delete_lesson(lesson_id):
    """Delete a lesson (Admin/Instructor only)"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        
        lesson = lessons_collection.find_one({'_id': ObjectId(lesson_id)})
        
        if not lesson:
            return jsonify({'message': 'Lesson not found'}), 404
        
        # Verify course ownership
        course = courses_collection.find_one({'_id': ObjectId(lesson['course_id'])})
        if course['instructor_id'] != user_id and req.current_user['role'] != 'Admin':
            return jsonify({'message': 'You can only delete lessons in your own courses'}), 403
        
        lessons_collection.delete_one({'_id': ObjectId(lesson_id)})
        
        return jsonify({'message': 'Lesson deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500
