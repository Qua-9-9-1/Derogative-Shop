# API Documentation

Complete REST API reference for the Derogative Shop backend.

## Base URL

```
Development: http://localhost:3000
Production: https://your-api-domain.com
```

## Authentication

Most endpoints require JWT authentication via Bearer token.

**Header Format:**

```
Authorization: Bearer <your_jwt_token>
```

**Obtaining a Token:**

1. Register: `POST /auth/register`
2. Login: `POST /auth/login`
3. Use the returned `token` in subsequent requests

## Response Format

### Success Response

```json
{
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "message": "Error description",
  "error": "Technical details (development only)"
}
```

## Status Codes

| Code  | Meaning                                    |
| ----- | ------------------------------------------ |
| `200` | OK - Request succeeded                     |
| `201` | Created - Resource created successfully    |
| `400` | Bad Request - Invalid input                |
| `401` | Unauthorized - Missing or invalid token    |
| `404` | Not Found - Resource doesn't exist         |
| `409` | Conflict - Duplicate resource              |
| `422` | Unprocessable Entity - Invalid data format |
| `500` | Internal Server Error - Server issue       |

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John", // Optional
  "lastName": "Doe" // Optional
}
```

**Success Response (201):**

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2026-02-17T10:00:00.000Z"
}
```

**Errors:**

- `400` - Email and password required
- `409` - Email already in use

**Example:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

### Login

Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Errors:**

- `400` - Email and password required
- `401` - Incorrect email or password

**Example:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

### Refresh Token

Get a new JWT token using existing valid token.

**Endpoint:** `POST /auth/refresh`

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <current_token>
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

- `401` - No token provided
- `401` - Invalid or expired token
- `401` - Token has been revoked

**Example:**

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Authorization: Bearer your-token-here"
```

---

### Logout

Revoke current token (logout).

**Endpoint:** `POST /auth/logout`

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

**Errors:**

- `401` - No token provided
- `401` - Invalid token

**Example:**

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer your-token-here"
```

---

## User Endpoints

### Get User Profile

Retrieve the authenticated user's profile.

**Endpoint:** `GET /user/profile`

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "billingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "country": "USA"
  },
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

**Errors:**

- `401` - Not authenticated

**Example:**

```bash
curl http://localhost:3000/user/profile \
  -H "Authorization: Bearer your-token-here"
```

---

### Update User Profile

Update authenticated user's information.

**Endpoint:** `PUT /user/profile`

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "billingAddress": {
    "street": "456 Oak Ave",
    "city": "San Francisco",
    "zipCode": "94102",
    "country": "USA"
  }
}
```

**Success Response (200):**

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "billingAddress": { ... },
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

**Errors:**

- `401` - Not authenticated
- `400` - Invalid data format

**Example:**

```bash
curl -X PUT http://localhost:3000/user/profile \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Smith"}'
```

---

## Product Endpoints

### Get All Products

Retrieve the complete product catalog.

**Endpoint:** `GET /products`

**Authentication:** Not required

**Success Response (200):**

```json
[
  {
    "id": "3017624010701",
    "name": "Nutella",
    "brand": "Ferrero",
    "price": "4.99",
    "category": "Spreads",
    "stockQuantity": 150,
    "imageUrl": "https://images.openfoodfacts.org/...",
    "smallImageUrl": "https://images.openfoodfacts.org/.../200.jpg",
    "nutritionalInfo": {
      "energy": "539 kcal",
      "fat": "30.9g",
      "carbohydrates": "57.5g",
      "proteins": "6.3g"
    },
    "lastUpdated": "2026-02-17T10:00:00.000Z"
  },
  {
    "id": "5449000000996",
    "name": "Coca-Cola",
    "brand": "Coca-Cola",
    "price": "1.50",
    "category": "Beverages",
    "stockQuantity": 500,
    "imageUrl": "https://...",
    "smallImageUrl": "https://.../200.jpg",
    "nutritionalInfo": { ... },
    "lastUpdated": "2026-02-17T10:00:00.000Z"
  }
]
```

**Example:**

```bash
curl http://localhost:3000/products
```

---

### Get Product by Barcode

Retrieve a specific product by its barcode. If not in database, fetches from Open Food Facts API.

**Endpoint:** `GET /products/:barcode`

**Authentication:** Not required

**Parameters:**

- `barcode` (path) - Product barcode/EAN (e.g., "3017624010701")

**Success Response (200):**

```json
{
  "id": "3017624010701",
  "name": "Nutella",
  "brand": "Ferrero",
  "price": "4.99",
  "category": "Spreads",
  "stockQuantity": 150,
  "imageUrl": "https://images.openfoodfacts.org/...",
  "smallImageUrl": "https://images.openfoodfacts.org/.../200.jpg",
  "nutritionalInfo": {
    "energy": "539 kcal",
    "fat": "30.9g",
    "carbohydrates": "57.5g",
    "proteins": "6.3g"
  },
  "lastUpdated": "2026-02-17T10:00:00.000Z"
}
```

**Errors:**

- `404` - Product not found

**Example:**

```bash
curl http://localhost:3000/products/3017624010701
```

**Notes:**

- First checks local database
- If not found, queries Open Food Facts API
- Automatically saves to database for future requests
- Prices are estimated/default values

---

### Search Products

Search products by name (future implementation).

**Endpoint:** `GET /products/search`

**Authentication:** Not required

**Query Parameters:**

- `q` (string) - Search query

**Example:**

```bash
curl "http://localhost:3000/products/search?q=nutella"
```

---

## Cart Endpoints

### Get Cart

Retrieve user's shopping cart.

**Endpoint:** `GET /cart/:userId`

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `userId` (path) - User ID (extracted from token)

**Success Response (200):**

```json
{
  "items": [
    {
      "id": "cart-item-uuid",
      "quantity": 2,
      "productId": "3017624010701",
      "product": {
        "id": "3017624010701",
        "name": "Nutella",
        "brand": "Ferrero",
        "price": "4.99",
        "imageUrl": "https://...",
        "smallImageUrl": "https://..."
      }
    },
    {
      "id": "cart-item-uuid-2",
      "quantity": 1,
      "productId": "5449000000996",
      "product": {
        "id": "5449000000996",
        "name": "Coca-Cola",
        "brand": "Coca-Cola",
        "price": "1.50",
        "imageUrl": "https://...",
        "smallImageUrl": "https://..."
      }
    }
  ]
}
```

**Errors:**

- `401` - Not authenticated

**Example:**

```bash
curl http://localhost:3000/cart/user-uuid-here \
  -H "Authorization: Bearer your-token-here"
