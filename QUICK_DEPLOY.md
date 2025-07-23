# Quick Deployment Guide

Choose the easiest option for your needs:

## Option 1: Railway (Recommended - Easiest)

### Step 1: Prepare Your Code
1. Make sure your code is in a GitHub repository
2. Ensure all files are committed and pushed

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect your Node.js app

### Step 3: Configure Environment Variables
In Railway dashboard, go to "Variables" tab and add:
```
DATABASE_URL=your_mysql_connection_string
JWT_SECRET=your_secure_random_string
PORT=5000
```

### Step 4: Set up Database
1. Use Railway's MySQL plugin or external MySQL service
2. Update DATABASE_URL with your database connection string
3. Import your schema: `mysql -h host -u user -p database < server/schema.sql`

### Step 5: Access Your App
Your app will be available at the URL provided by Railway!

## Option 2: Render (Also Easy)

### Step 1: Prepare Your Code
1. Ensure your code is in a GitHub repository
2. Add a `Procfile` in your root directory (already created)

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: recording-system
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/server.js`

### Step 3: Set Environment Variables
Add these in Render dashboard:
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=recording_system
JWT_SECRET=your_secure_random_string
PORT=5000
```

### Step 4: Deploy
Click "Create Web Service" and wait for deployment!

## Option 3: Local Network (For Testing)

### Step 1: Find Your IP Address
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

### Step 2: Update Frontend Configuration
Create `.env` file in root directory:
```
REACT_APP_API_URL=http://YOUR_IP_ADDRESS:5000
```

### Step 3: Start the Application
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm start
```

### Step 4: Access from Other Devices
Other devices on the same network can access:
- Frontend: `http://YOUR_IP_ADDRESS:3000`
- Backend: `http://YOUR_IP_ADDRESS:5000`

## Option 4: VPS Deployment (Advanced)

### Step 1: Use the Deployment Script
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Step 2: Configure Nginx (Optional)
Follow the detailed guide in `DEPLOYMENT_GUIDE.md` for Nginx setup.

## Quick Troubleshooting

### Common Issues:

1. **"Module not found" errors**
   - Run `npm install` in both root and server directories

2. **Database connection errors**
   - Check your database credentials in `.env` file
   - Ensure database is running and accessible

3. **CORS errors**
   - Update CORS configuration in server.js
   - Check frontend API URL configuration

4. **Port already in use**
   - Change PORT in environment variables
   - Kill existing processes: `lsof -ti:5000 | xargs kill -9`

### Useful Commands:

```bash
# Check if application is running
pm2 status

# View logs
pm2 logs recording-system

# Restart application
pm2 restart recording-system

# Check port usage
netstat -tulpn | grep :5000
```

## Next Steps After Deployment

1. **Test all functionality** - Login, create programs, upload files
2. **Set up SSL certificate** - For production use
3. **Configure backups** - Database and file backups
4. **Set up monitoring** - Application health checks
5. **Train users** - Provide access instructions to your team

## Support

If you encounter issues:
1. Check the detailed `DEPLOYMENT_GUIDE.md`
2. Review application logs
3. Verify environment variables
4. Test database connectivity

Your recording system should now be accessible to users from different devices! 🎉 