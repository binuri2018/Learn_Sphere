# LearnSphere - Render + Netlify Deployment Guide

## Overview
- **Backend**: Flask API deployed on Render
- **Frontend**: React app deployed on Netlify
- **Database**: MongoDB Atlas (cloud)

---

## Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project: "LearnSphere"
4. Create a free tier cluster

### Step 2: Set Up Database
1. Go to "Database" → "Browse Collections"
2. Create database: `lms_db`
3. Create collections:
   - `users`
   - `courses`
   - `enrollments`
   - `lessons`

### Step 3: Get Connection String
1. Click "Connect" button
2. Choose "Drivers"
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/lms_db?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your MongoDB credentials

### Step 4: Create IP Whitelist
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (for development) or add your IP
4. Save changes

---

## Part 2: Backend Deployment on Render

### Step 1: Prepare Backend for Render
1. Your `requirements.txt` already includes `gunicorn`
2. Create a `.env` file in backend folder based on `.env.example`:
   ```
   FLASK_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/lms_db?retryWrites=true&w=majority
   JWT_SECRET=your_secure_secret_key_here
   CORS_ORIGINS=https://your-netlify-domain.netlify.app
   ```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account (recommended for auto-deploy)
3. Connect your GitHub repository

### Step 3: Deploy Backend Service on Render

#### Option A: Using Render Dashboard (Manual)
1. Click "New +" → "Web Service"
2. Connect your GitHub repository (binuri2018/Learn_Sphere)
3. Configure:
   - **Name**: `learnsphere-backend`
   - **Environment**: Python 3
   - **Region**: Choose closest region
   - **Build Command**: 
     ```
     cd backend && pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```
     cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:app --timeout 120
     ```
4. Add Environment Variables:
   - `FLASK_ENV`: `production`
   - `MONGO_URI`: Paste your MongoDB connection string
   - `JWT_SECRET`: Generate a random secret (use https://randomkeygen.com/)
   - `CORS_ORIGINS`: Will update after Netlify deployment

5. Click "Create Web Service"
6. Render will auto-deploy. Wait for success message.
7. Copy your service URL (e.g., `https://learnsphere-backend.onrender.com`)

#### Option B: Using render.yaml (Infrastructure as Code)
Create `render.yaml` in root:
```yaml
services:
  - type: web
    name: learnsphere-backend
    env: python
    region: oregon
    plan: free
    buildCommand: cd backend && pip install -r requirements.txt
    startCommand: cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:app --timeout 120
    envVars:
      - key: FLASK_ENV
        value: production
      - key: MONGO_URI
        fromDatabase:
          name: mongodb
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
```

### Step 4: Test Backend
```bash
# Replace with your actual Render URL
curl https://your-learnsphere-backend.onrender.com/api/courses
```

### Step 5: Update Backend CORS
1. Go to backend `app.py` and verify CORS configuration:
   ```python
   CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000')
   ```
2. In Render dashboard, update environment variable:
   - `CORS_ORIGINS`: `https://your-netlify-domain.netlify.app`

---

## Part 3: Frontend Deployment on Netlify

### Step 1: Prepare Frontend for Netlify
1. Create `.env` file in frontend folder:
   ```
   REACT_APP_API_URL=https://your-learnsphere-backend.onrender.com
   ```
2. The `netlify.toml` is already created in frontend folder

### Step 2: Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub (recommended)
3. Authorize Netlify to access your repositories

### Step 3: Deploy Frontend on Netlify

#### Option A: Using Netlify Dashboard
1. Click "Add new site" → "Import an existing project"
2. Select GitHub provider
3. Choose repository: `binuri2018/Learn_Sphere`
4. Configure:
   - **Team**: Select your team
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Add Environment Variables:
   - `REACT_APP_API_URL`: Paste your Render backend URL
     (e.g., `https://learnsphere-backend.onrender.com`)
6. Click "Deploy site"
7. Wait for deployment to complete
8. Your site URL will appear (e.g., `https://learnsphere.netlify.app`)

