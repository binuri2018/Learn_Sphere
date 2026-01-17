import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client[Config.DATABASE_NAME]

# Collections
users_collection = db['users']
profiles_collection = db['profiles']
courses_collection = db['courses']
lessons_collection = db['lessons']
enrollments_collection = db['enrollments']
