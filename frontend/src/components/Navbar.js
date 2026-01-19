import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">LearnSphere</span>
        </Link>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/home" className="navbar-link">
                Home
              </Link>
              <Link to="/courses" className="navbar-link">
                Courses
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <span className="navbar-user">
                <span className="user-icon">👤</span>
                {user?.email}
              </span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
