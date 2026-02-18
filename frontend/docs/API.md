# API & Services

Documentation for API services and endpoints used in the frontend application.

## API Configuration

### Base URL

API configuration is defined in `src/config.ts`:

```typescript
export const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 30000,
  },
};
```

### Environment Variables

```env
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**For different environments**:

- **Development**: `http://localhost:3000` or `http://10.0.2.2:3000` (Android Emulator)
- **Staging**: URL of staging backend
- **Production**: URL of production backend (e.g., `https://api.derogative-shop.com`)

## Service Architecture

### Axios Client

Global Axios configuration with interceptors:

```typescript
// src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { config } from '@/config';

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Expired or invalid token
      await SecureStore.deleteItemAsync('token');
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

### Service Structure

```typescript
class ServiceName {
  private basePath = '/endpoint';

  async getAll(): Promise<Type[]> {
    const response = await apiClient.get<Type[]>(this.basePath);
    return response.data;
  }

  async getById(id: string): Promise<Type> {
    const response = await apiClient.get<Type>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateDto): Promise<Type> {
    const response = await apiClient.post<Type>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: UpdateDto): Promise<Type> {
    const response = await apiClient.put<Type>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const serviceName = new ServiceName();
```

## Services and Endpoints

### AuthService

User authentication management.

#### Login

```typescript
/**
 * Authenticates a user
 * @param credentials - Email and password
 * @returns JWT token and user information
 */
async login(credentials: LoginDto): Promise<AuthResponse>
```

**Endpoint**: `POST /auth/login`

**Request**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors**:

- `400`: Invalid data
- `401`: Incorrect credentials

#### Register

```typescript
/**
 * Creates a new user account
 * @param data - Registration information
 * @returns JWT token and user information
 */
async register(data: RegisterDto): Promise<AuthResponse>
```

**Endpoint**: `POST /auth/register`

**Request**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response**: Same as login

**Errors**:

- `400`: Invalid data
- `409`: Email already in use

#### Logout

```typescript
/**
 * Logs out the user and revokes the token
 */
async logout(): Promise<void>
```

**Endpoint**: `POST /auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Response**: `204 No Content`

### UserService

User profile management.

#### Get Profile

```typescript
/**
 * Retrieves the logged-in user's profile
 */
async getProfile(): Promise<User>
```

**Endpoint**: `GET /users/profile`

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

#### Update Profile

```typescript
/**
 * Updates user profile
 * @param data - Fields to update
 */
async updateProfile(data: UpdateUserDto): Promise<User>
```

**Endpoint**: `PUT /users/profile`

**Headers**: `Authorization: Bearer <token>`

**Request**:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response**: Updated User object

**Errors**:

- `400`: Invalid data
- `401`: Not authenticated
- `409`: Email already in use

### ProductService

Product management.

#### Get Products

```typescript
/**
 * Retrieves product list
 * @param params - Filter and pagination parameters
 */
async getProducts(params?: ProductQueryParams): Promise<Product[]>
```

**Endpoint**: `GET /products`

**Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search by name
- `category`: Filter by category
- `minPrice`: Minimum price
- `maxPrice`: Maximum price

**Example**: `GET /products?page=1&limit=20&search=phone`

**Response**:

```json
[
  {
    "id": "1",
    "name": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99,
    "stock": 50,
    "imageUrl": "https://...",
    "smallImageUrl": "https://...",
    "category": "Electronics"
  }
]
```

#### Get Product by ID

```typescript
/**
 * Retrieves a product by its ID
 * @param id - Product ID
 */
async getProductById(id: string): Promise<Product>
```

**Endpoint**: `GET /products/:id`

**Response**: Product object

**Errors**:

- `404`: Product not found

#### Search Products

```typescript
/**
 * Searches for products
 * @param query - Search term
 */
async searchProducts(query: string): Promise<Product[]>
```

**Endpoint**: `GET /products/search?q=<query>`

**Response**: Array of products

### CartService

Shopping cart management.

#### Get Cart

```typescript
/**
 * Retrieves the user's cart
 */
async getCart(): Promise<Cart>
```

**Endpoint**: `GET /cart`

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
  "id": "cart-123",
  "userId": "user-123",
  "items": [
    {
      "id": "item-1",
      "productId": "prod-1",
      "product": {
        "id": "prod-1",
        "name": "iPhone 15",
        "price": 999.99,
        "imageUrl": "https://..."
      },
      "quantity": 2
    }
  ],
  "total": 1999.98
}
```

#### Add Item to Cart

```typescript
/**
 * Adds a product to the cart
 * @param productId - Product ID
 * @param quantity - Quantity (default: 1)
 */
async addToCart(productId: string, quantity?: number): Promise<Cart>
```

**Endpoint**: `POST /cart/items`

**Headers**: `Authorization: Bearer <token>`

**Request**:

```json
{
  "productId": "prod-1",
  "quantity": 2
}
```

**Response**: Updated Cart object

**Errors**:

- `400`: Invalid data
- `401`: Not authenticated
- `404`: Product not found
- `409`: Insufficient stock

#### Update Cart Item

```typescript
/**
 * Updates cart item quantity
 * @param itemId - Item ID
 * @param quantity - New quantity
 */
async updateCartItem(itemId: string, quantity: number): Promise<Cart>
```

**Endpoint**: `PUT /cart/items/:itemId`

**Headers**: `Authorization: Bearer <token>`

**Request**:

```json
{
  "quantity": 3
}
```

**Response**: Updated Cart object

#### Remove Item from Cart

```typescript
/**
 * Removes an item from the cart
 * @param itemId - Item ID
 */
async removeFromCart(itemId: string): Promise<Cart>
```

**Endpoint**: `DELETE /cart/items/:itemId`

**Headers**: `Authorization: Bearer <token>`

**Response**: Updated Cart object

#### Clear Cart

```typescript
/**
 * Empties the cart
 */
async clearCart(): Promise<void>
```

**Endpoint**: `DELETE /cart`

**Headers**: `Authorization: Bearer <token>`

**Response**: `204 No Content`

## TypeScript Types

### Common Types

```typescript
// src/types/common.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
```

### Auth Types

```typescript
// src/types/auth.types.ts
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

### Product Types

```typescript
// src/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  smallImageUrl?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
```

### Cart Types

```typescript
// src/types/cart.types.ts
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface AddToCartDto {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
```

## Error Handling

### Error Types

```typescript
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Network error. Please check your connection.');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}
```

### Error Handling in Services

```typescript
class ProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/products');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError();
        }
        throw new ApiError(
          error.response.data?.message || 'Failed to fetch products',
          error.response.status,
          error.response.data?.errors
        );
      }
      throw error;
    }
  }
}
```

### Error Handling in Components

```typescript
function ProductScreen() {
  const [error, setError] = useState<Error | null>(null);

  const loadProducts = async () => {
    try {
      const products = await productService.getProducts();
      setProducts(products);
    } catch (err) {
      if (err instanceof NetworkError) {
        setError(new Error('Check your internet connection'));
      } else if (err instanceof ApiError) {
        setError(new Error(err.message));
      } else {
        setError(new Error('An error occurred'));
      }
    }
  };
}
```

## Retry Logic

### Retry with Exponential Backoff

```typescript
async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries reached');
}

// Usage
const products = await fetchWithRetry(() => productService.getProducts());
```

## Caching

### Simple Cache with Map

```typescript
class CachedProductService {
  private cache = new Map<string, { data: Product[]; timestamp: number }>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  async getProducts(): Promise<Product[]> {
    const cached = this.cache.get('products');

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const products = await productService.getProducts();
    this.cache.set('products', { data: products, timestamp: Date.now() });

    return products;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

## Testing Services

See [TESTING.md](./TESTING.md#3-service-tests) for detailed examples.

```typescript
// Quick example
import { productService } from '@/services/productService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProductService', () => {
  it('should fetch products', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [{ id: '1', name: 'Product' }],
    });

    const products = await productService.getProducts();
    expect(products).toHaveLength(1);
  });
});
```

---

**Next Step**: [Components Documentation](./COMPONENTS.md)
