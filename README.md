# Learning Management System (LMS)

A full-stack Learning Management System built with React (frontend), Flask (backend REST API), and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Role-Based Access**: Admin, Instructor, and Student roles with different permissions
- **Profile Management**: Create, read, update, and delete user profiles
- **Course Management**: Instructors and Admins can create and manage courses
- **Lesson Management**: Support for text and video lessons
- **Enrollment System**: Students can enroll in courses and track progress
- **Progress Tracking**: Automatic progress calculation based on completed lessons

## Project Structure

```
lms_1/
├── backend/           # Flask REST API
│   ├── app.py        # Main Flask application
│   ├── config.py     # Configuration settings
│   ├── requirements.txt
│   ├── models/       # Data models
│   ├── routes/       # API routes
│   ├── middleware/   # Authentication middleware
│   └── utils/        # Utility functions
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context (Auth)
│   │   ├── utils/      # Utility functions
│   │   └── styles/     # CSS files
│   └── public/
└── README.md
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB (running locally or connection string)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows:
   ```bash
   venv\Scripts\activate
   ```
   - Linux/Mac:
   ```bash
   source venv/bin/activate
   ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key-change-in-production
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=lms_db
JWT_SECRET_KEY=jwt-secret-key-change-in-production
```

6. Make sure MongoDB is running on your system.

7. Run the Flask application:
```bash
python app.py
```

The backend API will be available at `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `DELETE /api/auth/delete` - Delete user account

### Profile Management
- `POST /api/profile` - Create user profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Delete user profile

### Course Management
- `POST /api/courses` - Create course (Admin/Instructor only)
- `GET /api/courses` - Get all courses
- `GET /api/courses/<id>` - Get course details
- `PUT /api/courses/<id>` - Update course (Admin/Instructor only)
- `DELETE /api/courses/<id>` - Delete course (Admin/Instructor only)

### Lesson Management
- `POST /api/courses/<id>/lessons` - Create lesson (Admin/Instructor only)
- `GET /api/courses/<id>/lessons` - Get all lessons for a course
- `PUT /api/lessons/<id>` - Update lesson (Admin/Instructor only)
- `DELETE /api/lessons/<id>` - Delete lesson (Admin/Instructor only)

### Enrollment & Progress
- `POST /api/enroll` - Enroll in course (Student only)
- `GET /api/enrollments` - Get enrollments
- `PUT /api/progress` - Update lesson progress (Student only)
- `DELETE /api/enroll/<courseId>` - Unenroll from course (Student only)

## Sample Data for Testing

### Test Users

You can register users with different roles through the frontend registration page:

1. **Admin User**:
   - Email: `admin@lms.com`
   - Password: `admin123`
   - Role: `Admin`

2. **Instructor User**:
   - Email: `instructor@lms.com`
   - Password: `instructor123`
   - Role: `Instructor`

3. **Student User**:
   - Email: `student@lms.com`
   - Password: `student123`
   - Role: `Student`

### Sample Course Data

After logging in as an Instructor or Admin, you can create courses with the following sample data:

**Course 1: Introduction to Python**
- Title: `Introduction to Python`
- Description: `Learn the fundamentals of Python programming`
- Category: `Programming`
- Level: `Beginner`
- Duration: `10`
- Price: `0`

**Course 2: Advanced React**
- Title: `Advanced React Development`
- Description: `Master advanced React concepts and patterns`
- Category: `Web Development`
- Level: `Advanced`
- Duration: `20`
- Price: `99.99`

### Sample Lesson Data

For each course, you can add lessons:

**Text Lesson Example**:
- Title: `Getting Started with Python`
- Content: `Python is a high-level programming language...`
- Lesson Type: `text`
- Order: `1`

**Video Lesson Example**:
- Title: `Python Variables and Data Types`
- Content: `In this lesson, we'll explore...`
- Lesson Type: `video`
- Video URL: `https://www.youtube.com/embed/VIDEO_ID`
- Order: `2`

## Usage Guide

### For Students:
1. Register/Login as a Student
2. Browse available courses
3. Enroll in courses
4. View lessons and mark them as complete
5. Track your progress

### For Instructors:
1. Register/Login as an Instructor
2. Create courses
3. Add lessons to your courses
4. View enrollments for your courses
5. Manage course content

### For Admins:
1. Register/Login as an Admin
2. All Instructor capabilities
3. Manage all courses (not just your own)
4. View all enrollments

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected API endpoints
- Token expiration (24 hours)
- CORS enabled for frontend-backend communication

## Technologies Used

### Backend:
- Flask - Python web framework
- PyMongo - MongoDB driver
- PyJWT - JWT token handling
- bcrypt - Password hashing
- Flask-CORS - Cross-origin resource sharing

### Frontend:
- React - UI library
- React Router - Routing
- Axios - HTTP client
- Context API - State management

## Development Notes

- The backend runs on port 5000
- The frontend runs on port 3000
- MongoDB should be running on the default port 27017
- JWT tokens are stored in localStorage
- All API requests include the JWT token in the Authorization header

## Troubleshooting

### Backend Issues:
- Ensure MongoDB is running: `mongod` or check your MongoDB service
- Check if port 5000 is available
- Verify `.env` file exists with correct MongoDB URI
- Check Python version: `python --version` (should be 3.8+)

### Frontend Issues:
- Clear browser cache and localStorage if authentication issues occur
- Ensure backend is running before starting frontend
- Check browser console for errors
- Verify API base URL in `frontend/src/utils/api.js`

### Database Issues:
- Ensure MongoDB is installed and running
- Check connection string in `.env` file
- Verify database name matches in config

## License

This project is for educational purposes.

## Contributing

Feel free to submit issues and enhancement requests!
