# MedAI Deployment Guide

Complete guide for deploying MedAI Healthcare Platform to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Domain & SSL](#domain--ssl)
- [Monitoring & Logging](#monitoring--logging)
- [Backup Strategy](#backup-strategy)
- [Scaling](#scaling)

---

## Prerequisites

### Required Services

1. **MongoDB Atlas** (or self-hosted MongoDB)
2. **Node.js Hosting** (Heroku, Railway, DigitalOcean, AWS, etc.)
3. **Static Hosting** (Vercel, Netlify, Cloudflare Pages, etc.)
4. **Cloudinary Account** (for file storage)
5. **Domain Name** (optional but recommended)

### API Keys Required

- Google Gemini AI API Key
- Deepgram API Key
- Sarvam AI API Key
- Google Maps API Key
- Cloudinary credentials

---

## Environment Setup

### Production Environment Variables

Create a `.env.production` file with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medai?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long

# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# AI Services
VITE_GEMINI_API_KEY=your-production-gemini-api-key
DEEPGRAM_API_KEY=your-production-deepgram-api-key
SARVAM_API_KEY=your-production-sarvam-api-key

# Maps
VITE_GOOGLE_MAPS_API_KEY=your-production-google-maps-api-key

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email (if using email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

---

## Database Setup

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in
   - Create a new project

2. **Create Cluster**
   ```
   - Choose cloud provider (AWS/GCP/Azure)
   - Select region closest to your users
   - Choose cluster tier (M10+ for production)
   - Configure cluster name
   ```

3. **Configure Network Access**
   ```
   - Add IP whitelist (0.0.0.0/0 for all IPs or specific IPs)
   - Create database user with strong password
   ```

4. **Get Connection String**
   ```
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace <password> with your database password
   ```

5. **Database Indexes**
   ```javascript
   // Run these commands in MongoDB shell
   use medai;
   
   // User indexes
   db.users.createIndex({ email: 1 }, { unique: true });
   db.users.createIndex({ healthId: 1 }, { unique: true, sparse: true });
   db.users.createIndex({ isActive: 1 });
   
   // Doctor indexes
   db.doctors.createIndex({ email: 1 }, { unique: true });
   db.doctors.createIndex({ licenseNumber: 1 }, { unique: true });
   db.doctors.createIndex({ specialization: 1 });
   db.doctors.createIndex({ isVerified: 1, isActive: 1 });
   
   // Lab indexes
   db.labs.createIndex({ email: 1 }, { unique: true });
   db.labs.createIndex({ licenseNumber: 1 }, { unique: true });
   db.labs.createIndex({ isApproved: 1, isActive: 1 });
   
   // Admin indexes
   db.admins.createIndex({ email: 1 }, { unique: true });
   db.admins.createIndex({ role: 1, isActive: 1 });
   
   // Appointment indexes
   db.appointments.createIndex({ doctor: 1, appointmentDate: 1 });
   db.appointments.createIndex({ patient: 1, status: 1 });
   ```

---

## Backend Deployment

### Option 1: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set MONGODB_URI="your-mongodb-uri"
   railway variables set JWT_SECRET="your-jwt-secret"
   # Add all other environment variables
   ```

5. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create medai-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   # Add all other environment variables
   ```

5. **Create Procfile**
   ```
   web: node backend/server.js
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Create Account** on DigitalOcean

2. **Create New App**
   - Connect GitHub repository
   - Select branch (main/production)

3. **Configure Build Settings**
   ```yaml
   name: medai-backend
   services:
   - name: api
     github:
       repo: your-username/medai-healthcare-platform
       branch: main
       deploy_on_push: true
     build_command: npm install
     run_command: node backend/server.js
     environment_slug: node-js
     envs:
       - key: MONGODB_URI
         value: ${MONGODB_URI}
       - key: JWT_SECRET
         value: ${JWT_SECRET}
     http_port: 5000
   ```

4. **Add Environment Variables** in App Settings

5. **Deploy**

### Option 4: AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu Server 22.04 LTS
   - Select instance type (t2.medium or higher)
   - Configure security group (allow ports 22, 80, 443, 5000)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/medai-healthcare-platform.git
   cd medai-healthcare-platform
   npm install
   ```

6. **Create Environment File**
   ```bash
   nano .env
   # Add all environment variables
   ```

7. **Start Application with PM2**
   ```bash
   pm2 start backend/server.js --name medai-backend
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/medai
   ```

   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/medai /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Configure vercel.json**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "env": {
       "VITE_GEMINI_API_KEY": "@gemini-api-key",
       "VITE_GOOGLE_MAPS_API_KEY": "@google-maps-api-key"
     }
   }
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Create netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [build.environment]
     NODE_VERSION = "18"
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 3: Cloudflare Pages

1. **Login to Cloudflare Dashboard**

2. **Create New Project**
   - Connect GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Root directory: `/`

3. **Add Environment Variables**
   - Add all VITE_ prefixed variables

4. **Deploy**

---

## Domain & SSL

### Configure Custom Domain

1. **Add Domain to Hosting Provider**
   - Vercel: Project Settings → Domains
   - Netlify: Site Settings → Domain Management
   - Cloudflare: DNS Settings

2. **Update DNS Records**
   ```
   Type: A
   Name: @
   Value: [Your hosting provider IP]

   Type: CNAME
   Name: www
   Value: [Your hosting provider domain]

   Type: CNAME
   Name: api
   Value: [Your backend hosting domain]
   ```

3. **SSL Certificate**
   - Most hosting providers (Vercel, Netlify, Cloudflare) provide automatic SSL
   - For custom servers, use Let's Encrypt:

   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## Monitoring & Logging

### Application Monitoring

1. **PM2 Monitoring** (if using PM2)
   ```bash
   pm2 monit
   pm2 logs medai-backend
   ```

2. **Setup PM2 Plus** (optional)
   ```bash
   pm2 link [secret-key] [public-key]
   ```

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/node @sentry/react
   ```

   ```javascript
   // backend/server.js
   const Sentry = require("@sentry/node");
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

### Logging

1. **Winston Logger** (already configured)
   - Logs stored in `backend/logs/app.log`
   - Configure log rotation:

   ```javascript
   // backend/utils/logger.js
   const winston = require('winston');
   require('winston-daily-rotate-file');

   const transport = new winston.transports.DailyRotateFile({
     filename: 'logs/app-%DATE%.log',
     datePattern: 'YYYY-MM-DD',
     maxSize: '20m',
     maxFiles: '14d'
   });
   ```

### Health Checks

1. **Create Health Check Endpoint**
   ```javascript
   // backend/server.js
   app.get('/health', (req, res) => {
     res.status(200).json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       uptime: process.uptime(),
       mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
     });
   });
   ```

2. **Setup Uptime Monitoring**
   - Use services like UptimeRobot, Pingdom, or StatusCake
   - Monitor: `https://api.yourdomain.com/health`

---

## Backup Strategy

### Database Backups

1. **MongoDB Atlas Automated Backups**
   - Enable continuous backups in Atlas
   - Configure backup schedule
   - Set retention period

2. **Manual Backup Script**
   ```bash
   #!/bin/bash
   # backup.sh
   
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/backups/mongodb"
   
   mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"
   
   # Compress backup
   tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/backup_$DATE"
   rm -rf "$BACKUP_DIR/backup_$DATE"
   
   # Upload to S3 (optional)
   aws s3 cp "$BACKUP_DIR/backup_$DATE.tar.gz" s3://your-bucket/backups/
   
   # Delete old backups (keep last 30 days)
   find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete
   ```

3. **Schedule Backups with Cron**
   ```bash
   crontab -e
   # Add: 0 2 * * * /path/to/backup.sh
   ```

### File Backups

- Cloudinary automatically handles file redundancy
- Consider periodic exports of Cloudinary assets

---

## Scaling

### Horizontal Scaling

1. **Load Balancer Setup**
   ```nginx
   upstream backend {
       least_conn;
       server backend1.yourdomain.com:5000;
       server backend2.yourdomain.com:5000;
       server backend3.yourdomain.com:5000;
   }

   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://backend;
       }
   }
   ```

2. **Session Management**
   - Use Redis for session storage
   ```bash
   npm install connect-redis redis
   ```

   ```javascript
   const redis = require('redis');
   const RedisStore = require('connect-redis')(session);
   const redisClient = redis.createClient({
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT
   });

   app.use(session({
     store: new RedisStore({ client: redisClient }),
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false
   }));
   ```

### Database Scaling

1. **MongoDB Sharding**
   - Configure in MongoDB Atlas
   - Choose shard key based on access patterns

2. **Read Replicas**
   - Setup read replicas for read-heavy operations
   - Configure in connection string

### Caching

1. **Redis Caching**
   ```javascript
   const redis = require('redis');
   const client = redis.createClient({
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT
   });

   // Cache middleware
   const cache = (duration) => {
     return async (req, res, next) => {
       const key = `cache:${req.originalUrl}`;
       const cached = await client.get(key);
       
       if (cached) {
         return res.json(JSON.parse(cached));
       }
       
       res.originalJson = res.json;
       res.json = (data) => {
         client.setex(key, duration, JSON.stringify(data));
         res.originalJson(data);
       };
       
       next();
     };
   };

   // Use in routes
   app.get('/api/medicines', cache(3600), getMedicines);
   ```

### CDN Configuration

1. **Cloudflare CDN**
   - Add site to Cloudflare
   - Configure caching rules
   - Enable auto-minification

2. **Cache Headers**
   ```javascript
   app.use((req, res, next) => {
     if (req.url.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/)) {
       res.setHeader('Cache-Control', 'public, max-age=31536000');
     }
     next();
   });
   ```

---

## Security Checklist

- [ ] All environment variables secured
- [ ] HTTPS enabled with valid SSL certificate
- [ ] CORS configured with specific origins
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Mongoose)
- [ ] XSS protection enabled
- [ ] CSRF protection implemented
- [ ] Security headers configured (Helmet)
- [ ] Database backups automated
- [ ] Monitoring and alerting setup
- [ ] Error logging configured
- [ ] API keys rotated regularly
- [ ] Access logs enabled
- [ ] Firewall rules configured

---

## Post-Deployment

### Testing

1. **Smoke Tests**
   ```bash
   # Test health endpoint
   curl https://api.yourdomain.com/health
   
   # Test user registration
   curl -X POST https://api.yourdomain.com/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test User","email":"test@example.com","password":"Test123"}'
   ```

2. **Load Testing**
   ```bash
   # Install Apache Bench
   sudo apt-get install apache2-utils
   
   # Run load test
   ab -n 1000 -c 10 https://api.yourdomain.com/health
   ```

### Monitoring Setup

1. **Setup Alerts**
   - CPU usage > 80%
   - Memory usage > 80%
   - Disk usage > 80%
   - Response time > 2s
   - Error rate > 5%

2. **Dashboard**
   - Create monitoring dashboard
   - Track key metrics
   - Set up notifications

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB URI
   - Verify IP whitelist
   - Check network connectivity

2. **CORS Errors**
   - Verify CORS_ORIGIN in environment
   - Check frontend URL configuration

3. **High Memory Usage**
   - Check for memory leaks
   - Optimize database queries
   - Implement caching

4. **Slow Response Times**
   - Add database indexes
   - Implement caching
   - Optimize queries
   - Use CDN for static assets

---

For more information, see the [main documentation](../README.md).
