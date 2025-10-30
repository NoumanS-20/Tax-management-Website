# Vercel Deployment Guide

This guide will help you deploy SwiftTax on Vercel.

## Prerequisites

1. A Vercel account ([vercel.com](https://vercel.com))
2. A MongoDB database (recommended: [MongoDB Atlas](https://www.mongodb.com/atlas))
3. Node.js and npm installed locally

## Deployment Steps

### 1. MongoDB Atlas Setup

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string (mongodb+srv://...)
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for development)

### 2. Vercel Deployment

#### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Option B: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Configure deployment settings:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 3. Environment Variables

In your Vercel project settings, add the following environment variables:

**Required Variables:**
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/swifttax?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-at-least-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-here-make-it-long-and-random-at-least-32-characters
NODE_ENV=production
PORT=3000
```

**Optional Variables:**
```
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-domain.vercel.app
```

**Important Notes:**
- Generate strong, random secrets for JWT keys (at least 32 characters)
- Never commit `.env` files to Git
- Use different secrets for production and development
- Update `CORS_ORIGIN` with your actual Vercel domain

### 4. Configuration Files

The repository includes:
- `vercel.json` - Vercel configuration
- `api/index.js` - Serverless function entry point
- `.gitignore` - Excludes sensitive files

### 5. Project Structure

```
/
├── api/
│   └── index.js          # Serverless API entry point
├── server/               # Backend code
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── src/                  # Frontend React code
├── dist/                 # Build output (generated)
├── vercel.json          # Vercel configuration
└── package.json
```

## Testing Your Deployment

### 1. Health Check

Visit: `https://your-domain.vercel.app/api/health`

Expected response:
```json
{
  "success": true,
  "message": "SwiftTax API is running",
  "timestamp": "2025-01-30T...",
  "environment": "production"
}
```

### 2. Test Registration

Try registering a new user at: `https://your-domain.vercel.app/register`

### 3. Check Logs

```bash
# View deployment logs
vercel logs

# Follow logs in real-time
vercel logs --follow
```

## Common Issues

### Issue: 404 Error on API Routes

**Solution:** Ensure `vercel.json` is properly configured and `api/index.js` exists.

### Issue: MongoDB Connection Failed

**Solution:**
1. Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
2. Verify `MONGODB_URI` environment variable is correct
3. Check database user permissions

### Issue: CORS Errors

**Solution:** Add your Vercel domain to `CORS_ORIGIN` environment variable.

### Issue: File Upload Fails

**Solution:** Vercel serverless functions have limitations:
- Consider using external storage (AWS S3, Cloudinary, etc.)
- Or use Vercel Blob Storage for file uploads

## Environment-Specific Configuration

### Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
CORS_ORIGIN=https://your-domain.vercel.app
```

### Development
```env
NODE_ENV=development
MONGODB_URI=your-dev-mongodb-uri
CORS_ORIGIN=http://localhost:5173
```

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use strong JWT secrets** - Generate random 32+ character strings
3. **Enable MongoDB authentication** - Use strong passwords
4. **Restrict CORS origins** - Only allow your domains
5. **Use HTTPS** - Vercel provides this automatically
6. **Enable rate limiting** - Already configured in the app
7. **Regular updates** - Keep dependencies updated

## Monitoring and Logs

### Vercel Dashboard
- View deployment logs in Vercel dashboard
- Monitor API usage and performance
- Check error rates and response times

### Application Logs
```bash
# View logs
vercel logs [deployment-url] --follow

# View specific function logs
vercel logs api/index.js --follow
```

## Database Management

### MongoDB Atlas
- Use MongoDB Compass for GUI access
- Monitor database performance
- Set up automated backups
- Configure alerts for unusual activity

### Recommended Atlas Settings
- M0 Free tier for small projects
- Enable free 512MB storage
- Configure daily backups
- Set up performance alerts

## Next Steps After Deployment

1. **Set up domain** - Add custom domain in Vercel settings
2. **Enable analytics** - Add Vercel Analytics
3. **Configure backups** - Set up MongoDB Atlas backups
4. **Add monitoring** - Set up error tracking (Sentry, etc.)
5. **Test thoroughly** - Test all features in production
6. **Update documentation** - Update user-facing docs

## Support

For issues related to:
- **Vercel** - Check [Vercel Docs](https://vercel.com/docs)
- **MongoDB** - Check [MongoDB Docs](https://docs.mongodb.com)
- **Application** - Check repository issues

## Troubleshooting Checklist

- [ ] MongoDB connection string is correct
- [ ] Environment variables are set in Vercel
- [ ] MongoDB Atlas IP whitelist is configured
- [ ] Database user has correct permissions
- [ ] JWT secrets are strong and random
- [ ] CORS origin matches your domain
- [ ] Build completes successfully
- [ ] Health check endpoint works
- [ ] API routes return expected responses

## Cost Considerations

### Free Tier (Suitable for Development)
- Vercel: Free for personal projects
- MongoDB Atlas: Free M0 cluster (512MB)
- Function execution time: 10 seconds max

### Paid Tier (For Production)
- Vercel Pro: $20/month
- MongoDB Atlas: Based on cluster size
- Additional features: Better performance, more resources

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Serverless Best Practices](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

