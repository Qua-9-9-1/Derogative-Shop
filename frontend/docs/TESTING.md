# Testing Guide

This guide presents the testing strategy, tools, and best practices for testing the Derogative Shop frontend.

## Testing Stack

- **Jest**: Testing framework
- **React Native Testing Library**: React Native component testing
- **Jest Expo**: Jest preset for Expo
- **React Test Renderer**: Renderer for snapshots

## Configuration

### jest.config.js

Jest configuration is defined in `package.json`:

```json
{
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.ts"],
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*)"
    ],
    "collectCoverage": true,
    "collectCoverageFrom": ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
    "coverageThreshold": {
      "global": {
        "branches": 20,
        "functions": 20,
        "lines": 20,
        "statements": 20
      }
    }
  }
}
```

### jest.setup.ts

Global test configuration:

```typescript
// Mock native modules
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Global configuration
global.beforeEach(() => {
  jest.clearAllMocks();
});
```

## Test Types

### 1. Unit Tests

Test isolated functions, hooks, and utilities.

#### Example: Utility Test

```typescript
// src/utils/formatPrice.ts
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// __tests__/utils/formatPrice.test.ts
import { formatPrice } from '@/utils/formatPrice';

describe('formatPrice', () => {
  it('should format price with USD currency', () => {
    expect(formatPrice(19.99)).toBe('$19.99');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should handle large numbers', () => {
    expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
  });

  it('should round to 2 decimals', () => {
    expect(formatPrice(19.999)).toBe('$20.00');
  });
});
```

#### Example: Custom Hook Test

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// __tests__/hooks/useDebounce.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Still old value

    jest.advanceTimersByTime(500);
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });
});
```

### 2. Component Tests

Test component rendering and interactions.

#### Example: Simple Component

```typescript
// src/components/Button.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import type { FC } from 'react'

interface ButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
}

export const Button: FC<ButtonProps> = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      testID="button"
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
})

// __tests__/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('should render with title', () => {
    const { getByText } = render(
      <Button title="Click me" onPress={() => {}} />
    )
    expect(getByText('Click me')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <Button title="Click me" onPress={onPress} />
    )

    fireEvent.press(getByTestId('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <Button title="Click me" onPress={onPress} disabled />
    )

    fireEvent.press(getByTestId('button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('should apply disabled style when disabled', () => {
    const { getByTestId } = render(
      <Button title="Click me" onPress={() => {}} disabled />
    )

    const button = getByTestId('button')
    expect(button.props.style).toContainEqual(
      expect.objectContaining({ opacity: 0.5 })
    )
  })
})
```

#### Example: Component with State

```typescript
// __tests__/screens/LoginScreen.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { LoginScreen } from '@/screens/LoginScreen'
import { authService } from '@/services/authService'

// Mock the service
jest.mock('@/services/authService')

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render login form', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    expect(getByPlaceholderText('Email')).toBeTruthy()
    expect(getByPlaceholderText('Password')).toBeTruthy()
    expect(getByText('Sign In')).toBeTruthy()
  })

  it('should show validation errors', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />)

    const submitButton = getByText('Sign In')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getByText('Email required')).toBeTruthy()
      expect(getByText('Password required')).toBeTruthy()
    })
  })

  it('should call authService.login on submit', async () => {
    const mockLogin = authService.login as jest.MockedFunction<typeof authService.login>
    mockLogin.mockResolvedValue({
      token: 'fake-token',
      user: { id: '1', email: 'test@test.com' }
    })

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    const submitButton = getByText('Sign In')

    fireEvent.changeText(emailInput, 'test@test.com')
    fireEvent.changeText(passwordInput, 'password123')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })
  })

  it('should show error message on login failure', async () => {
    const mockLogin = authService.login as jest.MockedFunction<typeof authService.login>
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@test.com')
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrong')
    fireEvent.press(getByText('Sign In'))

    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy()
    })
  })
})
```

### 3. Service Tests

Test API calls and error handling.

```typescript
// __tests__/services/productService.test.ts
import { productService } from '@/services/productService';
import { apiClient } from '@/services/api';

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('searchProducts', () => {
    it('should return filtered products', async () => {
      mockedApiClient.get.mockResolvedValue({
        data: [
          { id: '1', name: 'Product 1', brand: 'Brand', stockQuantity: 5, price: 10, imageUrl: 'img' },
          { id: '2', name: 'Product 2', brand: 'Brand2', stockQuantity: 0, price: 20, imageUrl: 'img2' },
        ],
      });

      const result = await productService.searchProducts('test');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Product 1');
    });

    it('should return empty array on error', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('Network error'));
      const result = await productService.searchProducts('test');
      expect(result).toEqual([]);
    });
  });

  describe('getProductByBarcode', () => {
    it('should return product data', async () => {
      mockedApiClient.get.mockResolvedValue({
        data: { name: 'Product', brand: 'Brand', stockQuantity: 5, price: 10 },
      });

      const result = await productService.getProductByBarcode('123');
      expect(result?.name).toBe('Product');
    });

    it('should return null on error', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('Not found'));
      const result = await productService.getProductByBarcode('123');
      expect(result).toBeNull();
    });
  });
});
```

### 4. Zustand Store Tests

```typescript
// __tests__/store/cartStore.test.ts
import { renderHook, act } from '@testing-library/react-native';
import { useCartStore } from '@/store/cartStore';

