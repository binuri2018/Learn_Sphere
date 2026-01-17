import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/Profile.css';

const Profile = () => {
  const { user, deleteAccount } = useAuth();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile');
      if (response.data.profile) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (profile._id) {
        await api.put('/api/profile', profile);
        setMessage('Profile updated successfully!');
      } else {
        await api.post('/api/profile', profile);
        setMessage('Profile created successfully!');
        fetchProfile();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        await api.delete('/api/profile');
        setProfile({
          first_name: '',
          last_name: '',
          bio: '',
          phone: '',
          address: '',
        });
        setMessage('Profile deleted successfully!');
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting profile');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      const result = await deleteAccount();
      if (result.success) {
        window.location.href = '/login';
      } else {
        setMessage(result.message);
      }
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile Management</h1>
        <div className="profile-avatar">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#9B7EDE" opacity="0.2" />
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#9B7EDE"/>
          </svg>
        </div>
      </div>
      <div className="profile-info">
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
      </div>

      {message && (
        <div className={`profile-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={profile.first_name || ''}
            onChange={(e) =>
              setProfile({ ...profile, first_name: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={profile.last_name || ''}
            onChange={(e) =>
              setProfile({ ...profile, last_name: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={profile.phone || ''}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={profile.address || ''}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
          />
        </div>
        <button type="submit" disabled={saving} className="profile-button">
          {saving ? 'Saving...' : profile._id ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>

      <div className="profile-actions">
        {profile._id && (
          <button onClick={handleDelete} className="profile-button delete">
            Delete Profile
          </button>
        )}
        <button onClick={handleDeleteAccount} className="profile-button delete-account">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
