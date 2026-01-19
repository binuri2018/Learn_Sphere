import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CourseIcon, EnrollmentIcon, ProgressIcon } from '../components/Icons';
import '../styles/Dashboard.css';

const Home = () => {
  const { user, isAdmin, isInstructor, isStudent } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    enrollments: 0,
    progress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    '/Assets/lms1.jpg',
    '/Assets/lms2.jpg',
    '/Assets/lms3.jpg',
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-play slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

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
      <div className="dashboard-header">
        <h1>Home</h1>
      </div>
      
      {/* Slideshow */}
      <div className="dashboard-slideshow">
        <div className="slideshow-container">
          <button className="slideshow-button prev" onClick={goToPrevious} aria-label="Previous slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="slideshow-wrapper">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide})` }}
              />
            ))}
          </div>
          
          <button className="slideshow-button next" onClick={goToNext} aria-label="Next slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="slideshow-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="dashboard-welcome">
        <div className="welcome-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#9B7EDE"/>
          </svg>
        </div>
        <div className="welcome-content">
          <p className="welcome-title">Welcome back, {user?.email}!</p>
          <p className="welcome-role">Role: <span>{user?.role}</span></p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <CourseIcon />
          </div>
          <h3>Courses</h3>
          <p className="stat-number">{stats.courses}</p>
        </div>
        {isStudent && (
          <>
            <div className="stat-card">
              <div className="stat-icon">
                <EnrollmentIcon />
              </div>
              <h3>My Enrollments</h3>
              <p className="stat-number">{stats.enrollments}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <ProgressIcon />
              </div>
              <h3>Average Progress</h3>
              <p className="stat-number">{stats.progress}%</p>
            </div>
          </>
        )}
        {(isInstructor || isAdmin) && (
          <div className="stat-card">
            <div className="stat-icon">
              <EnrollmentIcon />
            </div>
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

export default Home;