describe('CartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());
    const product = { id: '1', name: 'Product 1', price: 10 };

    act(() => {
      result.current.addItem(product, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({
      product,
      quantity: 2,
    });
  });

  it('should increment quantity if product already in cart', () => {
    const { result } = renderHook(() => useCartStore());
    const product = { id: '1', name: 'Product 1', price: 10 };

    act(() => {
      result.current.addItem(product, 1);
      result.current.addItem(product, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCartStore());
    const product = { id: '1', name: 'Product 1', price: 10 };

    act(() => {
      result.current.addItem(product);
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should calculate total correctly', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({ id: '1', name: 'P1', price: 10 }, 2);
      result.current.addItem({ id: '2', name: 'P2', price: 15 }, 1);
    });

    // 10 * 2 + 15 * 1 = 35
    expect(result.current.total).toBe(35);
  });
});
```

### 5. Context Tests

```typescript
// __tests__/context/authContext.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react-native'
import { AuthProvider, useAuth } from '@/context/authContext'
import { authService } from '@/services/authService'
import * as SecureStore from 'expo-secure-store'

jest.mock('@/services/authService')
jest.mock('expo-secure-store')

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should provide initial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should login successfully', async () => {
    const mockUser = { id: '1', email: 'test@test.com' }
    const mockToken = 'fake-token'

    ;(authService.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: mockToken,
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@test.com', 'password')
    })

    expect(result.current.user).toEqual(mockUser)
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', mockToken)
  })

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    // First login
    ;(authService.login as jest.Mock).mockResolvedValue({
      user: { id: '1', email: 'test@test.com' },
      token: 'fake-token',
    })

    await act(async () => {
      await result.current.login('test@test.com', 'password')
    })

    // Then logout
    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('token')
  })
})
```

## Mocking

### Mock External Modules

```typescript
// Mock Expo Camera
jest.mock('expo-camera', () => ({
  Camera: 'Camera',
  CameraView: 'CameraView',
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));
```

### Mock Services

```typescript
// Option 1: Manual mock
jest.mock('@/services/productService', () => ({
  productService: {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
  },
}));

// Option 2: Mock with jest.spyOn
import { productService } from '@/services/productService';

jest.spyOn(productService, 'getProducts').mockResolvedValue([{ id: '1', name: 'Product' }]);
```

## Best Practices

### 1. Test Structure

```typescript
describe('ComponentName', () => {
  describe('feature/method', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = someFunction(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### 2. Test Naming

```typescript
// ✅ Good - descriptive and clear
it('should display error message when login fails', () => {});
it('should add product to cart when quantity is valid', () => {});

// ❌ Bad - too vague
it('works', () => {});
it('test login', () => {});
```

### 3. Avoid Fragile Tests

```typescript
// ❌ Bad - depends on implementation
expect(component.find('TouchableOpacity').length).toBe(3);

// ✅ Good - tests behavior
expect(getByText('Add to cart')).toBeTruthy();
expect(getByRole('button', { name: 'Add to cart' })).toBeTruthy();
```

### 4. Async Tests

```typescript
// ✅ Good - use waitFor
await waitFor(() => {
  expect(getByText('Products loaded')).toBeTruthy();
});

// ❌ Bad - no waiting
expect(getByText('Products loaded')).toBeTruthy();
```

### 5. Test IDs

```typescript
// In component
<View testID="product-card">
  <Text testID="product-name">{product.name}</Text>
</View>

// In test
const { getByTestId } = render(<ProductCard product={product} />)
expect(getByTestId('product-name')).toHaveTextContent('Product 1')
```

## Test Scripts

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch

# Test specific file
npm test -- ProductScreen.test.tsx

# Verbose mode
npm test -- --verbose

# Update snapshots
npm test -- -u
```

## Coverage

### Current Coverage Stats

```
All files:       39.56% statements | 18.40% branches | 27.98% functions | 39.67% lines

Services:        54% statements (authService, productService, cartService 100%)
Store:           77% statements (cartStore 95%, toastStore 100%)
Context:         76% statements (userContext 87%)
Hooks:           55% statements
Components:      3% statements
Screens:         4% statements
```

### View Coverage

```bash
npm run test:coverage
```

HTML report: `/coverage/lcov-report/index.html`

### Coverage Thresholds

Defined in `package.json`:

```json
{
  "coverageThreshold": {
    "global": {
      "branches": 20,
      "functions": 20,
      "lines": 20,
      "statements": 20
    }
  }
}
```

## CI/CD

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

---

**Next Step**: [API Documentation](./API.md)
