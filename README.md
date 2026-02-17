# Derogative Shop

E-commerce mobile application with product scanning and shopping cart functionality.

## Project Structure

```
Derogative-shop/
├── frontend/          # React Native mobile app (Expo)
├── backend/           # Express.js REST API
└── docker-compose.yml # Docker orchestration
```

## Quick Start

### Using Docker (Recommended)

From the root directory:

```bash
docker-compose up --build
```

This starts:
- Backend API on `http://localhost:3000`
- PostgreSQL database

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Or run directly on a device:

```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web browser
```

### Backend

```bash
cd backend
npm install
npm run dev
```

API available at `http://localhost:3000`

## Technology Stack

### Frontend
- **React Native + Expo** ~54.0 - Cross-platform mobile framework
- **Expo Router** 6.0 - File-based navigation
- **Zustand** 5.0 - State management
- **React Native Paper** 5.14 - UI components
- **Axios** 1.13 - HTTP client
- **Expo Camera** 17.0 - Barcode scanning
- **React Hook Form + Zod** - Form handling & validation
- **Jest** 29.7 - Testing framework
- **Expo Secure Store** - Encrypted storage

### Backend
- **Express.js** 5.2 - Web framework
- **Prisma** 6.19 - ORM with PostgreSQL
- **JWT** (jsonwebtoken 9.0) - Authentication
- **bcryptjs** 3.0 - Password hashing
- **Zod** 4.3 - Schema validation
- **Jest + Supertest** - Testing
- **Helmet** + **CORS** - Security
- **Render** - Hosting platform

## Documentation

### 📱 Frontend Documentation
Complete mobile app documentation including architecture, components, state management, and testing.

**[→ Read Frontend Documentation](./frontend/docs/README.md)**

- [Architecture Guide](./frontend/docs/ARCHITECTURE.md)
- [Getting Started](./frontend/docs/GETTING_STARTED.md)
- [Testing Guide](./frontend/docs/TESTING.md)
- [API Integration](./frontend/docs/API.md)
- [Components Catalog](./frontend/docs/COMPONENTS.md)
- [State Management](./frontend/docs/STATE_MANAGEMENT.md)

### 🔧 Backend Documentation
Complete API documentation including endpoints, database schema, deployment, and testing.

**[→ Read Backend Documentation](./backend/docs/README.md)**

- [Architecture Guide](./backend/docs/ARCHITECTURE.md)
- [Getting Started](./backend/docs/GETTING_STARTED.md)
- [Testing Guide](./backend/docs/TESTING.md)
- [API Reference](./backend/docs/API.md)
- [Database Schema](./backend/docs/DATABASE.md)
- [Deployment Guide](./backend/docs/DEPLOYMENT.md)

## Features

- 📱 Cross-platform mobile app (iOS, Android, Web)
- 📷 Barcode scanning for product lookup
- 🛒 Shopping cart management
- 👤 User authentication with JWT
- 🔐 Secure password hashing
- 💾 Persistent cart storage
- 🎨 Material Design UI
- 🧪 Comprehensive test coverage
- 🐳 Docker containerization
- 🚀 Production-ready deployment

## Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start Expo development server
npm test            # Run tests
npm run lint        # Lint code
npm run format      # Format code with Prettier
```

### Backend Development
```bash
cd backend
npm run dev         # Start development server with hot-reload
npm test           # Run tests
npm run test:coverage  # Run tests with coverage
npm run lint       # Lint code
npm run format     # Format code with Prettier
npx prisma studio  # Open database GUI
```

## Environment Variables

### Frontend (.env in `frontend/`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Backend (.env in `backend/`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/derogative_shop"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
NODE_ENV=development
```

## Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Maintain test coverage thresholds
4. Use TypeScript for all code
5. Format code with Prettier before committing
6. Follow REST API conventions

## License

MIT License

## Support

For detailed setup instructions, troubleshooting, and API documentation, please refer to the documentation links above.