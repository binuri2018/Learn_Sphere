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
      <h1>Profile Management</h1>
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
