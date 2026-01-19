import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://pbinu5083:aEnpsmXjdomEuR6o@cluster0.ooictsa.mongodb.net/LMS')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'lms_db')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'Binu2018')
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_HOURS = 24
