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
        <p>No courses available.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <span>Level: {course.level}</span>
                <span>Lessons: {course.lesson_count || 0}</span>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
