# Vercel Deployment Checklist

Follow these steps to successfully deploy your SwiftTax application to Vercel.

## Pre-Deployment

- [ ] All changes committed to Git
- [ ] MongoDB Atlas account created (if not using existing DB)
- [ ] MongoDB cluster created and running
- [ ] Database user created with read/write permissions
- [ ] IP whitelist configured (0.0.0.0/0 for development)

## Vercel Setup

- [ ] Vercel account created
- [ ] Vercel CLI installed (optional) or use web interface
- [ ] GitHub repository connected to Vercel
- [ ] Project imported in Vercel dashboard

## Environment Variables

Add these in Vercel Project Settings → Environment Variables:

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Strong random secret (32+ characters)
- [ ] `JWT_REFRESH_SECRET` - Strong random secret (32+ characters)
- [ ] `NODE_ENV` - Set to "production"
- [ ] `CORS_ORIGIN` - Your Vercel domain (optional but recommended)

### Generate Secrets

Run this command twice to generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Files to Commit

Make sure these new files are in your repository:

- [ ] `vercel.json`
- [ ] `api/index.js`
- [ ] `api/package.json`
- [ ] `CHANGES_SUMMARY.md`
- [ ] `DEPLOYMENT_QUICK_START.md`
- [ ] `VERCEL_DEPLOYMENT.md`
- [ ] `DEPLOYMENT_CHECKLIST.md` (this file)

## Deployment Steps

1. [ ] Push code to GitHub:
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. [ ] Trigger Vercel deployment (automatic on push or manual)

3. [ ] Wait for build to complete

4. [ ] Check deployment logs for errors

## Post-Deployment Testing

Test these endpoints and features:

- [ ] Health check: `https://your-domain.vercel.app/api/health`
- [ ] User registration: `/register`
- [ ] User login: `/login`
- [ ] Dashboard access after login
- [ ] Tax form creation
- [ ] Document upload
- [ ] Notifications

## Troubleshooting

If any test fails, check:

- [ ] Vercel deployment logs
- [ ] Environment variables are set correctly
- [ ] MongoDB connection string is valid
- [ ] MongoDB IP whitelist is configured
- [ ] Database user permissions are correct
- [ ] JWT secrets are strong and valid

## Common Issues

### 404 Errors
- ✅ Fixed by `vercel.json` configuration
- Check that `api/index.js` exists

### MongoDB Connection Failed
- Verify connection string format
- Check IP whitelist
- Verify database user credentials

### CORS Errors
- Add Vercel domain to `CORS_ORIGIN`
- Check browser console for specific errors

### Build Fails
- Check package.json dependencies
- Verify Node.js version compatibility
- Check build logs for specific errors

## Performance Optimization

After deployment works:

- [ ] Enable Vercel Analytics
- [ ] Set up monitoring and alerts
- [ ] Configure automatic deployments
- [ ] Set up custom domain
- [ ] Enable HTTPS (automatic on Vercel)

## Security Hardening

- [ ] Change default MongoDB password
- [ ] Use strong JWT secrets
- [ ] Review rate limiting settings
- [ ] Enable Vercel DDoS protection
- [ ] Set up database backups

## Documentation

- [ ] Update README with production URL
- [ ] Document environment variables
- [ ] Add deployment instructions for team
- [ ] Update API documentation

## Success Criteria

Your deployment is successful when:

✅ No 404 errors on any API endpoint
✅ Users can register and login
✅ All CRUD operations work
✅ File uploads work
✅ Database connection is stable
✅ No errors in logs

## Next Steps After Success

1. Monitor application for 24 hours
2. Test all features thoroughly
3. Set up error tracking (Sentry, etc.)
4. Configure backups
5. Plan for scaling if needed

## Support Resources

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- SwiftTax Project: Check repository issues

---

**Last Updated**: Created with deployment fix for 404 registration errors

