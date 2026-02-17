# Backend Documentation

Professional documentation for the Derogative Shop backend API.

## Overview

REST API built with Express.js and TypeScript, using Prisma ORM for database management and JWT for authentication. The backend provides endpoints for user authentication, product management, shopping cart, and invoice generation.

## Technology Stack

### Core Framework
- **Express.js 5.2** - Fast, minimalist web framework
- **TypeScript 5.x** - Type-safe JavaScript
- **Node.js 18+** - JavaScript runtime environment

### Database
- **PostgreSQL** - Relational database
- **Prisma 6.19** - Modern ORM with type safety
- **Supabase** - PostgreSQL hosting (production)

### Authentication & Security
- **JWT (jsonwebtoken 9.0)** - Token-based authentication
- **bcryptjs 3.0** - Password hashing
- **Helmet 8.1** - Security headers
- **CORS 2.8** - Cross-origin resource sharing

### Validation & Data
- **Zod 4.3** - Schema validation
- **Axios 1.13** - HTTP client (for external APIs)

### Development Tools
- **Nodemon 3.1** - Auto-restart on changes
- **Jest 30.2** - Testing framework
- **Supertest 7.2** - HTTP assertions
- **ESLint 9.39** - Code linting
- **Prettier 3.8** - Code formatting
- **ts-jest 29.4** - TypeScript Jest support

### Deployment
- **Docker** - Containerization
- **Render** - Cloud hosting platform

## Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── prismaClient.ts        # Prisma client instance
│   ├── controllers/           # Request handlers
│   │   ├── authController.ts
│   │   ├── cartController.ts
│   │   ├── productController.ts
│   │   ├── tokenController.ts
│   │   └── userController.ts
│   ├── services/              # Business logic
│   │   ├── authService.ts
│   │   ├── cartService.ts
│   │   ├── productService.ts
│   │   ├── tokenService.ts
│   │   └── userService.ts
│   ├── routes/                # API routes
│   │   ├── authRoutes.ts
│   │   ├── cartRoutes.ts
│   │   ├── productRoutes.ts
│   │   └── userRoutes.ts
│   └── tests/                 # Test files
│       ├── auth.test.ts
│       ├── products.test.ts
│       ├── token.test.ts
│       └── user.test.ts
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding
│   └── migrations/            # Database migrations
├── coverage/                   # Test coverage reports
├── dist/                       # Compiled JavaScript
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose setup
├── jest.config.js              # Jest configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14+ (or use Supabase)
- Docker (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run Prisma migrations
npx prisma migrate dev

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`.

### Using Docker

```bash
# From the root directory of the project
docker-compose up --build
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run seed` | Seed database with sample data |

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user (revoke token)
- `POST /auth/refresh` - Refresh JWT token

### Users
- `GET /user/profile` - Get user profile (protected)
- `PUT /user/profile` - Update user profile (protected)

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/search` - Search products

### Cart
- `GET /cart` - Get user's cart (protected)
- `POST /cart/items` - Add item to cart (protected)
- `PUT /cart/items/:id` - Update cart item (protected)
- `DELETE /cart/items/:id` - Remove item from cart (protected)
- `DELETE /cart` - Clear entire cart (protected)

See [API Documentation](./API.md) for detailed endpoint specifications.

## Documentation

- **[Architecture](./ARCHITECTURE.md)** - Application architecture and design patterns
- **[Getting Started](./GETTING_STARTED.md)** - Detailed setup and configuration guide
- **[Testing](./TESTING.md)** - Testing strategy and examples
- **[API Reference](./API.md)** - Complete API endpoint documentation
- **[Database](./DATABASE.md)** - Prisma schema and database management
- **[Deployment](./DEPLOYMENT.md)** - Deployment guides for production

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/derogative_shop"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server
PORT=3000
NODE_ENV=development
```

See [Getting Started](./GETTING_STARTED.md#environment-configuration) for detailed configuration.

## Database Schema

The application uses the following main models:
- **User** - User accounts with authentication
- **Product** - Product catalog
- **CartItem** - Shopping cart items
- **Invoice** - Order history
- **InvoiceItem** - Order line items
- **RevokedToken** - Token blacklist for logout

See [Database Documentation](./DATABASE.md) for complete schema details.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

Current coverage thresholds: **20%** for branches, functions, lines, and statements.

See [Testing Documentation](./TESTING.md) for detailed testing strategies.

## Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Pre-commit Hooks
The project uses Prettier for consistent code formatting. All code is automatically formatted before commits.

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Token Revocation** - Logout invalidates tokens
- **CORS Protection** - Configured for frontend origin
- **Helmet Security Headers** - XSS, clickjacking protection
- **Input Validation** - Zod schemas for all requests
- **SQL Injection Protection** - Prisma parameterized queries

## Performance Considerations

- **Database Connection Pooling** - Prisma connection management
- **Indexed Queries** - Optimized database indexes
- **Async Operations** - Non-blocking I/O throughout
- **Efficient Queries** - Prisma select and include optimization

## Deployment

The backend is deployed on **Render** using Docker containers.

Production URL: `https://derogative-shop-api.onrender.com` (example)

See [Deployment Documentation](./DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Follow the existing code structure (MVC pattern)
2. Write tests for new features
3. Maintain test coverage above 20%
4. Use TypeScript types for all code
5. Format code with Prettier before committing
6. Follow REST API conventions

## License

MIT License

## Support

For issues and questions, please open an issue on the repository.

---

**Next Steps**: 
- Read [Architecture Guide](./ARCHITECTURE.md) to understand the codebase structure
- Follow [Getting Started](./GETTING_STARTED.md) for detailed setup instructions
- Review [API Documentation](./API.md) for endpoint details
