# Windows Setup Guide

## Python Installation Issue Fix

If you encounter the error:
```
Fatal error in launcher: Unable to create process using '"C:\Python312\python.exe"'
```

**Solution:** Use the `py` launcher instead of direct `python` or `pip` commands.

## Commands to Use

### Install Dependencies
```powershell
py -m pip install -r requirements.txt
```

### Run the Flask Application
```powershell
py app.py
```

### Run Seed Data Script
```powershell
py seed_data.py
```

### Other Useful Commands
```powershell
# Check Python version
py --version

# Install a package
py -m pip install package_name

# Run Python scripts
py script_name.py
```

## Environment Setup

1. Create a `.env` file in the `backend` directory:
```env
SECRET_KEY=your-secret-key-change-in-production
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=lms_db
JWT_SECRET_KEY=jwt-secret-key-change-in-production
```

2. Make sure MongoDB is running on your system.

3. Start the backend:
```powershell
cd backend
py app.py
```

The API will be available at `http://localhost:5000`
