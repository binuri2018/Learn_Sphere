import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/CreateLesson.css';

const CreateLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    lesson_type: 'text',
    video_url: '',
    order: 0,
    duration: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post(`/api/courses/${id}/lessons`, formData);
      navigate(`/courses/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-lesson">
      <h1>Create Lesson</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="lesson-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Lesson Type</label>
          <select
            value={formData.lesson_type}
            onChange={(e) =>
              setFormData({ ...formData, lesson_type: e.target.value })
            }
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
          </select>
        </div>
        {formData.lesson_type === 'video' && (
          <div className="form-group">
            <label>Video URL</label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) =>
                setFormData({ ...formData, video_url: e.target.value })
              }
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
        )}
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows="10"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) })
              }
              min="0"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Creating...' : 'Create Lesson'}
        </button>
      </form>
    </div>
  );
};

export default CreateLesson;
