---
description: Hostinger Business Web Hosting rules and limitations - ALWAYS follow these when building apps
---

# 🎯 HOSTINGER BUSINESS WEB HOSTING - MANDATORY RULES

## 📊 KEY LIMITATIONS & BOUNDARIES

| Limit | Value |
|-------|-------|
| **Node.js Apps** | Up to 5 per account |
| **RAM** | 3 GB |
| **Storage** | 50 GB SSD |
| **Inodes** | 600,000 files/folders |
| **CPU** | Shared resources |

## ⚠️ RESTRICTIONS

1. **No Root Access** - Cannot install system-wide packages or modify server OS settings
2. **Environment Variables** - Must be set through hPanel; `.env` files may NOT work as expected
3. **No Custom Daemons** - Only web-facing apps (HTTP/HTTPS); background daemons or persistent workers NOT allowed
4. **Limited Module Support** - Only npm packages that don't require native system dependencies
5. **Process Management** - Platform manages app restarts; PM2 or custom process managers NOT supported
6. **Network Restrictions** - Outbound networking may be limited for security
7. **No SSH Root** - SSH available but NOT with root privileges

## ✅ DEPLOYMENT RULES

1. **Rename `build` script** → Use `client:build` (Hostinger reacts to "build" keyword)
2. **Entry point**: `server.js` at root with `"main": "server.js"` in package.json
3. **Pre-build frontend** → Commit `dist/` folder
4. **Don't set PORT** → Hostinger auto-injects it
5. **package.json**:
   ```json
   {
     "main": "server.js",
     "scripts": {
       "start": "node server.js",
       "client:build": "cd client && npm install && npm run build"
     }
   }
   ```

## ✅ ALLOWED STACK
- **Frontend**: React, Vite, Vue, Angular, Next.js, Parcel
- **Backend**: Express.js, Next.js API routes
- **Database**: MySQL only (use mysql2 package)

## ❌ NEVER USE
- Firebase, Supabase, MongoDB, PostgreSQL
- PM2 or custom process managers
- Background daemons/workers
- Native modules needing OS dependencies

## 🔧 MYSQL TEMPLATE (with fallbacks)
```javascript
const DB_CONFIG = {
  host: process.env.DB_HOST || 'YOUR_IP',
  user: process.env.DB_USER || 'YOUR_USER',
  password: process.env.DB_PASSWORD || 'YOUR_PASS',
  database: process.env.DB_NAME || 'YOUR_DB',
  port: Number(process.env.DB_PORT) || 3306
};
```

## 📋 CHECKLIST
- [ ] `server.js` at root
- [ ] No `build` script (use `client:build`)
- [ ] `dist/` committed
- [ ] MySQL with hardcoded fallbacks
- [ ] `/health` endpoint
- [ ] ENV set in hPanel

## 💡 FOR ADVANCED NEEDS → UPGRADE TO VPS
- Custom builds, background jobs, heavy processing
- PM2 or custom process managers
- Native module dependencies
- More than 5 Node.js apps
