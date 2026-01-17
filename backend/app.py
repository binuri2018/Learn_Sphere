import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp
from routes.course_routes import course_bp
from routes.lesson_routes import lesson_bp
from routes.enrollment_routes import enrollment_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(course_bp)
app.register_blueprint(lesson_bp)
app.register_blueprint(enrollment_bp)

@app.route('/')
def health_check():
    return {'message': 'LMS API is running', 'status': 'ok'}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
