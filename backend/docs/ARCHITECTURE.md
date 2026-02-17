# Architecture

Complete guide to the backend architecture and design patterns.

## Overview

The backend follows a **layered MVC architecture** with clear separation of concerns. Each layer has a specific responsibility, making the codebase maintainable, testable, and scalable.

## Architectural Layers

```
┌─────────────────────────────────────────┐
│          HTTP Client (Frontend)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Routes (Express Router)         │
│  - Define endpoints                     │
│  - Map HTTP methods to controllers      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Controllers Layer             │
│  - Handle HTTP requests/responses       │
│  - Input validation                     │
│  - Error handling                       │
│  - Call services                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│            Services Layer               │
│  - Business logic                       │
│  - Data transformation                  │
│  - Call Prisma models                   │
│  - Orchestrate operations               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Data Access Layer              │
│  - Prisma ORM                           │
│  - Database queries                     │
│  - Data models                          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         PostgreSQL Database             │
└─────────────────────────────────────────┘
```

## Folder Structure

### `/src/routes`

**Purpose**: Define API endpoints and HTTP routing.

```typescript
// authRoutes.ts
import { Router } from 'express'
import { authController } from '@/controllers/authController'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/refresh', authController.refresh)

export default router
```

**Responsibilities**:
- Map HTTP methods (GET, POST, PUT, DELETE) to controller functions
- Group related endpoints
- Apply middleware (authentication, validation)

### `/src/controllers`

**Purpose**: Handle HTTP request/response cycle.

```typescript
// authController.ts
export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      
      // Validate input
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password required' })
        return
      }
      
      // Call service
      const result = await authService.login(email, password)
      
      if (!result) {
        res.status(401).json({ message: 'Incorrect credentials' })
        return
      }
      
      // Send response
      res.json(result)
    } catch (error) {
      res.status(500).json({ 
        message: 'Server error', 
        error: (error as Error).message 
      })
    }
  }
}
```

**Responsibilities**:
- Extract data from `req.body`, `req.params`, `req.query`
- Validate input data
- Call appropriate service methods
- Format and send HTTP responses
- Handle errors with appropriate status codes

### `/src/services`

**Purpose**: Implement business logic.

```typescript
// authService.ts
export const authService = {
  async login(email: string, password: string) {
    // Database query
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null
    
    // Business logic
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) return null
    
    // Generate token
    const token = tokenService.generateToken({ 
      userId: user.id, 
      email: user.email 
    })
    
    // Return transformed data
    const { passwordHash, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
  }
}
```

**Responsibilities**:
- Implement business rules and logic
- Interact with database through Prisma
- Transform data between layers
- Coordinate multiple operations
- Reusable across different controllers

### `/src/prismaClient.ts`

**Purpose**: Singleton Prisma client instance.

```typescript
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

**Responsibilities**:
- Manage database connection
- Provide type-safe database access
- Handle connection pooling

### `/prisma/schema.prisma`

**Purpose**: Define database schema and relations.

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  firstName    String?
  lastName     String?
  
  cartItems    CartItem[]
  invoices     Invoice[]
}
```

**Responsibilities**:
- Define data models
- Specify relationships
- Configure indexes and constraints
- Generate TypeScript types

## Design Patterns

### 1. MVC (Model-View-Controller)

**Adapted for API**: Since there's no View layer in a REST API, we use:
- **Controller**: Handle HTTP
- **Service (Model)**: Business logic
- **Prisma (Model)**: Data access

### 2. Service Layer Pattern

Services encapsulate business logic and can be reused across multiple controllers.

```typescript
// authService can be used by authController and userController
export const authService = {
  async login(email: string, password: string) { ... },
  async revokeToken(token: string) { ... }
}
```

### 3. Repository Pattern (via Prisma)

Prisma acts as a repository, abstracting database operations:

```typescript
// Instead of raw SQL:
// SELECT * FROM users WHERE email = ?

// We use Prisma:
await prisma.user.findUnique({ where: { email } })
```

