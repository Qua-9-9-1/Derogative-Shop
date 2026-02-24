# Testing

Complete testing guide for the backend API.

## Overview

The backend uses **Jest** as the testing framework with **Supertest** for HTTP assertions. Tests cover authentication, product management, cart operations, and token management.

## Testing Stack

- **Jest 30.2** - Testing framework
- **Supertest 7.2** - HTTP assertions
- **ts-jest 29.4** - TypeScript support for Jest
- **@types/jest 30.0** - TypeScript definitions

## Test Structure

```
src/
└── tests/
    ├── auth.test.ts       # Authentication endpoints
    ├── products.test.ts   # Product endpoints
    ├── token.test.ts      # Token operations
    └── user.test.ts       # User profile endpoints
```

## Jest Configuration

**File**: `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/app.ts', '!src/**/*.d.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="login"

# Run tests in band (sequential, not parallel)
npm test -- --runInBand
```

## Test Categories

### 1. Integration Tests (API Endpoints)

Test complete request/response cycles including database operations.

#### Authentication Tests

**File**: `src/tests/auth.test.ts`

```typescript
import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  let token: string;

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/auth/register').send({
        email: testEmail,
        password: testPassword,
      });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe(testEmail);
      expect(res.body.passwordHash).toBeUndefined(); // Password should not be returned
      expect(res.body.id).toBeDefined();
    });

    it('should not register with existing email', async () => {
      const res = await request(app).post('/auth/register').send({
        email: testEmail,
        password: testPassword,
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('already in use');
    });

    it('should require email and password', async () => {
      const res = await request(app).post('/auth/register').send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('required');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app).post('/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);

      token = res.body.token;
    });

    it('should not login with wrong password', async () => {
      const res = await request(app).post('/auth/login').send({
        email: testEmail,
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: testPassword,
      });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh a valid token', async () => {
      const res = await request(app).post('/auth/refresh').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.token).not.toBe(token); // New token
    });

    it('should not refresh without token', async () => {
      const res = await request(app).post('/auth/refresh');

      expect(res.status).toBe(401);
    });

    it('should not refresh with invalid token', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout a user', async () => {
      const res = await request(app).post('/auth/logout').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('should not refresh a revoked token', async () => {
      const res = await request(app).post('/auth/refresh').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('revoked');
    });
  });
});
```

#### Product Tests

**File**: `src/tests/products.test.ts`

```typescript
import request from 'supertest';
import app from '../app';

describe('Products API', () => {
  describe('GET /products', () => {
    it('should return list of products', async () => {
      const res = await request(app).get('/products');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        const product = res.body[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
      }
    });
  });

  describe('GET /products/:id', () => {
    it('should return a specific product', async () => {
      // First get all products to get a valid ID
      const allProducts = await request(app).get('/products');
      const productId = allProducts.body[0]?.id;

      if (!productId) {
        console.log('No products in database, skipping test');
        return;
      }

      const res = await request(app).get(`/products/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(productId);
      expect(res.body.name).toBeDefined();
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/products/nonexistent-id');

      expect(res.status).toBe(404);
    });
  });

  describe('GET /products/search', () => {
    it('should search products by query', async () => {
      const res = await request(app).get('/products/search').query({ q: 'test' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
```

### 2. Unit Tests (Services)

Test business logic in isolation with mocked dependencies.

#### Service Test Example

```typescript
import { authService } from '@/services/authService';
import { prisma } from '@/prismaClient';
import bcrypt from 'bcryptjs';

// Mock Prisma
jest.mock('@/prismaClient', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcryptjs');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return null for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.login('test@test.com', 'password');

      expect(result).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should return null for incorrect password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        passwordHash: 'hashed',
      }(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.login('test@test.com', 'wrong');

      expect(result).toBeNull();
    });

    it('should return user and token for correct credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        passwordHash: 'hashed',
      }(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login('test@test.com', 'correct');

      expect(result).not.toBeNull();
      expect(result?.user.email).toBe('test@test.com');
      expect(result?.token).toBeDefined();
      expect(result?.user).not.toHaveProperty('passwordHash');
    });
  });
});
```

### 3. Controller Tests

Test HTTP handling and response formatting.

```typescript
import { Request, Response } from 'express';
import { authController } from '@/controllers/authController';
import { authService } from '@/services/authService';

// Mock the service
jest.mock('@/services/authService');

