# Vercel 404 Troubleshooting Guide

## Quick Fix Summary

The main issue was **route path duplication**. Here's what was wrong and how it's fixed.

### The Problem
```javascript
// OLD (Wrong)
app.use('/api/auth', authRoutes);  // Vercel already adds /api prefix
```

When Vercel receives `/api/auth/register`, it routes to `/api/index.js` with path `/auth/register`.
But if the app then looks for `/api/auth/register`, it doesn't match and returns 404.

### The Solution
```javascript
// NEW (Correct)
app.use('/auth', authRoutes);  // No /api prefix needed
```

Now when Vercel receives `/api/auth/register`, it routes to `/api/index.js` with path `/auth/register`,
which matches `app.use('/auth', authRoutes)` → `router.post('/register')` ✅

## Testing Your Deployment

### 1. Check Health Endpoint
```bash
curl https://your-domain.vercel.app/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "SwiftTax API is running",
  "timestamp": "...",
  "environment": "production"
}
```

### 2. Test Registration
```bash
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

Expected: Should create user or return validation error (not 404)

## Common Issues Checklist

### Issue 1: Still Getting 404
- [ ] Did you push the updated `api/index.js` to GitHub?
- [ ] Did you redeploy on Vercel after pushing?
- [ ] Check Vercel deployment logs for errors
- [ ] Verify `api/index.js` exists in your repository

### Issue 2: MongoDB Connection Error
- [ ] Is `MONGODB_URI` set in Vercel environment variables?
- [ ] Is MongoDB Atlas cluster running?
- [ ] Is IP whitelist configured (0.0.0.0/0)?
- [ ] Are database credentials correct?

### Issue 3: CORS Errors
- [ ] Add your Vercel domain to `CORS_ORIGIN` env var
- [ ] Format: `https://your-app.vercel.app`
- [ ] Check browser console for specific CORS errors

### Issue 4: Build Fails
- [ ] Check Vercel build logs
- [ ] Ensure all dependencies are in `package.json`
- [ ] Verify Node.js version compatibility
- [ ] Check for syntax errors in `api/index.js`

## Deployment Steps

1. **Commit and Push**:
   ```bash
   git add api/ vercel.json
   git commit -m "Fix Vercel API routes - remove duplicate /api prefix"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to Vercel dashboard
   - Trigger new deployment (auto or manual)
   - Watch build logs

3. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=... (32+ chars)
   JWT_REFRESH_SECRET=... (32+ chars)
   NODE_ENV=production
   CORS_ORIGIN=https://your-app.vercel.app
   ```

4. **Test**:
   - Try registering a user
   - Check logs for errors
   - Verify database connection

## File Structure Reference

```
/
├── api/
│   ├── index.js          ← Express app (routes without /api)
│   └── package.json      ← Dependencies
├── server/
│   ├── routes/
│   │   └── auth.js       ← Router with /register, /login
│   └── ...
├── vercel.json           ← Routes /api/* to /api/index.js
└── ...
```

## Route Flow Diagram

```
User Request: POST /api/auth/register
     ↓
vercel.json: Route to /api/index.js
     ↓
api/index.js: app.use('/auth', authRoutes)
     ↓
server/routes/auth.js: router.post('/register', register)
     ↓
Register Controller: Creates user in MongoDB
     ↓
Response: 201 Created with user data
```

## Debugging Tips

### View Logs
```bash
# Using Vercel CLI
vercel logs [deployment-url]

# In browser
Open Vercel dashboard → Deployments → View logs
```

### Local Testing
```bash
# Test serverless function locally
vercel dev
```

### Check Request Path
Add logging in `api/index.js`:
```javascript
app.use('*', (req, res, next) => {
  console.log('Request path:', req.path);
  next();
});
```

## Still Not Working?

If you're still getting 404 errors:

1. **Verify the fix was deployed**:
   - Check `api/index.js` in your repository
   - Ensure routes use `/auth` not `/api/auth`

2. **Clear cache**:
   - Hard refresh browser (Ctrl+F5)
   - Try incognito mode

3. **Check logs**:
   - Vercel function logs
   - Browser console
   - Network tab in DevTools

4. **Test health endpoint first**:
   - If `/api/health` works, the serverless function is working
   - If it doesn't work, there's a deeper deployment issue

## Success Indicators

✅ Health check returns success  
✅ Registration endpoint responds (not 404)  
✅ User can be created in database  
✅ Login works with created user  
✅ No errors in Vercel logs  

## Additional Resources

- Vercel Serverless Functions: https://vercel.com/docs/concepts/functions
- Express on Vercel: https://vercel.com/guides/using-express-with-vercel
- MongoDB Atlas: https://docs.atlas.mongodb.com

