# Recording System Deployment Guide

This guide will help you deploy your recording system so other users can access it from different devices.

## Current System Architecture

- **Frontend**: React.js application
- **Backend**: Express.js server with MySQL database
- **Authentication**: JWT-based authentication
- **File Storage**: Local file system for uploads

## Deployment Options

### Option 1: Cloud Deployment (Recommended)

#### A. Deploy to Railway (Easiest)
1. **Sign up for Railway** (railway.app)
2. **Connect your GitHub repository**
3. **Set up environment variables**:
   ```
   DATABASE_URL=your_mysql_connection_string
   JWT_SECRET=your_secure_jwt_secret
   PORT=5000
   ```
4. **Deploy automatically** - Railway will detect your Node.js app

#### B. Deploy to Render
1. **Sign up for Render** (render.com)
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure build settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `node server/server.js`
5. **Set environment variables**

#### C. Deploy to Heroku
1. **Sign up for Heroku** (heroku.com)
2. **Install Heroku CLI**
3. **Create Procfile** in root directory:
   ```
   web: node server/server.js
   ```
4. **Deploy using Git**:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Option 2: VPS Deployment (DigitalOcean, AWS, etc.)

#### Prerequisites
- VPS with Ubuntu/Debian
- Domain name (optional but recommended)
- SSH access

#### Step-by-Step VPS Deployment

1. **Connect to your VPS**:
   ```bash
   ssh root@your-server-ip
   ```

2. **Update system and install dependencies**:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm nginx mysql-server
   ```

3. **Install PM2 for process management**:
   ```bash
   npm install -g pm2
   ```

4. **Clone your repository**:
   ```bash
   git clone your-repository-url
   cd recording_system
   ```

5. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install
   ```

6. **Set up MySQL database**:
   ```bash
   sudo mysql_secure_installation
   mysql -u root -p
   CREATE DATABASE recording_system;
   CREATE USER 'recording_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON recording_system.* TO 'recording_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

7. **Import database schema**:
   ```bash
   mysql -u recording_user -p recording_system < server/schema.sql
   ```

8. **Configure environment variables**:
   Create `.env` file in server directory:
   ```
   DB_HOST=localhost
   DB_USER=recording_user
   DB_PASSWORD=your_password
   DB_NAME=recording_system
   JWT_SECRET=your_secure_jwt_secret
   PORT=5000
   ```

9. **Build frontend**:
   ```bash
   npm run build
   ```

10. **Start the application with PM2**:
    ```bash
    cd server
    pm2 start server.js --name "recording-system"
    pm2 startup
    pm2 save
    ```

11. **Configure Nginx as reverse proxy**:
    Create `/etc/nginx/sites-available/recording-system`:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        location / {
            root /path/to/your/recording_system/build;
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /uploads {
            proxy_pass http://localhost:5000;
        }
    }
    ```

12. **Enable the site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/recording-system /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    ```

13. **Set up SSL with Let's Encrypt**:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

### Option 3: Local Network Deployment

#### For Internal Use (Same Network)

1. **Find your computer's IP address**:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`

2. **Configure firewall**:
   - Allow port 5000 for backend
   - Allow port 3000 for frontend (if running separately)

3. **Update frontend API calls**:
   Change `localhost:5000` to `your-computer-ip:5000` in all API calls

4. **Start the application**:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start

   # Terminal 2 - Frontend
   npm start
   ```

5. **Access from other devices**:
   - Other devices on the same network can access: `http://your-computer-ip:3000`

## Required Code Changes for Deployment

### 1. Update Database Configuration

Create `server/config/database.js`:
```javascript
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '235203mth!',
  database: process.env.DB_NAME || 'recording_system',
  timezone: 'local',
});

module.exports = db;
```

### 2. Update Server Configuration

Update `server/server.js`:
```javascript
// Replace hardcoded database connection with:
const db = require('./config/database');

// Update JWT secret:
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Update CORS for production:
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### 3. Update Frontend API Configuration

Create `src/config/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  USERS: `${API_BASE_URL}/api/users`,
  PROGRAMS: `${API_BASE_URL}/api/programs`,
  // ... other endpoints
};
```

### 4. Environment Variables

Create `.env` files:

**Frontend (.env)**:
```
REACT_APP_API_URL=https://your-domain.com
```

**Backend (.env)**:
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=recording_system
JWT_SECRET=your_secure_jwt_secret
PORT=5000
FRONTEND_URL=https://your-domain.com
```

## Security Considerations

1. **Use strong JWT secrets**
2. **Enable HTTPS in production**
3. **Set up proper CORS policies**
4. **Use environment variables for sensitive data**
5. **Regular security updates**
6. **Database backup strategy**

## Monitoring and Maintenance

1. **Set up logging**:
   ```javascript
   const winston = require('winston');
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

2. **Health check endpoint**:
   ```javascript
   app.get('/health', (req, res) => {
     res.json({ status: 'OK', timestamp: new Date() });
   });
   ```

3. **Database backup script**:
   ```bash
   #!/bin/bash
   mysqldump -u recording_user -p recording_system > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

## Troubleshooting

### Common Issues:

1. **CORS errors**: Check CORS configuration and frontend URL
2. **Database connection**: Verify database credentials and network access
3. **File uploads**: Ensure upload directory has proper permissions
4. **JWT errors**: Check JWT secret configuration
5. **Port conflicts**: Verify port availability and firewall settings

### Useful Commands:

```bash
# Check if ports are in use
netstat -tulpn | grep :5000

# Check application logs
pm2 logs recording-system

# Restart application
pm2 restart recording-system

# Check nginx status
sudo systemctl status nginx
```

## Next Steps

1. Choose your deployment option based on your needs
2. Set up your chosen deployment method
3. Configure environment variables
4. Test the deployment thoroughly
5. Set up monitoring and backup strategies
6. Train users on the new system

For additional help, refer to the specific platform documentation or contact your system administrator. 