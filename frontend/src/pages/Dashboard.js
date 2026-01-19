import React, { useState, useEffect, useCallback } from 'react';
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
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: '/Assets/lms1.jpg',
      title: 'Transform Your Learning',
      subtitle: 'Welcome to LearnSphere - Explore thousands of courses and expand your knowledge'
    },
    {
      image: '/Assets/lms2.jpg',
      title: 'Learn at Your Pace',
      subtitle: 'With LearnSphere, study whenever and wherever you want with our flexible platform'
    },
    {
      image: '/Assets/lms3.jpg',
      title: 'Achieve Your Goals',
      subtitle: 'Unlock new opportunities with LearnSphere professional certifications'
    },
  ];

  const quickLinks = [
    { icon: '📚', label: 'Browse Courses', path: '/courses', show: true },
    { icon: '✍️', label: 'Create Course', path: '/courses/create', show: isInstructor },
    { icon: '⚙️', label: 'Admin Panel', path: '/admin', show: isAdmin },
    { icon: '👤', label: 'My Profile', path: '/profile', show: true },
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      if (isStudent) {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get('/api/courses'),
          api.get('/api/enrollments'),
        ]);

        const enrollments = enrollmentsRes.data.enrollments || [];
        const totalProgress =
          enrollments.length > 0
            ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
            : 0;

        setStats({
          courses: coursesRes.data.courses?.length || 0,
          enrollments: enrollments.length,
          progress: Math.round(totalProgress),
        });
        setFeaturedCourses((coursesRes.data.courses || []).slice(0, 3));
      } else if (isInstructor || isAdmin) {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get('/api/courses'),
          api.get('/api/enrollments'),
        ]);

        setStats({
          courses: coursesRes.data.courses?.length || 0,
          enrollments: enrollmentsRes.data.enrollments?.length || 0,
          progress: 0,
        });
        setFeaturedCourses((coursesRes.data.courses || []).slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [isStudent, isInstructor, isAdmin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return <div className="dashboard-loading">
      <div className="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>;
  }

  return (
    <div className="dashboard">
      {/* Hero Section with Slideshow */}
      <div className="dashboard-hero">
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
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="slide-overlay">
                  <div className="slide-content">
                    <h2 className="slide-title">{slide.title}</h2>
                    <p className="slide-subtitle">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
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

      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <div className="welcome-left">
            <div className="welcome-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#9B7EDE"/>
              </svg>
            </div>
            <div className="welcome-content">
              <p className="welcome-title">Welcome to LearnSphere!</p>
              <p className="welcome-subtitle">{user?.email}</p>
            </div>
          </div>
          <div className="welcome-right">
            <p className="welcome-role">Role: <span className="role-badge">{user?.role}</span></p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links-section">
          <h2>Quick Access</h2>
          <div className="quick-links-grid">
            {quickLinks.filter(link => link.show).map((link, idx) => (
              <Link key={idx} to={link.path} className="quick-link-card">
                <span className="quick-link-icon">{link.icon}</span>
                <span className="quick-link-label">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <h2>Your Statistics</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <CourseIcon />
              </div>
              <h3>Total Courses</h3>
              <p className="stat-number">{stats.courses}</p>
              <p className="stat-description">Available courses</p>
            </div>
            {isStudent && (
              <>
                <div className="stat-card">
                  <div className="stat-icon">
                    <EnrollmentIcon />
                  </div>
                  <h3>Enrollments</h3>
                  <p className="stat-number">{stats.enrollments}</p>
                  <p className="stat-description">Courses enrolled</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <ProgressIcon />
                  </div>
                  <h3>Overall Progress</h3>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.progress}%` }}></div>
                  </div>
                  <p className="stat-number">{stats.progress}%</p>
                </div>
              </>
            )}
            {(isInstructor || isAdmin) && (
              <div className="stat-card">
                <div className="stat-icon">
                  <EnrollmentIcon />
                </div>
                <h3>Student Enrollments</h3>
                <p className="stat-number">{stats.enrollments}</p>
                <p className="stat-description">Total enrollments</p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className="featured-section">
            <div className="featured-header">
              <h2>Featured Courses</h2>
              <Link to="/courses" className="view-all-link">View All →</Link>
            </div>
            <div className="featured-courses-grid">
              {featuredCourses.map((course, idx) => (
                <div key={idx} className="featured-card">
                  <div className="featured-card-image">
                    <svg width="100%" height="100%" viewBox="0 0 300 200" fill="none">
                      <rect width="300" height="200" fill="url(#grad)"/>
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#9B7EDE', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#7C3AED', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      <text x="150" y="100" textAnchor="middle" fontSize="48" fill="white" fontWeight="bold">📚</text>
                    </svg>
                  </div>
                  <div className="featured-card-content">
                    <h3>{course.title}</h3>
                    <p>{course.description?.substring(0, 60)}...</p>
                    <Link to={`/courses/${course.id}`} className="featured-card-link">Learn More →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="dashboard-cta">
          <div className="cta-content">
            <p className="cta-brand">Powered by LearnSphere</p>
            <h2>Ready to start learning?</h2>
            <p>Explore new courses on LearnSphere and expand your knowledge</p>
          </div>
          <div className="cta-buttons">
            <Link to="/courses" className="cta-button primary">
              Explore Courses
            </Link>
            {isInstructor && (
              <Link to="/courses/create" className="cta-button secondary">
                Create New Course
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
