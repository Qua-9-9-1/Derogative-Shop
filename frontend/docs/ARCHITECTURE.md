# Frontend Architecture

## Architecture Overview

The application follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Screens, Components, UI)        │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│       State Management Layer        │
│    (Zustand Stores, Contexts)       │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         Business Logic Layer        │
│      (Hooks, Services, Utils)       │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│          Data Access Layer          │
│       (API Services, Storage)       │
└─────────────────────────────────────┘
```

## Folder Structure

### `/app` - Routes and Navigation

Uses **Expo Router** with file-based routing:

```
app/
├── _layout.tsx               # Root layout with providers
├── login.tsx                 # Route /login
├── register.tsx              # Route /register
└── (tabs)/                   # Route group with tabs
    ├── _layout.tsx           # Tabs layout
    ├── index.tsx             # Home Tab - /
    ├── products.tsx          # Products Tab - /products
    ├── scan.tsx              # Scan Tab - /scan
    ├── cart.tsx              # Cart Tab - /cart
    └── user.tsx              # Profile Tab - /user
```

**Conventions**:
- Files in `app/` automatically become routes
- `(tabs)` is a route group sharing a layout
- `_layout.tsx` defines nested layouts
- Routes are automatically typed

### `/src/components` - Reusable Components

```
components/
├── themed-text.tsx           # Text with theme support
├── themed-view.tsx           # View with theme support
├── parallax-scroll-view.tsx  # ScrollView with parallax
└── ui/                       # Specific UI components
    ├── collapsible.tsx       # Collapsible component
    ├── ErrorContent.tsx      # Error display
    ├── LoadingContent.tsx    # Loading indicator
    ├── ToastSnack.tsx        # Toast notifications
    └── icon-symbol.tsx       # System icons
```

**Principles**:
- Dumb/presentational components
- TypeScript typed props
- Testable in isolation
- Reusable across the app

### `/src/screens` - Screen Components

```
screens/
├── HomeScreen.tsx            # Home screen
├── ProductScreen.tsx         # Product list/details
├── ScanScreen.tsx            # Barcode scanner
├── CartScreen.tsx            # Shopping cart
├── UserScreen.tsx            # User profile
├── LoginScreen.tsx           # Login
└── RegisterScreen.tsx        # Registration
```

**Responsibilities**:
- Screen business logic
- Orchestration of hooks and services
- Local state management
- UI component composition

### `/src/services` - API Services

```
services/
├── authService.ts            # Authentication (login, register, logout)
├── userService.ts            # User management (profile, update)
├── productService.ts         # Products (list, search, details)
└── cartService.ts            # Cart (add, remove, sync)
```

**Service Architecture**:
- Encapsulation of API calls with Axios
- Centralized error handling
- Validation with Zod
- TypeScript types for requests/responses

```typescript
// Example structure
class ProductService {
  async getProducts(): Promise<Product[]>
  async getProductById(id: string): Promise<Product>
  async searchProducts(query: string): Promise<Product[]>
}
```

### `/src/store` - Zustand State Management

```
store/
├── cartStore.ts              # Cart state
└── toastStore.ts             # Notifications state
```

**Zustand Pattern**:
```typescript
interface CartStore {
  // State
  items: CartItem[]
  total: number
  
  // Actions
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  // ...
}))
```

### `/src/context` - React Contexts

```
context/
└── authContext.tsx           # Authentication context
```

**AuthContext**:
- Manages global user state
- Provides login/logout/register methods
- Persists token with Expo Secure Store
- Verifies authentication on startup

### `/src/hooks` - Custom Hooks

```
hooks/
├── use-color-scheme.ts       # Theme hook (dark/light)
├── use-theme-color.ts        # Theme color hook
└── useCartSync.ts            # Cart synchronization
```

**Business Hooks**:
```typescript
// Example: useCartSync
export function useCartSync() {
  const { user } = useAuth()
  const { items, syncWithBackend } = useCartStore()
  
  useEffect(() => {
    if (user) {
      syncWithBackend(user.id)
    }
  }, [user, items])
}
```

### `/src/constants` - Constants and Configuration

```
constants/
└── theme.ts                  # Theme colors and styles
```

### `/src/utils` - Utility Functions

Reusable functions (formatting, validation, helpers).

## Architecture Patterns

### 1. Separation of Concerns

Each layer has a unique responsibility:
- **Screens**: Presentation logic
- **Services**: Backend communication
- **Stores**: Shared global state
- **Hooks**: Reusable logic

### 2. Dependency Injection

```typescript
// Services are imported in screens/hooks
import { productService } from '@/services/productService'

