# Deployment Guide

Complete guide for deploying the backend to production.

## Deployment Options

1. **Render** (Recommended) - PaaS with Docker support
2. **Docker** - Containerized deployment anywhere
3. **Traditional VPS** - Direct Node.js deployment

## Render Deployment

### Overview

[Render](https://render.com) provides easy deployment with:

- Automatic HTTPS
- Auto-deploy from GitHub
- Built-in PostgreSQL hosting
- Docker support
- Free tier available

### Prerequisites

- Render account (sign up at [render.com](https://render.com))
- GitHub repository with your code
- PostgreSQL database (Render provides this)

### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name**: `derogative-shop-db`
   - **Database**: `derogative_shop`
   - **User**: Auto-generated
   - **Region**: Choose closest to users
   - **Plan**: Free or Starter
4. Click **Create Database**
5. **Save the Internal Database URL** (format: `postgresql://user:pass@host/db`)

### Step 2: Create Web Service

1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:

**Basic Settings:**

- **Name**: `derogative-shop-api`
- **Region**: Same as database
- **Branch**: `main` or `master`
- **Root Directory**: `backend` (if monorepo)
- **Environment**: `Docker`
- **Plan**: Free or Starter

**Docker Settings:**

- **Dockerfile Path**: `./backend/Dockerfile` (or `./Dockerfile` if in backend root)

**Build Command** (if not using Docker):

```bash
npm install && npx prisma generate && npm run build
```

**Start Command** (if not using Docker):

```bash
npx prisma migrate deploy && npm start
```

### Step 3: Environment Variables

Add these environment variables in Render:

```env
DATABASE_URL=<your-internal-database-url-from-step-1>
JWT_SECRET=<generate-strong-random-string-32-chars>
NODE_ENV=production
PORT=3000
FRONTEND_URL=<your-frontend-url>
```

**Generate JWT_SECRET:**

```bash
# On Linux/Mac
openssl rand -base64 32

# OR using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Deploy

1. Click **Create Web Service**
2. Render will:
   - Clone your repository
   - Build Docker image
   - Run migrations
   - Start the server
3. Monitor deploy logs
4. Service will be available at: `https://your-service-name.onrender.com`

### Step 5: Run Migrations

Migrations should run automatically via `CMD` in Dockerfile or start command.

**Manual migration (if needed):**

```bash
# In Render Shell
npx prisma migrate deploy
```

### Step 6: Seed Database (Optional)

```bash
# In Render Shell
npm run seed
```

### Auto-Deploy

Render auto-deploys on every push to your connected branch:

1. Push to GitHub
2. Render detects changes
3. Automatically builds and deploys
4. Zero-downtime deployment

## Docker Deployment

### Building the Image

**Dockerfile** (`backend/Dockerfile`):

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
```

**Build image:**

```bash
cd backend
docker build -t derogative-shop-backend .
```

### Running with Docker Compose

**File**: `docker-compose.yml` (root directory)

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: derogative_shop
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  api:
    build: ./backend
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/derogative_shop
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      PORT: 3000
    depends_on:
      postgres:
        condition: service_healthy
    restart: always
    command: sh -c "npx prisma migrate deploy && npm start"

volumes:
  postgres_data:
```

**Create `.env` file:**

```env
JWT_SECRET=your-super-secret-jwt-key-change-this
```

**Start services:**

```bash
docker-compose up -d
```

**View logs:**

```bash
docker-compose logs -f api
```

**Stop services:**

```bash
docker-compose down
```

**Rebuild after changes:**

```bash
docker-compose up -d --build
```

### Docker Hub Deployment

**1. Tag image:**

```bash
docker tag derogative-shop-backend yourusername/derogative-shop-backend:v1.0.0
```

**2. Push to Docker Hub:**

```bash
docker login
docker push yourusername/derogative-shop-backend:v1.0.0
```

**3. Pull on production server:**

```bash
docker pull yourusername/derogative-shop-backend:v1.0.0
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  yourusername/derogative-shop-backend:v1.0.0
```

## Traditional VPS Deployment

### Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- PostgreSQL 14+ installed
- Nginx (for reverse proxy)
- PM2 (for process management)

### Step 1: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE derogative_shop;
CREATE USER derogative_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE derogative_shop TO derogative_user;
\q
```

### Step 3: Deploy Application

```bash
# Create app directory
sudo mkdir -p /var/www/derogative-shop
sudo chown $USER:$USER /var/www/derogative-shop

# Clone repository
cd /var/www/derogative-shop
git clone <your-repo-url> .
cd backend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Contents of `.env`:**

```env
DATABASE_URL="postgresql://derogative_user:your_strong_password@localhost:5432/derogative_shop"
JWT_SECRET="generate-strong-random-secret-key"
NODE_ENV=production
PORT=3000
```

```bash
# Run migrations
npx prisma migrate deploy

# Build application
npm run build

# Seed database (optional)
npm run seed
```

### Step 4: Setup PM2

```bash
# Start application with PM2
pm2 start dist/app.js --name derogative-shop-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instruction from the command output
```

**PM2 Commands:**

```bash
# View status
pm2 status

# View logs
pm2 logs derogative-shop-api

# Restart
pm2 restart derogative-shop-api

# Stop
pm2 stop derogative-shop-api

# Monitor
pm2 monit
```

### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/derogative-shop
```

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**

```bash
sudo ln -s /etc/nginx/sites-available/derogative-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

### Step 7: Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Environment Variables

### Required Variables

| Variable       | Description                        | Example                               |
| -------------- | ---------------------------------- | ------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string       | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`   | Secret for JWT signing (32+ chars) | `your-random-secret-key`              |
| `NODE_ENV`     | Environment mode                   | `production`                          |
| `PORT`         | Server port                        | `3000`                                |

### Optional Variables

| Variable       | Description           | Example               |
| -------------- | --------------------- | --------------------- |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourapp.com` |

### Generating Secure Secrets

```bash
# Generate 32-character secret
openssl rand -base64 32

# Generate 64-character secret
openssl rand -base64 48

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Health Checks

### Basic Health Endpoint

Add to your Express app:

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

### Database Health Check

```typescript
app.get('/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});
```

## Monitoring

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Logs
pm2 logs derogative-shop-api

# Memory/CPU usage
pm2 describe derogative-shop-api
```

### Application Logs

```typescript
// Use proper logging library
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
```

## CI/CD with GitHub Actions

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci
        working-directory: ./backend

      - name: Run linter
        run: npm run lint
        working-directory: ./backend

      - name: Run tests
        run: npm test
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          JWT_SECRET: test-secret

      - name: Build
        run: npm run build
        working-directory: ./backend

  # Render auto-deploys on push, so no deploy step needed
  # But you can trigger manual deployments via Render API if needed
```

## Troubleshooting

### Issue: "Port already in use"

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Issue: "Cannot connect to database"

**Check connection:**

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d derogative_shop
```

**Verify DATABASE_URL format:**

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
```

### Issue: "Prisma Client not generated"

```bash
npx prisma generate
```

### Issue: "Module not found"

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Permission denied"

```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/derogative-shop
```

## Rollback Strategy

### Render

Render keeps deployment history:

1. Go to your service
2. Click **Deploys** tab
3. Select previous successful deploy
4. Click **Rollback**

### Docker

```bash
# Keep previous version tagged
docker tag derogative-shop-backend:latest derogative-shop-backend:backup

# Rollback
docker stop derogative-shop-api
docker run -d --name derogative-shop-api derogative-shop-backend:backup
```

### VPS with Git

```bash
# Revert to previous commit
git log --oneline
git checkout <previous-commit-hash>
npm install
npm run build
pm2 restart derogative-shop-api
```

## Security Checklist

- [ ] Use HTTPS (SSL/TLS certificate)
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Use strong database password
- [ ] Enable firewall (UFW, AWS Security Groups, etc.)
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Use environment variables for secrets (never commit)
- [ ] Enable CORS for specific origins only
- [ ] Use Helmet for security headers
- [ ] Implement rate limiting (future)
- [ ] Regular database backups
- [ ] Monitor logs for suspicious activity
- [ ] Use read-only database user where possible

## Backup Strategy

### Database Backups

**Automated backups (cron job):**

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * pg_dump -U derogative_user derogative_shop > /backups/db_$(date +\%Y\%m\%d).sql

# Keep only last 7 days
0 3 * * * find /backups -name "db_*.sql" -mtime +7 -delete
```

**Manual backup:**

```bash
pg_dump -U derogative_user derogative_shop > backup_$(date +%Y%m%d).sql
```

### Application Backups

```bash
# Backup application files
tar -czf /backups/app_$(date +%Y%m%d).tar.gz /var/www/derogative-shop
```

## Performance Optimization

### PM2 Cluster Mode

```bash
# Start with all CPU cores
pm2 start dist/app.js -i max --name derogative-shop-api

# Or specify number of instances
pm2 start dist/app.js -i 4 --name derogative-shop-api
```

### Nginx Caching

Add to Nginx config:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m;

location / {
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;
    proxy_pass http://localhost:3000;
}
```

---

**Production URL**: `https://your-service.onrender.com`

**Related**: [Getting Started](./GETTING_STARTED.md) | [Architecture](./ARCHITECTURE.md) | [API Docs](./API.md)