### 4. Dependency Injection

Services are injected into controllers:

```typescript
import { authService } from '@/services/authService'

export const authController = {
  login: async (req, res) => {
    const result = await authService.login(email, password)
  }
}
```

### 5. Middleware Pattern

Express middleware for cross-cutting concerns:

```typescript
// Authentication middleware
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  
  try {
    const payload = tokenService.verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// Apply to routes
router.get('/profile', authenticate, userController.getProfile)
```

## Data Flow Examples

### User Login Flow

```
1. Client → POST /auth/login
           ↓
2. authRoutes → authController.login
           ↓
3. authController extracts email, password from req.body
           ↓
4. authService.login(email, password)
           ↓
5. prisma.user.findUnique({ where: { email } })
           ↓
6. bcrypt.compare(password, user.passwordHash)
           ↓
7. tokenService.generateToken({ userId, email })
           ↓
8. Return { user, token }
           ↓
9. authController sends JSON response
           ↓
10. Client receives { user, token }
```

### Get User Profile (Protected)

```
1. Client → GET /user/profile (with Authorization header)
           ↓
2. userRoutes → authenticate middleware
           ↓
3. Middleware verifies JWT token
           ↓
4. Middleware adds user info to req.user
           ↓
5. userController.getProfile
           ↓
6. userService.getUserById(req.user.userId)
           ↓
7. prisma.user.findUnique({ where: { id } })
           ↓
8. Return user data
           ↓
9. Controller sends JSON response
           ↓
10. Client receives user profile
```

### Add Item to Cart

```
1. Client → POST /cart/items { productId, quantity }
           ↓
2. cartRoutes → authenticate middleware
           ↓
3. cartController.addItem
           ↓
4. cartService.addItem(userId, productId, quantity)
           ↓
5. Check if product exists
   prisma.product.findUnique({ where: { id: productId } })
           ↓
6. Check if item already in cart
   prisma.cartItem.findFirst({ where: { userId, productId } })
           ↓
7a. If exists: Update quantity
    prisma.cartItem.update({ where: { id }, data: { quantity } })
           ↓
7b. If not: Create new item
    prisma.cartItem.create({ data: { userId, productId, quantity } })
           ↓
8. Fetch updated cart with items and products
   prisma.cartItem.findMany({ where: { userId }, include: { product: true } })
           ↓
9. Return cart data
           ↓
10. Client receives updated cart
```

## Error Handling

### Error Hierarchy

```typescript
// Base error types
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message)
  }
}

class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`)
  }
}

class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message)
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message)
  }
}
```

### Error Handling in Controllers

```typescript
export const productController = {
  getById: async (req: Request, res: Response) => {
    try {
      const product = await productService.getById(req.params.id)
      
      if (!product) {
        res.status(404).json({ message: 'Product not found' })
        return
      }
      
      res.json(product)
    } catch (error) {
      console.error('Error fetching product:', error)
      res.status(500).json({ 
        message: 'Server error', 
        error: (error as Error).message 
      })
    }
  }
}
```

### Prisma Error Handling

```typescript
import { Prisma } from '@prisma/client'

try {
  await prisma.user.create({ data: { email, passwordHash } })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new ValidationError('Email already exists')
    }
  }
  throw error
}
```

## Authentication & Authorization

### JWT Token Flow

```typescript
// 1. Generate token on login
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
)

// 2. Client stores token (e.g., in secure storage)

// 3. Client sends token with each request
Authorization: Bearer <token>

// 4. Server verifies token
const payload = jwt.verify(token, process.env.JWT_SECRET!)

