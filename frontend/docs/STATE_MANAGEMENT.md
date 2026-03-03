# State Management

Complete guide to state management with Zustand and React Context.

## Overview

The application uses two approaches for state management:

1. **Zustand**: For global application state (cart, toasts)
2. **React Context**: For user authentication and theme
3. **Local State**: For component-specific state

## When to Use What?

### Use Zustand When:

- ✅ State needs to be shared between many components
- ✅ State persists across navigation
- ✅ State updates frequently
- ✅ Need devtools integration
- ✅ Examples: shopping cart, notifications, global settings

### Use React Context When:

- ✅ State is tied to component lifecycle
- ✅ Need to provide services (auth, theme, i18n)
- ✅ State rarely changes
- ✅ Examples: authentication, theme, language

### Use Local State When:

- ✅ State is only used by one component
- ✅ State is temporary (form, modal, toggle)
- ✅ Examples: form input, loading, error

## Zustand Stores

### Cart Store

Global shopping cart with backend sync.

**Location**: `src/store/cartStore.ts`

```typescript
import { create } from 'zustand';
import { cartService } from '@/services/cartService';

export interface CartItem {
  id: string;
  name: string;
  brands?: string;
  image_url?: string;
  small_image_url?: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isDirty: boolean;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  totalPrice: () => number;
  initializeCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isDirty: false,

  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set({
        items: get().items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
        isDirty: true,
      });
    } else {
      set({ items: [...get().items, { ...item, quantity: 1 }], isDirty: true });
    }
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
    } else {
      set({
        items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        isDirty: true,
      });
    }
  },

  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id), isDirty: true });
  },

  clearCart: () => set({ items: [], isDirty: true }),

  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  initializeCart: async () => {
    try {
      const items = await cartService.getCart();
      set({ items, isDirty: false });
    } catch (error) {
      console.error('Failed to initialize cart:', error);
    }
  },

  syncWithBackend: async () => {
    if (!get().isDirty) return;
    try {
      await cartService.syncCart(get().items);
      set({ isDirty: false });
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  },
}));
```

**Usage**:

```typescript
import { useCartStore } from '@/store/cartStore';

function ProductScreen({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  return <Button onPress={() => addItem(product)} title="Add to cart" />;
}

function CartScreen() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <View>
      {items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}
      <Text>Total: {total.toFixed(2)}€</Text>
      <Button title="Clear" onPress={clearCart} />
    </View>
  );
}
```

      />
      <Text>Total: {total}€</Text>
      <Button title="Clear cart" onPress={clearCart} />
    </View>

)
}

````

### Toast Store

Toast notifications with auto-hide.

**Location**: `src/store/toastStore.ts`

```typescript
import { create } from 'zustand';

interface ToastStore {
  message: string;
  visible: boolean;
  type: 'success' | 'error' | 'info';
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>()((set, get) => ({
  message: '',
  visible: false,
  type: 'info',

  showToast: (message, type = 'info') => {
    set({ message, visible: true, type });
    setTimeout(() => {
      if (get().visible) {
        get().hideToast();
      }
    }, 3000);
  },

  hideToast: () => set({ visible: false, message: '' }),
}));
````

**Usage**:

```typescript
import { useToastStore } from '@/store/toastStore';

function MyComponent() {
  const showToast = useToastStore((state) => state.showToast);

  const handleSuccess = async () => {
    try {
      await saveData();
      showToast('Saved!', 'success');
    } catch (error) {
      showToast('Failed to save', 'error');
    }
  };

  return <Button onPress={handleSuccess} title="Save" />;
}

// In _layout.tsx
function RootLayout() {
  const { visible, message, type, hideToast } = useToastStore();

  return (
    <>
      <Stack />
      <ToastSnack visible={visible} message={message} type={type} onDismiss={hideToast} />
    </>
  );
}
```

## Zustand Middleware

### Persist Middleware

Persists state to AsyncStorage:

```typescript
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'my-storage-key',
      storage: createJSONStorage(() => AsyncStorage),

      // Optional: partial persistence
      partialize: (state) => ({ count: state.count }),

      // Optional: migrations
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migrate from v0 to v1
        }
        return persistedState;
      },
    }
  )
);
```

### Devtools Middleware

Debug tool integration (development only):

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
    }),
    { name: 'MyStore' }
  )
);
```

