import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { isStudent, isInstructor, isAdmin } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourseData = useCallback(async () => {
    try {
      const response = await api.get(`/api/courses/${id}`);
      setCourse(response.data.course);
      setLessons(response.data.course.lessons || []);
    } catch (error) {
      setError('Failed to fetch course details');
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkEnrollment = useCallback(async () => {
    try {
      const response = await api.get('/api/enrollments');
      const enrollment = response.data.enrollments.find(
        (e) => e.course_id === id
      );
      setEnrollment(enrollment);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseData();
    if (isStudent) {
      checkEnrollment();
    }
  }, [id, isStudent, fetchCourseData, checkEnrollment]);

  const handleEnroll = async () => {
    try {
      await api.post('/api/enroll', { course_id: id });
      await checkEnrollment();
      alert('Enrolled successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    }
  };

  const handleUnenroll = async () => {
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      try {
        await api.delete(`/api/enroll/${id}`);
        setEnrollment(null);
        alert('Unenrolled successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to unenroll');
      }
    }
  };

  const handleLessonComplete = async (lessonId, completed) => {
    try {
      await api.put('/api/progress', {
        course_id: id,
        lesson_id: lessonId,
        completed: completed,
      });
      await checkEnrollment();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update progress');
    }
  };

  if (loading) {
    return <div className="course-detail-loading">Loading...</div>;
  }

  if (error || !course) {
    return <div className="error-message">{error || 'Course not found'}</div>;
  }

  return (
    <div className="course-detail">
      <div className="course-header">
        <div className="course-header-image">
          <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="300" fill="url(#headerGradient)" />
            <defs>
              <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9B7EDE" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <circle cx="400" cy="150" r="100" fill="white" opacity="0.1" />
            <path d="M350 100L400 50L450 100L400 150L350 100Z" fill="white" opacity="0.15" />
            <circle cx="400" cy="150" r="40" fill="white" opacity="0.2" />
          </svg>
        </div>
        <div className="course-header-content">
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <div className="course-info">
            <span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#9B7EDE" />
              </svg>
              Level: {course.level}
            </span>
            <span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#9B7EDE" />
              </svg>
              Category: {course.category}
            </span>
            <span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#9B7EDE" strokeWidth="2" fill="none" />
                <path d="M12 6V12L16 14" stroke="#9B7EDE" strokeWidth="2" fill="none" />
              </svg>
              Duration: {course.duration} hours
            </span>
          </div>
        </div>
      </div>

      {isStudent && (
        <div className="enrollment-section">
          {enrollment ? (
            <>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${enrollment.progress}%` }}
                >
                  {enrollment.progress}%
                </div>
              </div>
              <button onClick={handleUnenroll} className="unenroll-button">
                Unenroll
              </button>
            </>
          ) : (
            <button onClick={handleEnroll} className="enroll-button">
              Enroll in Course
            </button>
          )}
        </div>
      )}

      {(isInstructor || isAdmin) && (
        <div className="course-actions">
          <Link to={`/courses/${id}/lessons/create`} className="action-button">
            Add Lesson
          </Link>
          <Link to={`/courses/${id}/edit`} className="action-button">
            Edit Course
          </Link>
        </div>
      )}

      <div className="lessons-section">
        <h2>Lessons</h2>
        {lessons.length === 0 ? (
          <p>No lessons available.</p>
        ) : (
          <div className="lessons-list">
            {lessons.map((lesson, index) => (
              <div key={lesson._id} className="lesson-item">
                <div className="lesson-header">
                  <h3>
                    {index + 1}. {lesson.title}
                  </h3>
                  {isStudent && enrollment && (
                    <label className="lesson-checkbox">
                      <input
                        type="checkbox"
                        checked={enrollment.completed_lessons?.includes(
                          lesson._id
                        )}
                        onChange={(e) =>
                          handleLessonComplete(lesson._id, e.target.checked)
                        }
                      />
                      Mark as complete
                    </label>
                  )}
                </div>
                <p className="lesson-type">Type: {lesson.lesson_type}</p>
                {(isInstructor || isAdmin) && (
                  <div className="lesson-actions">
                    <Link
                      to={`/lessons/${lesson._id}/edit`}
                      className="lesson-button"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            'Are you sure you want to delete this lesson?'
                          )
                        ) {
                          try {
                            await api.delete(`/api/lessons/${lesson._id}`);
                            fetchCourseData();
                          } catch (error) {
                            alert(
                              error.response?.data?.message ||
                                'Failed to delete lesson'
                            );
                          }
                        }
                      }}
                      className="lesson-button delete"
                    >
                      Delete
                    </button>
                  </div>
                )}
                <Link
                  to={`/lessons/${lesson._id}`}
                  className="view-lesson-button"
                >
                  View Lesson
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
