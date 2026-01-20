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
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ✅ FIXED CORS CONFIG (critical changes only)
cors_origins = os.getenv(
    'CORS_ORIGINS',
    'https://learnsphere01.netlify.app,http://localhost:3000'
).split(',')

CORS(
    app,
    origins=cors_origins,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

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
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
