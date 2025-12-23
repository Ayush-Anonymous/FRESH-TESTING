# Hostinger Testing App

🚀 Full-stack testing dashboard for Hostinger deployment

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Express.js (Node.js)
- **Database**: MySQL

## Quick Start

### 1. Install Dependencies
```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Database
Edit `server/.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_PORT=3306
```

### 3. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Open Browser
- Frontend: http://localhost:5173
- Backend Health: http://localhost:3000/health

## Hostinger Deployment

### 1. Build Frontend
```bash
cd client
npm run build
```

### 2. Upload to Hostinger
Upload these folders to Hostinger:
- `server/` (entire folder)
- `client/dist/` (inside server folder or configure static serving)

### 3. Configure Environment
In Hostinger dashboard, set environment variables:
- `PORT` (usually auto-set)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

### 4. Start Application
Entry point: `server/server.js`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/db-test` | Database test |
| GET | `/api/messages` | Get all messages |
| POST | `/api/messages` | Create message |
| DELETE | `/api/messages/:id` | Delete message |

## Features
- ✅ Frontend Test (React status)
- ✅ Backend Test (Server health)
- ✅ Database Test (MySQL connection)
- 📝 Message System (CRUD with MySQL)
- 🎨 Beautiful UI with glassmorphism
