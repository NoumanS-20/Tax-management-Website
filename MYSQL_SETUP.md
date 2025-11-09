# MySQL Database Setup for Tax Management Website

## Option 1: Railway (Recommended - Easiest)

1. Go to https://railway.app/
2. Click "Start a New Project"
3. Select "Provision MySQL"
4. Once created, click on the MySQL service
5. Go to "Variables" tab
6. Copy the `DATABASE_URL` value (it looks like: `mysql://root:password@containers-us-west-123.railway.app:6543/railway`)
7. Use this URL for your `DATABASE_URL` environment variable

## Option 2: PlanetScale (Good but requires credit card for new accounts)

1. Go to https://planetscale.com/
2. Create a free account
3. Create a new database
4. Get the connection string from the dashboard
5. Use this URL for your `DATABASE_URL` environment variable

## Option 3: Vercel Postgres (Good integration with Vercel)

1. Go to your Vercel dashboard
2. Go to Storage tab
3. Create a new Postgres database
4. Get the connection string
5. Note: You'll need to adjust the sequelize config slightly for Postgres

## Setting up the DATABASE_URL in Vercel

Once you have your MySQL connection string:

```bash
# Remove old MongoDB variable
vercel env rm MONGODB_URI production

# Add new MySQL variable
vercel env add DATABASE_URL production
# Paste your MySQL connection string when prompted

# Also add to development if testing locally
vercel env add DATABASE_URL development
```

## Connection String Format

Railway/MySQL format:
```
mysql://username:password@host:port/database
```

Example:
```
mysql://root:ABCdefGHI123@containers-us-west-56.railway.app:7204/railway
```

## Next Steps

1. Get your DATABASE_URL from Railway (or another provider)
2. Update Vercel environment variables
3. Deploy the updated code
4. Test user registration

The application will automatically:
- Connect to MySQL instead of MongoDB
- Create the necessary tables on first run
- Handle all database operations with the new MySQL backend