// 5. Check if token is revoked (logout)
const isRevoked = await prisma.revokedToken.findUnique({ 
  where: { token } 
})
```

### Token Revocation (Logout)

```typescript
export const tokenService = {
  async revokeToken(token: string) {
    await prisma.revokedToken.create({
      data: { token }
    })
  },
  
  async isTokenRevoked(token: string): Promise<boolean> {
    const revoked = await prisma.revokedToken.findUnique({
      where: { token }
    })
    return !!revoked
  }
}
```

## Database Design

### Relations

```prisma
model User {
  id        String     @id @default(uuid())
  cartItems CartItem[]  // One-to-many
  invoices  Invoice[]   // One-to-many
}

model CartItem {
  id        String  @id @default(uuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])  // Many-to-one
  productId String
  product   Product @relation(fields: [productId], references: [id])  // Many-to-one
  
  @@unique([userId, productId])  // Composite unique constraint
}
```

### Cascade Behavior

```prisma
model Invoice {
  id     String        @id @default(uuid())
  items  InvoiceItem[]  // If invoice deleted, items are deleted too
}

model InvoiceItem {
  id        String  @id @default(uuid())
  invoiceId String
  invoice   Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
}
```

## Security Best Practices

### 1. Password Hashing

```typescript
import bcrypt from 'bcryptjs'

// Hash password before storing
const passwordHash = await bcrypt.hash(password, 10)

// Verify password
const isValid = await bcrypt.compare(password, user.passwordHash)
```

### 2. Input Validation

```typescript
// Validate with Zod
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const validated = loginSchema.parse(req.body)
```

### 3. SQL Injection Protection

Prisma automatically protects against SQL injection through parameterized queries:

```typescript
// Safe - Prisma handles parameterization
await prisma.user.findUnique({ where: { email } })

// Avoid raw queries when possible
// But if needed, use parameters:
await prisma.$queryRaw`SELECT * FROM User WHERE email = ${email}`
```

### 4. CORS Configuration

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true
}))
```

### 5. Environment Variables

```typescript
// Never commit .env files
// Use environment variables for secrets
const secret = process.env.JWT_SECRET
if (!secret) {
  throw new Error('JWT_SECRET is required')
}
```

## Performance Optimization

### 1. Database Queries

```typescript
// ❌ Bad - N+1 query problem
const carts = await prisma.cartItem.findMany({ where: { userId } })
for (const item of carts) {
  const product = await prisma.product.findUnique({ where: { id: item.productId } })
}

// ✅ Good - Single query with include
const carts = await prisma.cartItem.findMany({
  where: { userId },
  include: { product: true }
})
```

### 2. Select Only Needed Fields

```typescript
// ❌ Bad - Fetches all fields
const users = await prisma.user.findMany()

// ✅ Good - Select specific fields
const users = await prisma.user.findMany({
  select: { id: true, email: true, firstName: true }
})
```

### 3. Pagination

```typescript
const products = await prisma.product.findMany({
  skip: (page - 1) * limit,
  take: limit
})
```

### 4. Indexes

```prisma
model Product {
  name     String
  category String
  
  @@index([category])  // Index for faster filtering
  @@index([name])      // Index for search
}
```

## Testing Strategy

### Unit Tests (Services)

```typescript
describe('authService', () => {
  it('should return null for invalid credentials', async () => {
    const result = await authService.login('invalid@test.com', 'wrong')
    expect(result).toBeNull()
  })
})
```

### Integration Tests (API)

```typescript
import request from 'supertest'
import app from '@/app'

describe('GET /products', () => {
  it('should return list of products', async () => {
    const res = await request(app).get('/products')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
```

## Scalability Considerations

### Horizontal Scaling
- Stateless design (no sessions, only JWT)
- Each instance can handle requests independently
- Load balancer distributes traffic

### Database Scaling
- Connection pooling (Prisma default)
- Read replicas for read-heavy operations
- Caching layer (Redis) for frequently accessed data

### API Versioning
```typescript
// Future consideration
app.use('/api/v1', routes)
app.use('/api/v2', routesV2)
```

---

**Next**: [Getting Started Guide](./GETTING_STARTED.md) | [API Documentation](./API.md)
