# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Set Up MongoDB
- **Local**: Install MongoDB and start service
- **Cloud**: Get MongoDB Atlas connection string

### 3. Configure Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:5000/api/auth/google/callback`

### 4. Create Environment File
Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/louder-world
PORT=5000
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SESSION_SECRET=random_string_here
JWT_SECRET=random_string_here
FRONTEND_URL=http://localhost:3000
```

### 5. Run the Application
```bash
# Start both frontend and backend
npm run dev

# Or separately:
npm run server  # Backend only (port 5000)
npm run client  # Frontend only (port 3000)
```

### 6. Populate Events
```bash
npm run scrape
```

### 7. Access the App
- **Public Site**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **API**: http://localhost:5000/api

## 📋 Common Commands

```bash
# Development
npm run dev              # Start both servers
npm run server           # Backend only
npm run client           # Frontend only

# Scraping
npm run scrape           # Run scraper once
cd backend && node scripts/scheduler.js  # Run with cron

# Installation
npm run install-all      # Install all dependencies
```

## 🔧 Troubleshooting

**MongoDB Connection Error**
- Check if MongoDB is running
- Verify connection string in `.env`

**Google OAuth Not Working**
- Verify redirect URI matches exactly
- Check credentials in `.env`
- Ensure Google+ API is enabled

**No Events Showing**
- Run `npm run scrape` to populate database
- Check MongoDB connection
- Verify events exist in database

**Port Already in Use**
- Change `PORT` in `backend/.env`
- Kill process using port: `lsof -ti:5000 | xargs kill` (Mac/Linux)

## 📁 Key Files

- `backend/.env` - Environment variables
- `backend/scripts/scraper.js` - Event scraper
- `backend/server.js` - Express server
- `frontend/src/pages/HomePage.js` - Public event listing
- `frontend/src/pages/Dashboard.js` - Admin dashboard

## 🎯 Features Checklist

- ✅ Event scraping from multiple sources
- ✅ Auto-update detection (new/updated/inactive)
- ✅ Beautiful event listing page
- ✅ GET TICKETS with email capture
- ✅ Google OAuth authentication
- ✅ Admin dashboard with filters
- ✅ Event import functionality
- ✅ Status tags system

## 📚 Documentation

- `README.md` - Main documentation
- `SETUP.md` - Detailed setup guide
- `FEATURES.md` - Feature implementation details
