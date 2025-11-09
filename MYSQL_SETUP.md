# PostgreSQL Database Setup for Tax Management Website

## Neon PostgreSQL (100% FREE - Recommended)

Neon is a serverless PostgreSQL platform that's completely free and works perfectly with Vercel.

### Setup Steps:

1. **Go to https://neon.tech/**
2. **Sign up with GitHub** (free account, no credit card required)
3. **Create a new project:**
   - Click "Create a project"
   - Choose a project name (e.g., "tax-management")
   - Select region closest to your Vercel deployment (usually US East)
   - Click "Create project"
4. **Get your connection string:**
   - After project is created, you'll see the connection details
   - Copy the "Connection string" - it looks like:
     ```
     postgresql://username:password@ep-region-name-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
     ```
5. **Use this connection string for DATABASE_URL**

## Setting up the DATABASE_URL in Vercel

Once you have your Neon PostgreSQL connection string:

```bash
# Remove old database variables (if any)
vercel env rm MONGODB_URI production
vercel env rm DATABASE_URL production

# Add new PostgreSQL variable
vercel env add DATABASE_URL production
# Paste your Neon connection string when prompted

# Also add to development
vercel env add DATABASE_URL development
# Paste the same connection string
```

## Connection String Format

Neon PostgreSQL format:
```
postgresql://username:password@host/database?sslmode=require
```

Example:
```
postgresql://myuser:abc123xyz@ep-cool-rain-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Why Neon?

✅ **100% Free** - No credit card required, generous free tier
✅ **Serverless** - Auto-scales, auto-pauses when not in use
✅ **Fast** - Optimized for serverless/edge deployments
✅ **Perfect for Vercel** - Both are serverless platforms
✅ **PostgreSQL** - Industry-standard, reliable, feature-rich
✅ **Instant** - Database ready in seconds

## Next Steps

1. Create your Neon account and project (takes 2 minutes)
2. Copy your connection string
3. Update Vercel environment variables (commands above)
4. Deploy the updated code: `vercel --prod`
5. Test user registration

The application will automatically:
- Connect to PostgreSQL instead of MongoDB/MySQL
- Create the necessary tables on first run
- Handle all database operations with PostgreSQL

