import React from 'react';

// Course Icon
export const CourseIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"
      fill="currentColor"
    />
  </svg>
);

// Enrollment Icon
export const EnrollmentIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
      fill="currentColor"
    />
  </svg>
);

// Progress Icon
export const ProgressIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
      fill="currentColor"
    />
    <path
      d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM11 16L7 12L8.41 10.59L11 13.17L15.59 8.58L17 10L11 16Z"
      fill="currentColor"
    />
  </svg>
);

// Book Icon
export const BookIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20Z"
      fill="currentColor"
    />
    <path
      d="M12.5 6.5H11.5V9.5H8.5V10.5H11.5V13.5H12.5V10.5H15.5V9.5H12.5V6.5Z"
      fill="currentColor"
    />
  </svg>
);

// User Icon
export const UserIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
      fill="currentColor"
    />
  </svg>
);

// Learning Icon
export const LearningIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"
      fill="currentColor"
    />
  </svg>
);

// Decorative Purple Wave
export const PurpleWave = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 1200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
      fill="url(#purpleGradient)"
      opacity="0.3"
    />
    <defs>
      <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9B7EDE" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
);

// Empty State Illustration
export const EmptyStateIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="80" fill="#F5F3FF" />
    <path
      d="M100 40L60 60V140L100 160L140 140V60L100 40Z"
      fill="#9B7EDE"
      opacity="0.3"
    />
    <path
      d="M100 60L80 70V130L100 140L120 130V70L100 60Z"
      fill="#7C3AED"
      opacity="0.5"
    />
    <circle cx="100" cy="100" r="20" fill="#9B7EDE" />
  </svg>
);