```

---

### Sync Cart

Synchronize frontend cart with backend (batch update).

**Endpoint:** `POST /cart/:userId/sync`

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `userId` (path) - User ID

**Request Body:**

```json
[
  {
    "id": "3017624010701",
    "name": "Nutella",
    "price": "4.99",
    "quantity": 2,
    "image_url": "https://..."
  },
  {
    "id": "5449000000996",
    "name": "Coca-Cola",
    "price": "1.50",
    "quantity": 1,
    "image_url": "https://..."
  }
]
```

**Success Response (200):**

```json
{
  "message": "Cart synchronized",
  "cart": {
    "items": [
      {
        "id": "cart-item-uuid",
        "quantity": 2,
        "productId": "3017624010701",
        "product": { ... }
      }
    ]
  }
}
```

**Errors:**

- `400` - Invalid cart format: expected array
- `401` - Missing userId (token invalid?)
- `422` - Invalid item format

**Example:**

```bash
curl -X POST http://localhost:3000/cart/user-uuid/sync \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json" \
  -d '[{"id":"3017624010701","name":"Nutella","price":"4.99","quantity":2,"image_url":"https://..."}]'
```

**Notes:**

- Replaces entire cart with provided items
- Creates products in database if they don't exist
- Removes items not in sync request

---

## Data Models

### User

```typescript
{
  id: string              // UUID
  email: string           // Unique
  passwordHash: string    // Never returned in API responses
  firstName?: string      // Optional
  lastName?: string       // Optional
  phone?: string          // Optional
  billingAddress?: {      // JSON object
    street: string
    city: string
    zipCode: string
    country: string
  }
  createdAt: Date
}
```

### Product

```typescript
{
  id: string              // Barcode/EAN
  name: string
  brand?: string
  imageUrl?: string
  smallImageUrl?: string
  price: Decimal          // Decimal(10,2)
  category?: string
  stockQuantity: number   // Default: 0
  nutritionalInfo?: {     // JSON object
    energy: string
    fat: string
    carbohydrates: string
    proteins: string
    // ... other nutritional data
  }
  lastUpdated: Date
}
```

### CartItem

```typescript
{
  id: string; // UUID
  quantity: number;
  userId: string; // Foreign key
  user: User; // Relation
  productId: string; // Foreign key
  product: Product; // Relation
}
```

### RevokedToken

```typescript
{
  id: string; // UUID
  token: string; // Unique, JWT token
  revokedAt: Date;
}
```

### Invoice

```typescript
{
  id: string              // UUID
  date: Date
  totalAmount: Decimal    // Decimal(10,2)
  status: 'PENDING' | 'PAID' | 'FAILED'
  paymentMethod: 'PAYPAL'
  userId: string          // Foreign key
  user: User             // Relation
  items: InvoiceItem[]    // Relation
}
```

### InvoiceItem

```typescript
{
  id: string; // UUID
  quantity: number;
  unitPrice: Decimal; // Decimal(10,2)
  invoiceId: string; // Foreign key
  invoice: Invoice; // Relation
  productId: string; // Foreign key
  product: Product; // Relation
}
```

## Rate Limiting

Currently no rate limiting is implemented. Future considerations:

- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## CORS

CORS is configured to allow requests from:

- Development: `http://localhost:8081`
- Production: Configured via `FRONTEND_URL` environment variable

## Pagination

Currently not implemented. All GET endpoints return complete datasets.

Future implementation:

```
GET /products?page=1&limit=20
```

## Versioning

API versioning not yet implemented. Breaking changes will be avoided.

Future consideration: `/api/v1/...`

## Webhooks

Not currently implemented.

---

## Testing with Postman

### Import Collection

Create a Postman collection with the following structure:

1. **Auth**
   - Register
   - Login
   - Refresh Token
   - Logout

2. **User**
   - Get Profile
   - Update Profile

3. **Products**
   - Get All Products
   - Get Product by Barcode

4. **Cart**
   - Get Cart
   - Sync Cart

### Environment Variables

Set up Postman environment:

```json
{
  "baseUrl": "http://localhost:3000",
  "token": "{{token}}"
}
```

Auto-set token after login:

```javascript
// In Login request's Tests tab
pm.environment.set('token', pm.response.json().token);
```

---

**Next**: [Database Documentation](./DATABASE.md) | [Architecture Guide](./ARCHITECTURE.md)
