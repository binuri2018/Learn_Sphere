import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { isStudent, isInstructor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseData();
    if (isStudent) {
      checkEnrollment();
    }
  }, [id]);

  const fetchCourseData = async () => {
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
  };

  const checkEnrollment = async () => {
    try {
      const response = await api.get('/api/enrollments');
      const enrollment = response.data.enrollments.find(
        (e) => e.course_id === id
      );
      setEnrollment(enrollment);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

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
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        <div className="course-info">
          <span>Level: {course.level}</span>
          <span>Category: {course.category}</span>
          <span>Duration: {course.duration} hours</span>
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
