---
description: Hostinger Business Web Hosting rules and limitations - ALWAYS follow these when building apps
---

# 🎯 HOSTINGER BUSINESS WEB HOSTING - MANDATORY RULES

## ✅ ENVIRONMENT VARIABLES
1. **ONLY hPanel ENV variables persist** - `.env` files in code do NOT work on production
2. **Always set ENV via Hostinger Dashboard** → Environment Variables section
3. **Use hardcoded fallbacks** in code when ENV is unreliable:
   ```javascript
   host: process.env.DB_HOST || 'hardcoded_value'
   ```
4. **After changing ENV** → Must click **"Save and redeploy"** (not just Save)
5. **Don't set PORT manually** → Hostinger auto-injects it

## ✅ DEPLOYMENT RULES
1. **Rename `build` script** → Use `client:build` or other name (Hostinger reacts to "build" keyword and treats as React app)
2. **Entry point must be `server.js`** at root level with `"main": "server.js"` in package.json
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
- System-wide package installations

## ⚠️ LIMITATIONS
- No root access
- Strict CPU/RAM limits
- Long-running or resource-intensive apps may be throttled or stopped
- Some environment variable behaviors are restricted
- Only Business, Cloud, and Agency plans support Node.js Web App

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
