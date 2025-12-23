---
description: Hostinger Business Web Hosting rules and limitations - ALWAYS follow these when building apps
---

# 🎯 HOSTINGER BUSINESS WEB HOSTING - MANDATORY RULES

## 📊 ACCOUNT LIMITS
- **Max 5 Node.js apps** per account
- **3 GB RAM** limit
- **50 GB SSD** storage
- **600,000 inodes** (files/folders)
- **Shared CPU** resources

## ✅ ENVIRONMENT VARIABLES
1. **ONLY hPanel ENV variables work** - `.env` files do NOT work on production
2. **Always set ENV via Hostinger Dashboard** → Environment Variables section
3. **Use hardcoded fallbacks** in code:
   ```javascript
   host: process.env.DB_HOST || 'hardcoded_value'
   ```
4. **After changing ENV** → Must click **"Save and redeploy"** (not just Save)
5. **Don't set PORT manually** → Hostinger auto-injects it

## ✅ DEPLOYMENT RULES
1. **Rename `build` script** → Use `client:build` (Hostinger reacts to "build" keyword)
2. **Entry point must be `server.js`** at root level with `"main": "server.js"`
3. **Pre-build frontend** → Commit `dist/` folder (Hostinger may not build)
4. **package.json scripts**:
   ```json
   "scripts": {
     "start": "node server.js",
     "client:build": "cd client && npm install && npm run build"
   }
   ```

## ✅ ALLOWED STACK
- **Frontend**: React, Vite, Vue, Angular, Next.js, Parcel
- **Backend**: Express.js, Next.js API routes
- **Database**: MySQL only (Hostinger provided, use mysql2 package)

## ❌ NEVER USE
- Firebase, Supabase, MongoDB, PostgreSQL
- Serverless-only backends
- Platform-locked backends
- PM2 or custom process managers
- Background daemons or persistent workers
- Native system dependencies

## ⚠️ HARD LIMITATIONS
- **No root access** - Cannot install system-wide packages
- **No custom daemons** - Only web-facing apps (HTTP/HTTPS)
- **No PM2** - Platform manages app restarts
- **Limited npm packages** - Only packages without native dependencies
- **Network restrictions** - Outbound networking may be limited
- **No SSH root** - SSH available but not with root privileges
- **Long-running tasks throttled** - Resource-intensive apps may be stopped

## 🔧 MYSQL CONNECTION TEMPLATE
```javascript
// ALWAYS use fallbacks for Hostinger
const DB_CONFIG = {
  host: process.env.DB_HOST || 'YOUR_HOSTINGER_IP',
  user: process.env.DB_USER || 'YOUR_DB_USER',
  password: process.env.DB_PASSWORD || 'YOUR_DB_PASSWORD',
  database: process.env.DB_NAME || 'YOUR_DB_NAME',
  port: Number(process.env.DB_PORT) || 3306
};
```

## 📋 DEPLOYMENT CHECKLIST
- [ ] `server.js` at root level
- [ ] `package.json` has `"main": "server.js"` and `"start": "node server.js"`
- [ ] No `build` script (rename to `client:build`)
- [ ] Frontend pre-built and `dist/` committed
- [ ] MySQL credentials with hardcoded fallbacks
- [ ] `/health` endpoint returns `SERVER ALIVE`
- [ ] CORS configured
- [ ] Environment variables set in Hostinger hPanel
- [ ] No more than 5 Node.js apps on account
- [ ] App uses less than 3GB RAM

## 💡 VPS UPGRADE NEEDED FOR:
- Custom builds or heavy processing
- Background jobs or workers
- Custom process managers (PM2)
- Native module dependencies
- Persistent daemons
