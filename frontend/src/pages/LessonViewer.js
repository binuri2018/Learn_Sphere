import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/LessonViewer.css';

const LessonViewer = () => {
  const { id } = useParams();
  const { isStudent } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLessonData();
    if (isStudent) {
      checkEnrollment();
    }
  }, [id]);

  const fetchLessonData = async () => {
    try {
      // Get lesson from course
      const coursesResponse = await api.get('/api/courses');
      let foundLesson = null;
      let foundCourse = null;

      for (const course of coursesResponse.data.courses) {
        const courseDetail = await api.get(`/api/courses/${course._id}`);
        const lesson = courseDetail.data.course.lessons?.find(
          (l) => l._id === id
        );
        if (lesson) {
          foundLesson = lesson;
          foundCourse = courseDetail.data.course;
          break;
        }
      }

      if (!foundLesson) {
        setError('Lesson not found');
        return;
      }

      setLesson(foundLesson);
      setCourse(foundCourse);
    } catch (error) {
      setError('Failed to fetch lesson');
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await api.get('/api/enrollments');
      if (course) {
        const enrollment = response.data.enrollments.find(
          (e) => e.course_id === course._id
        );
        setEnrollment(enrollment);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleComplete = async () => {
    if (!course || !enrollment) return;

    try {
      const isCompleted = enrollment.completed_lessons?.includes(id);
      await api.put('/api/progress', {
        course_id: course._id,
        lesson_id: id,
        completed: !isCompleted,
      });
      await checkEnrollment();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update progress');
    }
  };

  if (loading) {
    return <div className="lesson-viewer-loading">Loading...</div>;
  }

  if (error || !lesson) {
    return <div className="error-message">{error || 'Lesson not found'}</div>;
  }

  const isCompleted =
    isStudent && enrollment?.completed_lessons?.includes(id);

  return (
    <div className="lesson-viewer">
      <Link to={`/courses/${course?._id}`} className="back-link">
        ← Back to Course
      </Link>
      <div className="lesson-content">
        <h1>{lesson.title}</h1>
        <div className="lesson-meta">
          <span>Type: {lesson.lesson_type}</span>
          {lesson.duration > 0 && <span>Duration: {lesson.duration} min</span>}
        </div>

        {isStudent && enrollment && (
          <div className="lesson-progress">
            <label className="lesson-checkbox">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleComplete}
              />
              Mark as complete
            </label>
          </div>
        )}

        {lesson.lesson_type === 'video' && lesson.video_url && (
          <div className="video-container">
            <iframe
              src={lesson.video_url}
              title={lesson.title}
              allowFullScreen
              className="lesson-video"
            />
          </div>
        )}

        <div className="lesson-text">
          <h2>Content</h2>
          <p>{lesson.content || 'No content available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