#### Option B: Using netlify.toml
The `netlify.toml` file is already configured. Just:
1. Link site to Netlify
2. Add build environment variable:
   - `REACT_APP_API_URL`: Your Render backend URL
3. Deploy

### Step 4: Verify Frontend Deployment
1. Visit your Netlify URL
2. Test login functionality
3. Test course browsing
4. Check browser console for any API errors

---

## Part 4: Final Configuration

### Step 1: Update Backend CORS
In Render dashboard for backend service:
1. Go to "Environment"
2. Update `CORS_ORIGINS`:
   ```
   https://your-netlify-domain.netlify.app
   ```
3. Redeploy service

### Step 2: Update Frontend API URL (if needed)
In Netlify dashboard for frontend:
1. Go to "Site settings" → "Build & deploy" → "Environment"
2. Update `REACT_APP_API_URL` if Render URL changes
3. Trigger redeploy: `npm run build` and push to GitHub

### Step 3: Enable Auto-Deploy
Both platforms automatically deploy on push to `main` branch:
- **Render**: Auto-deploys on commits to main
- **Netlify**: Auto-deploys on commits to main

---

## Part 5: Environment Variables Reference

### Backend (.env on Render)
| Variable | Value | Example |
|----------|-------|---------|
| FLASK_ENV | production | production |
| MONGO_URI | MongoDB connection string | mongodb+srv://user:pass@... |
| JWT_SECRET | Random secret key | Generate from randomkeygen.com |
| CORS_ORIGINS | Netlify frontend URL | https://yourapp.netlify.app |
| PORT | 5000 | 5000 |

### Frontend (.env on Netlify)
| Variable | Value | Example |
|----------|-------|---------|
| REACT_APP_API_URL | Render backend URL | https://yourapp.onrender.com |

---

## Part 6: Common Issues & Solutions

### Issue: Blank Page on Netlify
**Solution**: Check browser console for API errors. Verify `REACT_APP_API_URL` environment variable is set correctly.

### Issue: CORS Errors
**Solution**: 
1. Check backend `CORS_ORIGINS` environment variable matches Netlify URL
2. Restart backend service on Render

### Issue: Render Service Times Out
**Solution**: Free tier Render spins down after 15 minutes of inactivity. This is normal. Paid plans available for always-on.

### Issue: MongoDB Connection Fails
**Solution**:
1. Verify MongoDB Atlas IP whitelist includes your server IP
2. Check connection string is correct in `.env`
3. Test locally first with same credentials

### Issue: Login Not Working
**Solution**:
1. Check JWT_SECRET is set in Render
2. Verify MongoDB users collection exists
3. Check browser network tab for API responses

---

## Part 7: Deployment Checklist

- [ ] MongoDB Atlas cluster created and collections set up
- [ ] MongoDB connection string obtained
- [ ] Backend deployed on Render
- [ ] Backend environment variables configured
- [ ] Backend API tested with curl
- [ ] Frontend environment variable set to Render URL
- [ ] Frontend deployed on Netlify
- [ ] Frontend loads without errors
- [ ] Login/Register functionality works
- [ ] Course browsing works
- [ ] CORS configured correctly
- [ ] Auto-deploy enabled on both platforms
- [ ] Custom domain (optional) configured

---

## Part 8: Post-Deployment Maintenance

### Monitor Performance
- Render: Go to "Logs" tab to check for errors
- Netlify: Go to "Deploys" to check build logs

### Update Code
1. Make changes locally
2. Push to GitHub `main` branch
3. Both platforms auto-deploy within 1-2 minutes

### Database Backups
- MongoDB Atlas free tier includes 3-day backup retention
- Download backups from "Backup" section in MongoDB Atlas

### Scaling (if needed)
- **Render**: Upgrade from Free to Paid plan for always-on service
- **Netlify**: No scaling needed for static frontend
- **MongoDB**: Upgrade cluster as data grows

---

## Support & Additional Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Docs**: https://docs.mongodb.com
- **Flask Deployment**: https://flask.palletsprojects.com/deployment/

Good luck with your LearnSphere deployment! 🚀
