# Louder World - Event Scraping Platform

A full-stack MERN application that automatically scrapes events from multiple sources for Sydney, Australia and displays them in a beautiful, user-friendly interface.

## Features

- **Automatic Event Scraping**: Scrapes events from multiple public event websites
- **Auto-Updates**: Detects new, updated, and inactive events automatically
- **Event Listing**: Clean, minimalistic UI displaying event cards
- **Email Capture**: GET TICKETS functionality with email opt-in
- **Google OAuth**: Secure authentication for admin dashboard
- **Admin Dashboard**: Filter, search, and manage events with import functionality
- **Status Tags**: Track event status (new, updated, inactive, imported)

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router
- **Authentication**: Google OAuth 2.0
- **Scraping**: Cheerio, Axios
- **Scheduling**: node-cron

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Configure environment variables**:
   - Create `backend/.env` with:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=5000
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     SESSION_SECRET=your_session_secret
     JWT_SECRET=your_jwt_secret
     ```

3. **Start the application**:
   ```bash
   npm run dev
   ```

4. **Run scraper manually** (optional):
   ```bash
   npm run scrape
   ```

## Project Structure

```
louder-world/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── scripts/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── public/
└── package.json
```

## API Endpoints

- `GET /api/events` - Get all events (with filters)
- `POST /api/events/ticket-request` - Submit ticket request with email
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/logout` - Logout
- `GET /api/dashboard/events` - Get events for dashboard
- `POST /api/dashboard/events/:id/import` - Import event to platform