### Immer Middleware

Simplifies immutable updates:

```typescript
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    items: [],
    addItem: (item) =>
      set((state) => {
        // Direct mutation thanks to Immer
        state.items.push(item);
      }),
    updateItem: (id, updates) =>
      set((state) => {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          Object.assign(item, updates);
        }
      }),
  }))
);
```

### Combine Multiple Middleware

```typescript
const useStore = create(
  devtools(
    persist(
      immer((set) => ({
        // state and actions
      })),
      {
        name: 'storage-key',
        storage: createJSONStorage(() => AsyncStorage),
      }
    ),
    { name: 'StoreName' }
  )
);
```

## React Context

### Auth Context

User authentication management.

**Location**: `src/context/authContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { authService } from '@/services/authService'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for saved token on app start
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('token')
      if (token) {
        // Verify token is still valid
        const userData = await authService.verify(token)
        setUser(userData)
      }
    } catch (error) {
      // Token is invalid, clean up
      await SecureStore.deleteItemAsync('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      await SecureStore.setItemAsync('token', response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authService.register({ email, password, name })
      await SecureStore.setItemAsync('token', response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      await SecureStore.deleteItemAsync('token')
      setUser(null)
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

**Usage**:

```typescript
// In _layout.tsx
import { AuthProvider } from '@/context/authContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  )
}

// In LoginScreen
import { useAuth } from '@/context/authContext'

function LoginScreen() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      await login(email, password)
      // Navigate to home
    } catch (error) {
      // Show error
    }
  }

  return (
    <View>
      <Input value={email} onChangeText={setEmail} label="Email" />
      <Input value={password} onChangeText={setPassword} label="Password" secureTextEntry />
      <Button title="Login" onPress={handleLogin} loading={loading} />
    </View>
  )
}

// In UserScreen
import { useAuth } from '@/context/authContext'

function UserScreen() {
  const { user, logout } = useAuth()

  if (!user) return <Text>Not logged in</Text>

  return (
    <View>
      <Text>Welcome, {user.name}!</Text>
      <Text>Email: {user.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  )
}
```

### Protected Routes

```typescript
import { useAuth } from '@/context/authContext'
import { Redirect } from 'expo-router'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingContent />

  if (!user) return <Redirect href="/login" />

  return <>{children}</>
}

