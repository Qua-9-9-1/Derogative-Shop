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

### AuthService (`src/services/authService.ts`)

#### register

```typescript
async register(email: string, pass: string): Promise<{ email: string } | null>
```

**Endpoint**: `POST /auth/register`

#### login

```typescript
async login(email: string, pass: string): Promise<{ token: string } | null>
```

**Endpoint**: `POST /auth/login`

#### logout

```typescript
async logout(): Promise<void>
```

**Endpoint**: `POST /auth/logout`

#### validateToken

```typescript
async validateToken(): Promise<User | null>
```

**Endpoint**: `GET /auth/me`

### UserService (`src/services/userService.ts`)

#### getUserProfile

```typescript
async getUserProfile(): Promise<User>
```

**Endpoint**: `GET /users/profile`

#### updateUserProfile

```typescript
async updateUserProfile(data: UpdateUserProfileDto): Promise<User>
```

**Endpoint**: `PUT /users/profile`

#### updateUserPassword

```typescript
async updateUserPassword(currentPassword: string, newPassword: string): Promise<void>
```

**Endpoint**: `PUT /users/password`

#### deleteUserAccount

```typescript
async deleteUserAccount(): Promise<void>
```

**Endpoint**: `DELETE /users/profile`

### ProductService (`src/services/productService.ts`)

#### searchProducts

```typescript
async searchProducts(query: string, page?: number): Promise<Product[]>
```

**Endpoint**: `GET /products/`
**Returns**: Array of products with `stockQuantity > 0`

#### getProductByBarcode

```typescript
async getProductByBarcode(barcode: string): Promise<Product | null>
```

**Endpoint**: `GET /products/:barcode`
**Returns**: Product data or null

#### checkStockAvailability

```typescript
async checkStockAvailability(cartItems: Product[]): Promise<Product[]>
```

**Returns**: Items out of stock

### CartService (`src/services/cartService.ts`)

#### getCart

```typescript
async getCart(): Promise<CartItem[]>
```

**Endpoint**: `GET /cart`
**Returns**: Array of cart items

#### syncCart

```typescript
async syncCart(items: CartItem[]): Promise<void>
```

**Endpoint**: `PUT /cart/sync`
**Syncs** local cart with backend

### PaymentService (`src/services/paymentService.ts`)

#### createOrder

```typescript
async createOrder(items: Array<{id: string, quantity: number}>): Promise<{orderId: string, approvalUrl: string}>
```

**Endpoint**: `POST /payments/create-order`
**Returns**: PayPal order ID and approval URL

#### captureOrder

```typescript
async captureOrder(orderId: string): Promise<{status: string, message: string}>
```

**Endpoint**: `POST /payments/capture-order`
**Captures** PayPal payment

#### getOrderHistory

```typescript
async getOrderHistory(): Promise<Order[]>
```

**Endpoint**: `GET /orders`
**Returns**: User's order history

### RecommendationService (`src/services/recommendationService.ts`)

#### getRecommendations

```typescript
async getRecommendations(): Promise<Product[]>
```

**Endpoint**: `GET /recommendations`
**Returns**: Recommended products based on user history

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
