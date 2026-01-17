import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/CourseList.css';

const CourseList = () => {
  const { isInstructor, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses');
      setCourses(response.data.courses);
    } catch (error) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/api/courses/${courseId}`);
        setCourses(courses.filter((c) => c._id !== courseId));
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  if (loading) {
    return <div className="course-list-loading">Loading courses...</div>;
  }

  return (
    <div className="course-list">
      <div className="course-list-header">
        <h1>Courses</h1>
        {(isInstructor || isAdmin) && (
          <Link to="/courses/create" className="create-course-button">
            Create Course
          </Link>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {courses.length === 0 ? (
        <div className="empty-courses">
          <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="#F5F3FF" />
            <path d="M100 40L60 60V140L100 160L140 140V60L100 40Z" fill="#9B7EDE" opacity="0.3" />
            <path d="M100 60L80 70V130L100 140L120 130V70L100 60Z" fill="#7C3AED" opacity="0.5" />
            <circle cx="100" cy="100" r="20" fill="#9B7EDE" />
          </svg>
          <p>No courses available.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course, index) => {
            const gradients = [
              { start: '#9B7EDE', end: '#8B5CF6' },
              { start: '#06B6D4', end: '#0891B2' },
              { start: '#EC4899', end: '#DB2777' },
              { start: '#A78BFA', end: '#7C3AED' },
              { start: '#14B8A6', end: '#0D9488' },
              { start: '#F472B6', end: '#EC4899' },
            ];
            const gradient = gradients[index % gradients.length];
            const gradientId = `courseGradient-${course._id}`;
            
            return (
              <div key={course._id} className="course-card">
                <div className="course-image">
                  <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="300" height="180" fill={`url(#${gradientId})`} />
                    <defs>
                      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={gradient.start} />
                        <stop offset="100%" stopColor={gradient.end} />
                      </linearGradient>
                    </defs>
                    <circle cx="150" cy="90" r="40" fill="white" opacity="0.2" />
                    <path d="M120 90L140 70L160 90L140 110L120 90Z" fill="white" opacity="0.3" />
                  </svg>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#9B7EDE" />
                      </svg>
                      Level: {course.level}
                    </span>
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#9B7EDE" />
                      </svg>
                      Lessons: {course.lesson_count || 0}
                    </span>
                  </div>
                  <div className="course-actions">
                    <Link to={`/courses/${course._id}`} className="course-button">
                      View Details
                    </Link>
                    {(isInstructor || isAdmin) && (
                      <>
                        <Link
                          to={`/courses/${course._id}/edit`}
                          className="course-button edit"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="course-button delete"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseList;
