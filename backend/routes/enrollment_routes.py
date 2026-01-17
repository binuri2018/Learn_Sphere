import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from middleware.auth_middleware import token_required, role_required
from utils.database import enrollments_collection, courses_collection, lessons_collection

enrollment_bp = Blueprint('enrollment', __name__, url_prefix='/api')

@enrollment_bp.route('/enroll', methods=['POST'])
@role_required('Student')
def enroll_in_course():
    """Enroll in a course (Student only)"""
    try:
        from flask import request as req
        student_id = req.current_user['user_id']
        data = request.get_json()
        course_id = data.get('course_id')
        
        if not course_id:
            return jsonify({'message': 'Course ID is required'}), 400
        
        # Verify course exists
        course = courses_collection.find_one({'_id': ObjectId(course_id)})
        if not course:
            return jsonify({'message': 'Course not found'}), 404
        
        # Check if already enrolled
        existing = enrollments_collection.find_one({
            'student_id': student_id,
            'course_id': course_id
        })
        
        if existing:
            return jsonify({'message': 'Already enrolled in this course'}), 400
        
        enrollment = {
            'student_id': student_id,
            'course_id': course_id,
            'progress': 0,
            'completed_lessons': [],
            'enrolled_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = enrollments_collection.insert_one(enrollment)
        enrollment['_id'] = str(result.inserted_id)
        
        return jsonify({
            'message': 'Enrolled successfully',
            'enrollment': enrollment
        }), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@enrollment_bp.route('/enrollments', methods=['GET'])
@token_required
def get_enrollments():
    """Get enrollments (filtered by role)"""
    try:
        from flask import request as req
        user_id = req.current_user['user_id']
        role = req.current_user['role']
        
        query = {}
        if role == 'Student':
            query['student_id'] = user_id
        elif role == 'Instructor':
            # Get courses taught by this instructor
            courses = list(courses_collection.find({'instructor_id': user_id}))
            course_ids = [str(c['_id']) for c in courses]
            query['course_id'] = {'$in': course_ids}
        
        enrollments = list(enrollments_collection.find(query))
        
        # Populate course information
        for enrollment in enrollments:
            enrollment['_id'] = str(enrollment['_id'])
            course = courses_collection.find_one({'_id': ObjectId(enrollment['course_id'])})
            if course:
                course['_id'] = str(course['_id'])
                enrollment['course'] = course
        
        return jsonify({'enrollments': enrollments}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@enrollment_bp.route('/progress', methods=['PUT'])
@role_required('Student')
def update_progress():
    """Update lesson progress (Student only)"""
    try:
        from flask import request as req
        student_id = req.current_user['user_id']
        data = request.get_json()
        
        course_id = data.get('course_id')
        lesson_id = data.get('lesson_id')
        completed = data.get('completed', False)
        
        if not course_id or not lesson_id:
            return jsonify({'message': 'Course ID and Lesson ID are required'}), 400
        
        # Verify enrollment
        enrollment = enrollments_collection.find_one({
            'student_id': student_id,
            'course_id': course_id
        })
        
        if not enrollment:
            return jsonify({'message': 'Not enrolled in this course'}), 404
        
        # Verify lesson exists in course
        lesson = lessons_collection.find_one({
            '_id': ObjectId(lesson_id),
            'course_id': course_id
        })
        
        if not lesson:
            return jsonify({'message': 'Lesson not found in this course'}), 404
        
        # Update completed lessons
        completed_lessons = enrollment.get('completed_lessons', [])
        
        if completed:
            if lesson_id not in completed_lessons:
                completed_lessons.append(lesson_id)
        else:
            if lesson_id in completed_lessons:
                completed_lessons.remove(lesson_id)
        
        # Calculate progress percentage
        total_lessons = lessons_collection.count_documents({'course_id': course_id})
        progress = (len(completed_lessons) / total_lessons * 100) if total_lessons > 0 else 0
        
        enrollments_collection.update_one(
            {'_id': enrollment['_id']},
            {
                '$set': {
                    'completed_lessons': completed_lessons,
                    'progress': progress,
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        updated_enrollment = enrollments_collection.find_one({'_id': enrollment['_id']})
        updated_enrollment['_id'] = str(updated_enrollment['_id'])
        
        return jsonify({
            'message': 'Progress updated successfully',
            'enrollment': updated_enrollment
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@enrollment_bp.route('/enroll/<course_id>', methods=['DELETE'])
@role_required('Student')
def unenroll(course_id):
    """Unenroll from a course (Student only)"""
    try:
        from flask import request as req
        student_id = req.current_user['user_id']
        
        result = enrollments_collection.delete_one({
            'student_id': student_id,
            'course_id': course_id
        })
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Enrollment not found'}), 404
        
        return jsonify({'message': 'Unenrolled successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500
