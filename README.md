# 🚀 Hostinger Testing Dashboard

Full-stack testing app for Hostinger deployment - **React + Express + MySQL**

## 📁 Project Structure (Hostinger Ready)
```
├── server.js           ← Entry Point
├── package.json        ← Dependencies
├── .env.example        ← Environment template
└── client/
    ├── dist/           ← Pre-built frontend
    └── src/            ← Source code
```

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
cd client && npm install
```

### 2. Configure Database
Create `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=test_db
DB_PORT=3306
```

### 3. Build Frontend
```bash
npm run build
```

### 4. Start Server
```bash
npm start
```

Open: http://localhost:3000

---

## ☁️ Hostinger Deployment

### Step 1: Connect GitHub
Link this repository in Hostinger Git deployment

### Step 2: Set Environment Variables
In Hostinger Dashboard → Environment Variables:
```
DB_HOST=your_hostinger_mysql_host
DB_USER=your_username  
DB_PASSWORD=your_password
DB_NAME=your_database
DB_PORT=3306
```

### Step 3: Deploy
- Entry point: `server.js`
- Build command: Not needed (dist already committed)
- Start command: `npm start`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check - returns `SERVER ALIVE` |
| GET | `/api/db-test` | Test MySQL connection |
| GET | `/api/messages` | Get all messages |
| POST | `/api/messages` | Create new message |
| DELETE | `/api/messages/:id` | Delete message |

---

## ✨ Features
- ✅ Frontend Test (React status)
- ✅ Backend Test (Express health check)
- ✅ Database Test (MySQL connection)
- 📝 Message System (CRUD with MySQL)
- 🎨 Beautiful glassmorphism UI
- 📱 Fully responsive

---

Made with ❤️ for Hostinger Deployment
