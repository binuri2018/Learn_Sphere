"""
Sample data seeding script for testing the LMS
Run this script to populate the database with sample data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.user import User
from utils.database import courses_collection, lessons_collection, enrollments_collection
from bson import ObjectId
from datetime import datetime

def seed_data():
    """Seed the database with sample data"""
    
    print("Seeding database...")
    
    # Create sample users
    admin = User.create_user('admin@lms.com', 'admin123', 'Admin')
    instructor = User.create_user('instructor@lms.com', 'instructor123', 'Instructor')
    student = User.create_user('student@lms.com', 'student123', 'Student')
    
    if admin:
        print(f"Created admin user: {admin['email']}")
    if instructor:
        print(f"Created instructor user: {instructor['email']}")
    if student:
        print(f"Created student user: {student['email']}")
    
    # Create sample courses
    if instructor:
        course1 = {
            'title': 'Introduction to Python',
            'description': 'Learn the fundamentals of Python programming language',
            'instructor_id': instructor['_id'],
            'category': 'Programming',
            'price': 0,
            'duration': 10,
            'level': 'Beginner',
            'is_published': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        course2 = {
            'title': 'Advanced React Development',
            'description': 'Master advanced React concepts and patterns',
            'instructor_id': instructor['_id'],
            'category': 'Web Development',
            'price': 99.99,
            'duration': 20,
            'level': 'Advanced',
            'is_published': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result1 = courses_collection.insert_one(course1)
        result2 = courses_collection.insert_one(course2)
        
        course1_id = str(result1.inserted_id)
        course2_id = str(result2.inserted_id)
        
        print(f"Created course: {course1['title']}")
        print(f"Created course: {course2['title']}")
        
        # Create sample lessons for course 1
        lesson1_1 = {
            'course_id': course1_id,
            'title': 'Getting Started with Python',
            'content': 'Python is a high-level, interpreted programming language. It emphasizes code readability and simplicity.',
            'lesson_type': 'text',
            'video_url': '',
            'order': 1,
            'duration': 30,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        lesson1_2 = {
            'course_id': course1_id,
            'title': 'Python Variables and Data Types',
            'content': 'In Python, variables are created when you assign a value to them. Python has several built-in data types.',
            'lesson_type': 'text',
            'video_url': '',
            'order': 2,
            'duration': 45,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        lesson1_3 = {
            'course_id': course1_id,
            'title': 'Python Control Flow',
            'content': 'Learn about if statements, loops, and other control flow structures in Python.',
            'lesson_type': 'video',
            'video_url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'order': 3,
            'duration': 60,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        lesson_results = lessons_collection.insert_many([lesson1_1, lesson1_2, lesson1_3])
        print(f"Created 3 lessons for course: {course1['title']}")
        first_lesson_id = str(lesson_results.inserted_ids[0])
        
        # Create sample lessons for course 2
        lesson2_1 = {
            'course_id': course2_id,
            'title': 'React Hooks Deep Dive',
            'content': 'Understanding useState, useEffect, and custom hooks in React.',
            'lesson_type': 'text',
            'video_url': '',
            'order': 1,
            'duration': 45,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        lesson2_2 = {
            'course_id': course2_id,
            'title': 'State Management with Context API',
            'content': 'Learn how to manage global state using React Context API.',
            'lesson_type': 'video',
            'video_url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'order': 2,
            'duration': 60,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        lessons_collection.insert_many([lesson2_1, lesson2_2])
        print(f"Created 2 lessons for course: {course2['title']}")
        
        # Create sample enrollment if student exists
        if student:
            enrollment = {
                'student_id': student['_id'],
                'course_id': course1_id,
                'progress': 33.33,
                'completed_lessons': [first_lesson_id],
                'enrolled_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            enrollments_collection.insert_one(enrollment)
            print(f"Created enrollment for student: {student['email']}")
    
    print("\nDatabase seeding completed!")
    print("\nSample users created:")
    print("  Admin: admin@lms.com / admin123")
    print("  Instructor: instructor@lms.com / instructor123")
    print("  Student: student@lms.com / student123")

if __name__ == '__main__':
    seed_data()
