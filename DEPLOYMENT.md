# Deployment Guide - Render + Clever Cloud (Single Deployment)

This guide will help you deploy the Job Management Portal to Render (single deployment) and Clever Cloud (database).

**Key Difference**: This uses a single Render deployment that serves both the backend API and the frontend React app - just like Antigravity!

## Prerequisites
- GitHub account
- Render account (render.com)
- Clever Cloud account (clever-cloud.com)

## Step 1: Set Up Database on Clever Cloud

1. Log in to Clever Cloud
2. Go to "Create" → "MySQL"
3. Choose a plan (Free tier available)
4. Once created, go to your MySQL instance
5. Click "Environment Variables" or "Connection Information"
6. Note down these values:
   - `MYSQL_HOST` (DB_HOST)
   - `MYSQL_USER` (DB_USER)
   - `MYSQL_PASSWORD` (DB_PASSWORD)
   - `MYSQL_DATABASE` (DB_NAME)
   - `MYSQL_PORT` (DB_PORT)

## Step 2: Deploy to Render (Single Deployment)

### 2.1 Prepare Your Repository
You need to push the **entire project** (both backend and frontend folders) to GitHub. The backend will automatically build and serve the frontend.

```bash
cd "d:/movies/PRAGA/Job Management"
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2.2 Deploy to Render
1. Log in to Render
2. Go to "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: job-management-portal
   - **Environment**: Node
   - **Region**: Choose nearest region
   - **Branch**: main
   - **Root Directory**: `backend` (important!)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables (from Clever Cloud):
   ```
   NODE_ENV = production
   DB_HOST = your_clever_cloud_host
   DB_USER = your_clever_cloud_user
   DB_PASSWORD = your_clever_cloud_password
   DB_NAME = your_clever_cloud_dbname
   DB_PORT = 3306
   JWT_SECRET = generate_a_long_random_string_here
   ```
6. Click "Create Web Service"
7. Wait for deployment to complete (3-5 minutes)
8. Note your deployment URL: `https://your-app.onrender.com`

### 2.3 Run Database Migrations on Clever Cloud
1. Once deployed, go to Clever Cloud
2. Use the Clever Cloud console to run the SQL setup scripts:
   - Open `database/setup_mysql.sql` or `database/setup_postgresql.sql`
   - Execute the script in Clever Cloud's database console
   - Optionally run `database/seed_data.sql` to add sample data

## Step 3: Test the Deployment

1. Open your Render deployment URL in a browser
2. Test login with sample credentials:
   - Job Seeker: `alice@email.com` / `password123`
   - Recruiter: `john@techcorp.com` / `password123`
3. Test all features:
   - User registration
   - Job posting
   - Job application
   - Resume upload
   - Application status updates

## How It Works

- **Single Deployment**: The backend serves both the API routes (`/api/*`) and the frontend React app (all other routes)
- **Automatic Build**: When `npm install` runs, it automatically builds the frontend using the `postinstall` script
- **Static Files**: The frontend build files are served from `frontend/build` directory
- **No CORS Issues**: Since frontend and backend are on the same domain, no CORS configuration needed

## Troubleshooting

### Deployment fails
- Check that Root Directory is set to `backend`
- Ensure environment variables match Clever Cloud credentials
- Check Render logs for error messages

### Frontend not loading
- Check if frontend build completed successfully (check Render logs)
- Ensure `postinstall` script ran correctly
- Verify build files exist in `frontend/build` directory

### Database connection issues
- Verify Clever Cloud database is running
- Check firewall/network settings in Clever Cloud
- Ensure database credentials are correct

### Resume upload issues
- Render free tier has disk size limitations
- Ensure uploads directory has write permissions
- Check if file size exceeds limits (5MB)

## Important Notes

- **Single Deployment**: Only one Render service needed (not separate frontend/backend)
- **Free Tier Limits**: Render free tier spins down after 15 minutes of inactivity (cold start ~30 seconds)
- **Database**: Clever Cloud free tier has connection limits and storage limits
- **File Storage**: For production, consider using cloud storage instead of local file storage
- **HTTPS**: All Render deployments automatically get HTTPS
- **Environment Variables**: Never commit sensitive data to GitHub

## Monitoring

- Monitor your Render dashboard for deployment status
- Check Clever Cloud dashboard for database performance
- Set up alerts for errors and downtime

## Cost Estimation

- **Render Free Tier**: $0/month (with limitations)
- **Clever Cloud MySQL Free Tier**: $0/month (with limitations)
- **Total**: $0/month for basic deployment

For production, consider paid plans for better performance and reliability.
