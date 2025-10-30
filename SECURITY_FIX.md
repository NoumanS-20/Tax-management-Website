# Security Alert: MongoDB Credentials Exposed

## What Happened
GitHub detected example MongoDB connection strings in documentation files. These were not actual credentials, but GitHub's secret scanning flagged them as potentially sensitive.

## Actions Taken

✅ Updated documentation to use placeholders:
- Changed `mongodb+srv://username:password@cluster.mongodb.net/...` 
- To `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/...`

## Important: Check Your Actual Credentials

Even though the exposed values were examples, you must verify:

### 1. Check MongoDB Atlas
- Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
- Log in and check your database users
- Look for any suspicious activity in Access Logs
- Review recent connections

### 2. Check Vercel Environment Variables
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Verify your `MONGODB_URI` is set (should be secure)
- Check other secrets: `JWT_SECRET`, `JWT_REFRESH_SECRET`

### 3. Check Git History
If you previously committed actual credentials (not just examples):
- You need to rotate those credentials
- Follow the steps below to purge them from Git history

## If Real Credentials Were Exposed

### Step 1: Rotate MongoDB Atlas Credentials

1. **Log into MongoDB Atlas**
2. **Go to Database Access**
3. **Find your database user**
4. **Edit and reset the password**
5. **Note the new password securely**

### Step 2: Update Vercel Environment Variables

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Update `MONGODB_URI` with new credentials
4. Format: `mongodb+srv://USERNAME:NEW_PASSWORD@cluster.mongodb.net/swifttax?retryWrites=true&w=majority`

### Step 3: Purge Git History (if needed)

If real credentials were committed to Git history:

```bash
# Install git-filter-repo if not installed
# pip install git-filter-repo

# Remove sensitive data from all commits
git filter-repo --path-glob '*.md' --invert-paths --path-glob '*.env*' --invert-paths

# Force push (dangerous - coordinate with team)
git push origin --force --all
```

**Warning:** Only do this if you're sure real credentials were exposed!

### Step 4: Revoke Old Credentials

1. Go to MongoDB Atlas → Database Access
2. Delete or disable the old user
3. Create a new user with the new credentials

## Prevention Measures

### ✅ Already in Place
- `.env` files are in `.gitignore`
- `server/env.example` uses placeholders
- Documentation updated to use placeholders

### 🔒 Best Practices Going Forward

1. **Never commit actual credentials**
   - Always use placeholders: `YOUR_USERNAME`, `YOUR_PASSWORD`
   - Or use example values: `example_user`, `example_pass`

2. **Use Environment Variables**
   - Store real credentials in Vercel environment variables only
   - Never hardcode in source files

3. **Review Before Committing**
   ```bash
   # Check what you're about to commit
   git diff --cached
   
   # Look for sensitive patterns
   git diff --cached | grep -E "(mongodb\+srv://|password|secret|key|token)"
   ```

4. **Use Git Hooks**
   Create `.git/hooks/pre-commit`:
   ```bash
   #!/bin/bash
   # Check for potential secrets
   if git diff --cached | grep -E "(mongodb\+srv://[^Y]|password\s*=\s*[^{])"; then
     echo "ERROR: Potential secret detected! Review before committing."
     exit 1
   fi
   ```

## Verification Checklist

- [ ] MongoDB Atlas credentials reviewed
- [ ] No suspicious activity in MongoDB logs
- [ ] Vercel environment variables are secure
- [ ] All documentation uses placeholders
- [ ] `.env` files are in `.gitignore`
- [ ] Git history reviewed for real credentials
- [ ] Team notified of security practices

## Next Steps

1. ✅ Documentation updated (done)
2. ⏳ Review MongoDB Atlas logs
3. ⏳ Verify Vercel environment variables
4. ⏳ Check Git history for real credentials
5. ⏳ Rotate credentials if necessary
6. ⏳ Close GitHub security alert

## Resources

- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Questions?

If you find actual credentials in your Git history or MongoDB logs, you must:
1. Rotate credentials immediately
2. Review access logs for unauthorized access
3. Consider using MongoDB Atlas IP whitelist
4. Enable additional security features

---

**Remember:** Security is everyone's responsibility. When in doubt, rotate credentials and use environment variables.