function ProductScreen() {
  const loadProducts = async () => {
    const products = await productService.getProducts()
  }
}
```

### 3. Composition over Inheritance

Favor composition of small components:

```typescript
<ThemedView>
  <LoadingContent loading={isLoading}>
    <ProductList products={products} />
  </LoadingContent>
</ThemedView>
```

### 4. Props Drilling Solution

Use Context for global state (Auth) and Zustand for shared state (Cart).

## Data Flow

### Authentication Flow

```
LoginScreen
    │
    ├─> authService.login(credentials)
    │       │
    │       └─> API POST /auth/login
    │               │
    │               └─> Response { token, user }
    │
    └─> AuthContext.login(token, user)
            │
            ├─> SecureStore.setItemAsync('token', token)
            └─> Navigation.navigate('Home')
```

### Product Data Flow

```
ProductScreen
    │
    ├─> useEffect(() => loadProducts())
    │       │
    │       └─> productService.getProducts()
    │               │
    │               └─> API GET /products
    │                       │
    │                       └─> setProducts(data)
    │
    └─> useCartStore().addItem(product)
            │
            └─> cartService.addToCart(product)
                    │
                    └─> API POST /cart/items
```

## Navigation

### Navigation Structure

```
RootLayout (_layout.tsx)
├── AuthProvider
├── ThemeProvider
└── Navigation Stack
    ├── (tabs) - Bottom Tabs Navigator
    │   ├── index (Home)
    │   ├── products
    │   ├── scan
    │   ├── cart
    │   └── user
    ├── login - Modal/Stack Screen
    └── register - Modal/Stack Screen
```

### Authentication Guard

Protected routes verify user via AuthContext:

```typescript
function ProtectedScreen() {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <LoadingContent />
  if (!user) {
    router.replace('/login')
    return null
  }
  
  return <ScreenContent />
}
```

## Error Handling

### Error Handling Levels

1. **Service Level**: Catch and transform API errors
2. **Screen Level**: Display user-friendly errors
3. **Global Level**: Axios interceptors for network errors

```typescript
// In a service
try {
  const response = await api.get('/products')
  return response.data
} catch (error) {
  if (axios.isAxiosError(error)) {
    throw new ApiError(error.response?.data.message)
  }
  throw error
}

// In a screen
try {
  await loadProducts()
} catch (error) {
  toastStore.showError(error.message)
}
```

## Performance

### Optimizations

- **React.memo** for expensive components
- **useMemo** / **useCallback** to avoid re-calculations
- **FlatList** with `getItemLayout` for long lists
- **Image lazy loading** with Expo Image
- **Code splitting** with dynamic imports

### Optimization Example

```typescript
const ProductItem = React.memo(({ product }) => (
  <View>
    <Text>{product.name}</Text>
  </View>
))

const ProductList = ({ products }) => {
  const renderItem = useCallback(({ item }) => (
    <ProductItem product={item} />
  ), [])
  
  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  )
}
```

## Security

### Secure Storage

- **Tokens**: Expo Secure Store (encrypted)
- **Sensitive Data**: Never in AsyncStorage
- **API Keys**: Environment variables (.env)

### Security Headers

```typescript
// Axios interceptor
axios.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Testing

### Test Architecture

```
__tests__/
├── components/               # Component tests
├── screens/                  # Screen tests
├── services/                 # Service tests (mocked API)
├── store/                    # Zustand store tests
└── hooks/                    # Hook tests
```

See [TESTING.md](./TESTING.md) for more details.

---

**Next Step**: [Getting Started Guide](./GETTING_STARTED.md)