// Usage
export default function CartScreen() {
  return (
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  )
}
```

## Local State Patterns

### Form State

```typescript
function LoginForm() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!values.email) newErrors.email = 'Email is required'
    if (!values.password) newErrors.password = 'Password is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      await login(values.email, values.password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View>
      <Input
        label="Email"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
      />
      <Input
        label="Password"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleSubmit} loading={loading} />
    </View>
  )
}
```

### Modal State

```typescript
function MyScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const openModal = (item: Item) => {
    setSelectedItem(item)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedItem(null)
  }

  return (
    <View>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} onRequestClose={closeModal}>
        {selectedItem && (
          <View>
            <Text>{selectedItem.name}</Text>
            <Button title="Close" onPress={closeModal} />
          </View>
        )}
      </Modal>
    </View>
  )
}
```

### Loading, Error, Data Pattern

```typescript
function DataScreen() {
  const [data, setData] = useState<Item[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchData()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingContent />
  if (error) return <ErrorContent message={error.message} onRetry={loadData} />
  if (!data || data.length === 0) return <EmptyState />

  return <DataList data={data} />
}
```

## Performance Optimization

### Selector Pattern with Zustand

**❌ Bad - Re-renders on any state change**:

```typescript
function MyComponent() {
  const store = useCartStore() // Re-renders on ANY change
  return <Text>{store.items.length}</Text>
}
```

**✅ Good - Re-renders only when selected value changes**:

```typescript
function MyComponent() {
  const itemCount = useCartStore(state => state.items.length)
  return <Text>{itemCount}</Text>
}
```

### Shallow Comparison

```typescript
import { shallow } from 'zustand/shallow'

function MyComponent() {
  const { items, total } = useCartStore(
    state => ({
      items: state.items,
      total: state.getTotal()
    }),
    shallow // Shallow comparison instead of === comparison
  )

  return (
    <View>
      <Text>Items: {items.length}</Text>
      <Text>Total: {total}€</Text>
    </View>
  )
}
```

### Memoization with useMemo

```typescript
function CartScreen() {
  const items = useCartStore(state => state.items)

  // Expensive calculation
  const itemsByCategory = useMemo(() => {
    return items.reduce((acc, item) => {
      const category = item.category || 'Other'
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    }, {} as Record<string, CartItem[]>)
  }, [items])

  return (
    <View>
      {Object.entries(itemsByCategory).map(([category, items]) => (
        <View key={category}>
          <Text>{category}</Text>
          {items.map(item => <CartItem key={item.id} item={item} />)}
        </View>
      ))}
    </View>
  )
}
```

### Callback Memoization with useCallback

```typescript
function CartScreen() {
  const updateQuantity = useCartStore(state => state.updateQuantity)

  // Without useCallback, creates new function on each render
  const handleUpdateQuantity = useCallback((id: string, qty: number) => {
    updateQuantity(id, qty)
  }, [updateQuantity])

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <CartItem
          item={item}
          onUpdateQuantity={handleUpdateQuantity} // Same reference
        />
      )}
    />
  )
}
```

## Testing State Management

### Testing Zustand Stores

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCartStore } from '@/store/cartStore';

describe('CartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({ items: [] });
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({
        productId: '1',
        name: 'Product',
        price: 10,
        imageUrl: 'url',
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('should increment quantity for existing item', () => {
    const { result } = renderHook(() => useCartStore());
    const item = {
      productId: '1',
      name: 'Product',
      price: 10,
      imageUrl: 'url',
    };

    act(() => {
      result.current.addItem(item);
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should calculate total correctly', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({ productId: '1', name: 'P1', price: 10, imageUrl: '' }, 2);
      result.current.addItem({ productId: '2', name: 'P2', price: 15, imageUrl: '' }, 1);
    });

    expect(result.current.getTotal()).toBe(35); // (10 * 2) + (15 * 1)
  });
});
```

### Testing React Context

```typescript
import { render, waitFor } from '@testing-library/react-native'
import { AuthProvider, useAuth } from '@/context/authContext'

function TestComponent() {
  const { user, login } = useAuth()
  return (
    <View>
      <Text testID="user-name">{user?.name || 'Not logged in'}</Text>
      <Button testID="login-btn" title="Login" onPress={() => login('test@test.com', 'password')} />
    </View>
  )
}

describe('AuthContext', () => {
  it('should login user', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    fireEvent.press(getByTestId('login-btn'))

    await waitFor(() => {
      expect(getByTestId('user-name')).toHaveTextContent('John Doe')
    })
  })
})
```

## Best Practices

### 1. Keep State Minimal

```typescript
// ❌ Bad - Duplicate data
const useStore = create((set) => ({
  items: [],
  total: 0,
  count: 0,
}));

// ✅ Good - Calculate derived data
const useStore = create((set, get) => ({
  items: [],
  getTotal: () => get().items.reduce((sum, item) => sum + item.price, 0),
  getCount: () => get().items.length,
}));
```

### 2. Avoid Nested Updates

```typescript
// ❌ Bad
set((state) => ({
  cart: {
    ...state.cart,
    items: state.cart.items.map((item) => ({
      ...item,
      selected: item.id === id,
    })),
  },
}));

// ✅ Good - Flatten state
set((state) => ({
  items: state.items.map((item) => ({
    ...item,
    selected: item.id === id,
  })),
}));
```

### 3. Separate Actions from State

```typescript
const useStore = create((set) => ({
  // State
  count: 0,
  loading: false,

  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setLoading: (loading: boolean) => set({ loading }),
}));
```

### 4. Use TypeScript

```typescript
// Always define types for your stores
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
}

const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
}));
```

---

**Navigation**: [Back to README](./README.md) | [Architecture](./ARCHITECTURE.md) | [Testing](./TESTING.md)
