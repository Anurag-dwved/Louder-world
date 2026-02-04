# Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google OAuth credentials

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
- Install MongoDB locally
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/louder-world`

#### Option B: MongoDB Atlas (Cloud)
- Create account at https://www.mongodb.com/cloud/atlas
- Create a new cluster
- Get your connection string
- Replace `<password>` with your database password

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen if prompted
6. Application type: Web application
7. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy Client ID and Client Secret

### 4. Environment Variables

Create `backend/.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/louder-world
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
SESSION_SECRET=generate_a_random_string_here
JWT_SECRET=generate_another_random_string_here
FRONTEND_URL=http://localhost:3000
```

**Generate random strings for SESSION_SECRET and JWT_SECRET:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 5. Run the Application

#### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

### 6. Run Scraper Manually

```bash
npm run scrape
```

### 7. Access the Application

- **Public Event Listing**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/dashboard
- **Login Page**: http://localhost:3000/login
- **Backend API**: http://localhost:5000/api

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network access if using Atlas

### Google OAuth Issues
- Verify redirect URI matches exactly
- Check that Google+ API is enabled
- Ensure credentials are correct in `.env`

### Port Already in Use
- Change PORT in `backend/.env`
- Update FRONTEND_URL if backend port changes
- Update proxy in `frontend/package.json` if needed

### Scraper Not Working
- Check MongoDB connection
- Verify event sources are accessible
- Check console logs for errors

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Update `FRONTEND_URL` to production URL
3. Update Google OAuth redirect URI for production
4. Use secure session secrets
5. Enable HTTPS
6. Set up proper MongoDB security
7. Configure CORS properly
8. Build frontend: `cd frontend && npm run build`
