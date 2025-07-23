# Railway Deployment Guide

This guide will walk you through deploying your recording system to Railway step by step.

## Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **MySQL Database** - You'll need a MySQL database (Railway provides this)

## Step 1: Prepare Your GitHub Repository

1. **Push all changes to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Verify your repository structure**:
   ```
   recording_system/
   ├── package.json
   ├── server/
   │   ├── package.json
   │   ├── server.js
   │   └── config/
   │       └── database.js
   ├── src/
   │   ├── App.js
   │   └── config/
   │       └── api.js
   ├── railway.json
   └── Procfile
   ```

## Step 2: Deploy to Railway

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your recording system repository
5. Click **"Deploy Now"**

### 2.2 Add MySQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"** → **"MySQL"**
3. Wait for the database to be created
4. Note down the database connection details

### 2.3 Configure Environment Variables

1. In your Railway project, go to the **"Variables"** tab
2. Add these environment variables:

   ```
   # Database Configuration
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_mysql_database
   
   # JWT Configuration
   JWT_SECRET=your_secure_random_string_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=production
   
   # Frontend URL (will be your Railway app URL)
   FRONTEND_URL=https://your-app-name.railway.app
   ```

3. **Get database credentials**:
   - Click on your MySQL database in Railway
   - Go to **"Connect"** tab
   - Copy the connection details

4. **Generate JWT Secret**:
   ```bash
   # Run this in your terminal to generate a secure secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### 2.4 Import Database Schema

1. **Download your schema file** from your local project: `server/schema.sql`
2. **Connect to your Railway MySQL database**:
   - Use a MySQL client (like MySQL Workbench, DBeaver, or command line)
   - Use the connection details from Railway
3. **Import the schema**:
   ```sql
   -- Connect to your Railway MySQL database and run:
   SOURCE /path/to/your/schema.sql;
   ```

   Or using command line:
   ```bash
   mysql -h your_host -u your_user -p your_database < server/schema.sql
   ```

## Step 3: Configure Your Application

### 3.1 Update Frontend Environment

1. In your Railway project, go to **"Variables"**
2. Add this variable:
   ```
   REACT_APP_API_URL=https://your-app-name.railway.app
   ```

### 3.2 Redeploy Your Application

1. Railway will automatically redeploy when you add environment variables
2. If not, go to **"Deployments"** tab and click **"Redeploy"**

## Step 4: Test Your Deployment

### 4.1 Check Health Endpoint

1. Visit: `https://your-app-name.railway.app/health`
2. You should see: `{"status":"OK","timestamp":"...","environment":"production"}`

### 4.2 Test Your Application

1. Visit your Railway app URL: `https://your-app-name.railway.app`
2. Try to log in with your existing credentials
3. Test all major functionality:
   - User management
   - Program creation
   - File uploads
   - Status tracking

## Step 5: Set Up Custom Domain (Optional)

1. In Railway dashboard, go to **"Settings"** → **"Domains"**
2. Click **"Generate Domain"** or add your custom domain
3. Update your `FRONTEND_URL` environment variable with the new domain

## Troubleshooting

### Common Issues:

1. **"Module not found" errors**:
   - Check that all dependencies are in `package.json`
   - Ensure `server/package.json` has all required dependencies

2. **Database connection errors**:
   - Verify database credentials in environment variables
   - Check that database is running in Railway

3. **CORS errors**:
   - Ensure `FRONTEND_URL` is set correctly
   - Check that the URL matches your actual Railway app URL

4. **Build failures**:
   - Check Railway build logs
   - Ensure all required files are committed to GitHub

### Useful Railway Commands:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# View logs
railway logs

# Open your app
railway open
```

## Monitoring Your Application

1. **View logs**: Go to **"Deployments"** → Click on latest deployment → **"View Logs"**
2. **Monitor performance**: Check **"Metrics"** tab for CPU, memory usage
3. **Set up alerts**: Configure notifications for deployment status

## Next Steps

1. **Test thoroughly** with your team
2. **Set up backups** for your database
3. **Configure monitoring** and alerts
4. **Train users** on the new system
5. **Set up SSL** (Railway provides this automatically)

## Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Check logs** in Railway dashboard for specific errors

Your recording system should now be live and accessible to users worldwide! 🌍 