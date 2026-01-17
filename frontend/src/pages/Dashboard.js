import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin, isInstructor, isStudent } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    enrollments: 0,
    progress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (isStudent) {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get('/api/courses'),
          api.get('/api/enrollments'),
        ]);

        const enrollments = enrollmentsRes.data.enrollments;
        const totalProgress =
          enrollments.reduce((sum, e) => sum + e.progress, 0) /
          (enrollments.length || 1);

        setStats({
          courses: coursesRes.data.courses.length,
          enrollments: enrollments.length,
          progress: Math.round(totalProgress),
        });
      } else if (isInstructor || isAdmin) {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get('/api/courses'),
          api.get('/api/enrollments'),
        ]);

        setStats({
          courses: coursesRes.data.courses.length,
          enrollments: enrollmentsRes.data.enrollments.length,
          progress: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-welcome">
        <p>Welcome, {user?.email}!</p>
        <p>Role: {user?.role}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Courses</h3>
          <p className="stat-number">{stats.courses}</p>
        </div>
        {isStudent && (
          <>
            <div className="stat-card">
              <h3>My Enrollments</h3>
              <p className="stat-number">{stats.enrollments}</p>
            </div>
            <div className="stat-card">
              <h3>Average Progress</h3>
              <p className="stat-number">{stats.progress}%</p>
            </div>
          </>
        )}
        {(isInstructor || isAdmin) && (
          <div className="stat-card">
            <h3>Total Enrollments</h3>
            <p className="stat-number">{stats.enrollments}</p>
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <Link to="/courses" className="dashboard-button">
          Browse Courses
        </Link>
        {isInstructor && (
          <Link to="/courses/create" className="dashboard-button">
            Create Course
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="dashboard-button">
            Admin Panel
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