describe('authController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      body: {},
    };

    mockRes = {
      json: jsonMock,
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 400 if email or password missing', async () => {
      mockReq.body = { email: 'test@test.com' }; // Missing password

      await authController.login(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: expect.stringContaining('required'),
      });
    });

    it('should return 401 for invalid credentials', async () => {
      mockReq.body = { email: 'test@test.com', password: 'wrong' };
      (authService.login as jest.Mock).mockResolvedValue(null);

      await authController.login(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it('should return user and token on success', async () => {
      mockReq.body = { email: 'test@test.com', password: 'correct' };
      const mockResult = { user: { id: '1', email: 'test@test.com' }, token: 'token' };
      (authService.login as jest.Mock).mockResolvedValue(mockResult);

      await authController.login(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });
  });
});
```

## Test Patterns

### Setup and Teardown

```typescript
describe('Test Suite', () => {
  // Runs before all tests in this suite
  beforeAll(async () => {
    // Database setup, connections
  });

  // Runs before each test
  beforeEach(() => {
    // Reset mocks, clear data
    jest.clearAllMocks();
  });

  // Runs after each test
  afterEach(() => {
    // Cleanup
  });

  // Runs after all tests in this suite
  afterAll(async () => {
    // Close connections, cleanup
    await prisma.$disconnect();
  });
});
```

### Mocking

```typescript
// Mock entire module
jest.mock('@/services/authService');

// Mock specific function
jest
  .spyOn(authService, 'login')
  .mockResolvedValue(mockData)
  (
    // Mock implementation
    authService.login as jest.Mock
  )
  .mockImplementation(async (email, password) => {
    if (email === 'test@test.com') {
      return { user: mockUser, token: 'token' };
    }
    return null;
  });

// Mock rejected promise (errors)
jest.spyOn(prisma.user, 'create').mockRejectedValue(new Error('Database error'));
```

### Async Testing

```typescript
// Using async/await
it('should handle async operations', async () => {
  const result = await authService.login('email', 'pass');
  expect(result).toBeDefined();
});

// Using .resolves
it('should resolve promise', () => {
  return expect(authService.login('email', 'pass')).resolves.toBeDefined();
});

// Using .rejects
it('should reject promise', () => {
  return expect(service.invalidOperation()).rejects.toThrow('Error');
});
```

## Coverage Reports

### Generate Coverage

```bash
npm run test:coverage
```

This creates:

- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format
- `coverage/clover.xml` - Clover format
- `coverage/coverage-final.json` - JSON format

### View Coverage

```bash
# Open HTML report
open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

### Coverage Thresholds

Configured in `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 20,
    functions: 20,
    lines: 20,
    statements: 20,
  },
}
```

## Best Practices

### 1. Test Names

```typescript
// ✅ Good - Describes what it tests
it('should return 401 for invalid credentials', () => {});

// ❌ Bad - Vague
it('test login', () => {});
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should add item to cart', async () => {
  // Arrange - Setup test data
  const userId = 'user-1';
  const productId = 'prod-1';
  const quantity = 2;

  // Act - Execute the code being tested
  const result = await cartService.addItem(userId, productId, quantity);

  // Assert - Verify the outcome
  expect(result.items).toHaveLength(1);
  expect(result.items[0].quantity).toBe(2);
});
```

### 3. One Assertion per Test (When Possible)

```typescript
// ✅ Good - Clear and focused
it('should return 201 status code', async () => {
  const res = await request(app).post('/auth/register').send(data);
  expect(res.status).toBe(201);
});

it('should return user data', async () => {
  const res = await request(app).post('/auth/register').send(data);
  expect(res.body.email).toBe(data.email);
});

// ✅ Also acceptable - Related assertions
it('should register user successfully', async () => {
  const res = await request(app).post('/auth/register').send(data);
  expect(res.status).toBe(201);
  expect(res.body.email).toBe(data.email);
  expect(res.body.id).toBeDefined();
});
```

### 4. Test Edge Cases

```typescript
describe('updateCartItem', () => {
  it('should update quantity for valid item', async () => {
    /* ... */
  });

  it('should return 404 for non-existent item', async () => {
    /* ... */
  });

  it('should return 400 for invalid quantity', async () => {
    /* ... */
  });

  it('should return 400 for quantity zero', async () => {
    /* ... */
  });

  it('should return 400 for negative quantity', async () => {
    /* ... */
  });
});
```

### 5. Isolate Tests

```typescript
// ✅ Good - Each test is independent
it('test 1', async () => {
  const user = await createTestUser()
  // Test with this user
  await deleteTestUser(user.id)
})

it('test 2', async () => {
  const user = await createTestUser() // Fresh user
  // Test with this user
  await deleteTestUser(user.id)
})

// ❌ Bad - Tests depend on each other
let sharedUser
it('create user', () => { sharedUser = ... })
it('update user', () => { /* uses sharedUser */ })
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Backend Tests

on: [push, pull_request]

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

      - name: Run migrations
        run: npx prisma migrate deploy
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Run tests
        run: npm test
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          JWT_SECRET: test-secret-key

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./backend/coverage
```

## Debugging Tests

### Run Single Test

```bash
npm test -- --testNamePattern="should login with correct credentials"
```

### Verbose Output

```bash
npm test -- --verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/backend/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "cwd": "${workspaceFolder}/backend"
}
```

---

**Next**: [API Documentation](./API.md) | [Database Guide](./DATABASE.md)
