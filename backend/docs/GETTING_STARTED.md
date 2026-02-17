# Getting Started

Complete guide to setting up and running the backend locally.

## Prerequisites

### Required Software

- **Node.js**: Version 18.x or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **npm**: Version 9.x or higher (comes with Node.js)
  - Verify: `npm --version`

- **PostgreSQL**: Version 14 or higher
  - Download from [postgresql.org](https://www.postgresql.org/download/)
  - Or use [Supabase](https://supabase.com/) for cloud-hosted PostgreSQL
  - Verify: `psql --version`

### Optional Software

- **Docker**: For containerized development
  - Download from [docker.com](https://www.docker.com/)

- **pgAdmin** or **DBeaver**: Database GUI tools
  - [pgAdmin](https://www.pgadmin.org/)
  - [DBeaver](https://dbeaver.io/)

- **Postman** or **Insomnia**: API testing
  - [Postman](https://www.postman.com/)
  - [Insomnia](https://insomnia.rest/)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Derogative-shop/backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`:
- Express, Prisma, JWT, bcrypt, etc.
- Development tools (TypeScript, Jest, ESLint, Prettier)

### 3. Database Setup

#### Option A: Local PostgreSQL

**Create a database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE derogative_shop;

# Create user (optional)
CREATE USER derogative_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE derogative_shop TO derogative_user;

# Exit
\q
```

#### Option B: Supabase (Cloud)

1. Create account at [supabase.com](https://supabase.com/)
2. Create new project
3. Copy the connection string from Project Settings → Database
4. Use the connection string in your `.env` file

### 4. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/derogative_shop"

# For Supabase:
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: CORS Configuration
FRONTEND_URL="http://localhost:8081"
```

**Important**: 
- Never commit `.env` files to version control
- Use strong, random JWT_SECRET in production
- Keep DATABASE_URL credentials secure

### 5. Run Prisma Migrations

Apply database migrations to create tables:

```bash
npx prisma migrate dev
```

This will:
- Create tables based on `prisma/schema.prisma`
- Generate Prisma Client with TypeScript types
- Apply all migrations from `prisma/migrations/`

### 6. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This runs `prisma/seed.ts` which creates:
- Sample products
- Test users
- Demo cart items

### 7. Start Development Server

```bash
npm run dev
```

The API will be available at: **http://localhost:3000**

You should see:
```
Server is running on port 3000
```

## Available Scripts

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run dev` | Start development server with hot-reload | Daily development |
| `npm run build` | Compile TypeScript to JavaScript | Before deployment |
| `npm start` | Start production server (requires build) | Production only |
| `npm test` | Run all tests once | Before commits |
| `npm run test:coverage` | Run tests with coverage report | Checking test quality |
| `npm run lint` | Lint code with ESLint | Before commits |
| `npm run format` | Format code with Prettier | Before commits |
| `npm run seed` | Seed database with sample data | Initial setup, testing |
| `npx prisma studio` | Open Prisma Studio (DB GUI) | Database inspection |
| `npx prisma migrate dev` | Create and apply new migration | After schema changes |
| `npx prisma generate` | Generate Prisma Client | After schema changes |

## Development Workflow

### Daily Development

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Make changes** to TypeScript files

3. **Nodemon automatically restarts** the server

4. **Test your changes** using:
   - Postman/Insomnia for API testing
   - Unit tests: `npm test`
   - Frontend application

### After Modifying Prisma Schema

1. **Edit** `prisma/schema.prisma`

2. **Create migration:**
   ```bash
   npx prisma migrate dev --name describe_your_change
   ```

3. **Prisma Client is auto-generated** with new types

4. **Update services** to use new schema changes

### Before Committing

```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm test

# Check coverage
npm run test:coverage
```

## Database Management

### Prisma Studio

Visual database browser:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

Features:
- View all tables and data
- Add, edit, delete records
- Filter and search
- Inspect relations

### Common Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name add_user_role

# Apply pending migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Format schema file
npx prisma format
```

### Database Backups

**Export database:**
```bash
pg_dump -U postgres derogative_shop > backup.sql
```

**Restore database:**
```bash
psql -U postgres derogative_shop < backup.sql
```

## Testing the API

### Using cURL

```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get products
curl http://localhost:3000/products
```

### Using JavaScript (fetch)

```javascript
// Login
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
const { token, user } = await response.json()

// Get user profile (protected)
const profile = await fetch('http://localhost:3000/user/profile', {
  headers: { 
    'Authorization': `Bearer ${token}` 
  }
})
```

## Docker Setup

### Using Docker Compose (Recommended)

From the **root directory** of the project:

```bash
docker-compose up --build
```

This will:
- Build the backend Docker image
- Start PostgreSQL container
- Start backend container
- Expose API on port 3000

### Docker Commands

```bash
# Start containers
docker-compose up

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild after changes
docker-compose up --build

# Run migrations in container
docker-compose exec backend npx prisma migrate deploy
```

### Docker Only (without Docker Compose)

```bash
# Build image
docker build -t derogative-backend .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  derogative-backend
```

## IDE Configuration

### VS Code (Recommended)

**Recommended Extensions:**

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

**Settings (.vscode/settings.json):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

### Debugging in VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["src/app.ts"],
      "env": {
        "NODE_ENV": "development"
      },
      "sourceMaps": true,
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

## Troubleshooting

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Kill the process
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

### Database Connection Failed

**Problem**: `Can't reach database server at localhost:5432`

**Solutions**:
1. Check PostgreSQL is running:
   ```bash
   # Windows (services)
   services.msc
   
   # Linux/Mac
   sudo service postgresql status
   ```

2. Verify DATABASE_URL in `.env`

3. Check firewall settings

4. Test connection:
   ```bash
   psql -U postgres -h localhost
   ```

### Prisma Client Not Generated

**Problem**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npx prisma generate
```

### Migration Failed

**Problem**: Migration errors during `prisma migrate dev`

**Solutions**:
1. Check database connection
2. Ensure no syntax errors in `schema.prisma`
3. If in development, reset database:
   ```bash
   npx prisma migrate reset
   ```

### TypeScript Errors

**Problem**: Import path errors like `Cannot find module '@/services/...'`

**Solution**:
1. Check `tsconfig.json` has path mapping:
   ```json
   {
     "compilerOptions": {
       "paths": { "@/*": ["./src/*"] }
     }
   }
   ```

2. Restart TypeScript server in VS Code:
   - Press `Ctrl+Shift+P`
   - Type "TypeScript: Restart TS Server"

### npm Install Errors

**Problem**: Errors during `npm install`

**Solutions**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Use Node.js 18 LTS

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-min-32-chars` | ✅ Yes |
| `PORT` | Server port | `3000` | No (default: 3000) |
| `NODE_ENV` | Environment mode | `development` / `production` | No (default: development) |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:8081` | No |

## Next Steps

Now that your backend is running:

1. **Explore the API** - Read [API Documentation](./API.md)
2. **Understand the architecture** - Read [Architecture Guide](./ARCHITECTURE.md)
3. **Write tests** - Read [Testing Guide](./TESTING.md)
4. **Learn about the database** - Read [Database Documentation](./DATABASE.md)
5. **Deploy to production** - Read [Deployment Guide](./DEPLOYMENT.md)

## Additional Resources

- **Prisma Documentation**: https://www.prisma.io/docs
- **Express Documentation**: https://expressjs.com/
- **JWT Guide**: https://jwt.io/introduction
- **PostgreSQL Tutorial**: https://www.postgresql.org/docs/

---

**Having issues?** Check the [Troubleshooting](#troubleshooting) section or open an issue on the repository.
