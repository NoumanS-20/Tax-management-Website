# Quick Deployment Guide for Vercel

## The Problem
You were getting a 404 error when trying to register because Vercel didn't know how to handle your Express backend routes.

## The Solution
I've created the necessary configuration files to make your Express app work as serverless functions on Vercel.

## What Was Added

1. **`vercel.json`** - Tells Vercel how to route your requests
2. **`api/index.js`** - Serverless function entry point for your Express backend
3. **`api/package.json`** - Dependencies needed for the API
4. **`VERCEL_DEPLOYMENT.md`** - Detailed deployment guide
5. **`VERCEL_TROUBLESHOOTING.md`** - Troubleshooting guide with common fixes

## Important Fix

The routes in `api/index.js` have been fixed to remove duplicate `/api` prefix:
- ✅ Correct: `app.use('/auth', authRoutes)` 
- ❌ Wrong: `app.use('/api/auth', authRoutes)`

This was causing 404 errors because Vercel already adds the `/api` prefix when routing to serverless functions.

## Quick Steps to Deploy

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

### 3. Set Environment Variables
In Vercel project settings, add these required variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swifttax?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-at-least-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-here-make-it-long-and-random-at-least-32-characters
NODE_ENV=production
```

**Generate strong secrets** using this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy
Click "Deploy" and wait for the build to complete.

### 5. Test
1. Visit your deployment URL
2. Go to `/register`
3. Try creating an account - it should work now!

## MongoDB Atlas Setup

If you don't have MongoDB yet:

1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Add IP whitelist: `0.0.0.0/0` (or your specific IPs)
5. Get connection string and add to Vercel env vars

## Troubleshooting

### Still getting 404?
- Check Vercel deployment logs
- Verify `api/index.js` is in the repository
- Make sure environment variables are set

### MongoDB connection error?
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify connection string is correct
- Check database user has read/write permissions

### CORS errors?
- Add your Vercel domain to the `CORS_ORIGIN` environment variable
- Format: `https://your-app.vercel.app`

## File Structure

```
/
├── api/
│   ├── index.js          ← New: Serverless entry point
│   └── package.json      ← New: API dependencies
├── server/               ← Your existing backend
├── vercel.json          ← New: Vercel config
└── ... rest of project
```

## Next Steps

1. ✅ Deployment should now work
2. 📝 Test all features (register, login, forms, etc.)
3. 🔐 Set up proper security (strong secrets, HTTPS, etc.)
4. 📊 Add monitoring and analytics
5. 🌐 Configure custom domain if needed

## Need Help?

- Check `VERCEL_DEPLOYMENT.md` for detailed instructions
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

