# Fixing Vercel Deployment Failure

## The Error
Deployment has failed on GitHub with Vercel.

## Common Causes

### 1. Missing Dependencies
Vercel might not be installing dependencies for the `api/` folder.

**Solution:** Ensure `api/package.json` exists and has all dependencies.

### 2. Build Configuration
The `vercel.json` might be missing required build settings.

**Solution:** Current `vercel.json` includes:
- `buildCommand: "npm run build"` - Builds the frontend
- `outputDirectory: "dist"` - Where Vercel looks for built files
- `framework: "vite"` - Tells Vercel to use Vite

### 3. Serverless Function Setup
Vercel needs to detect the serverless function in `api/` folder.

**Solution:** Vercel automatically detects any function in `api/` folder.

## Debugging Steps

### Step 1: Check Vercel Logs
Go to Vercel Dashboard → Deployments → Click on failed deployment → View logs

Look for errors like:
- "Module not found"
- "Cannot find module"
- Build errors
- Dependency installation errors

### Step 2: Verify Files Are Pushed
```bash
git status
git log --oneline -5
```

Ensure `api/` folder is committed and pushed.

### Step 3: Test Local Build
```bash
# Build frontend locally
npm run build

# Should create dist/ folder
```

If local build fails, fix those errors first.

### Step 4: Check Vercel Configuration
In Vercel Dashboard → Project Settings:
- Build Command: Should be `npm run build` or auto-detected
- Output Directory: Should be `dist` or auto-detected  
- Framework Preset: Should be `Vite` or `Other`

## Quick Fixes

### Fix 1: Add All Dependencies to Root package.json
If `api/package.json` isn't being detected, add all server dependencies to root `package.json`:

```bash
npm install bcryptjs cors dotenv express express-mongo-sanitize express-rate-limit helmet hpp jsonwebtoken mongoose multer nodemailer winston xss-clean
```

### Fix 2: Use Explicit Builds in vercel.json
Try adding explicit builds:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Fix 3: Check API Folder Structure
Make sure you have:
```
/api
  /index.js
  /package.json
/server
  /routes
  /models
  /controllers
  /middleware
```

### Fix 4: Environment Variables
Make sure these are set in Vercel:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`

## Manual Deployment Testing

### Test with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

This will give you detailed error messages.

### Test Local Production Build
```bash
# Build
npm run build

# Serve with Vercel CLI
vercel dev
```

## Most Common Issues

1. **Module not found**: Missing dependency in `api/package.json` or root `package.json`
2. **Build timeout**: Too large file size, reduce dependencies or use external services
3. **Path not found**: Incorrect file paths in `api/index.js` (should use `../server/`)
4. **Environment variables**: Not set in Vercel dashboard
5. **MongoDB connection**: Atlas configuration issue

## Next Steps

1. Check Vercel logs for specific error
2. Share error message for targeted fix
3. Test local build to isolate the issue
4. Verify all environment variables are set

## Getting Help

If still failing after these steps, share:
1. Full error message from Vercel logs
2. Contents of `vercel.json`
3. Build log output
4. Any recent changes to `api/` or `server/` folders

