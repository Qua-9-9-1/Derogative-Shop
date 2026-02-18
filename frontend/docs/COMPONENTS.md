# Components

Complete catalog of UI components available in the application.

## Component Architecture

### Component Categories

**1. UI Components (`src/components/ui/`)**

- Reusable and generic components
- Independent of business logic
- Designed for maximum reusability

**2. Theme Components (`src/components/`)**

- Components using the theme
- `ThemedText`, `ThemedView`, etc.
- Ensure UI consistency

**3. Screen Components (`src/screens/`)**

- Complete screens
- Integrate UI components
- Manage screen logic

**4. Layout Components**

- Structural components
- `ParallaxScrollView`, `TabBarIcon`

## Theme Components

### ThemedText

Text component with integrated theme support.

**Location**: `src/components/ThemedText.tsx`

```typescript
import { ThemedText } from '@/components/ThemedText'

function MyComponent() {
  return (
    <>
      <ThemedText type="title">Title</ThemedText>
      <ThemedText type="subtitle">Subtitle</ThemedText>
      <ThemedText type="default">Regular text</ThemedText>
      <ThemedText type="link">Link</ThemedText>
    </>
  )
}
```

**Props**:

```typescript
interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'subtitle' | 'defaultSemiBold' | 'link';
  lightColor?: string;
  darkColor?: string;
}
```

**Available Types**:

- `default`: Regular text (16px)
- `title`: Large title (32px, bold)
- `subtitle`: Subtitle (20px, bold)
- `defaultSemiBold`: Regular text (16px, semi-bold)
- `link`: Link (16px, underlined)

### ThemedView

Container component with theme support.

**Location**: `src/components/ThemedView.tsx`

```typescript
import { ThemedView } from '@/components/ThemedView'

function MyComponent() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Content</ThemedText>
    </ThemedView>
  )
}
```

**Props**:

```typescript
interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}
```

**Usage**:

```typescript
<ThemedView
  lightColor="#ffffff"
  darkColor="#000000"
  style={{ padding: 16 }}
>
  {children}
</ThemedView>
```

## UI Components

### LoadingContent

Loading indicator with optional message.

**Location**: `src/components/ui/LoadingContent.tsx`

```typescript
import { LoadingContent } from '@/components/ui/LoadingContent'

function MyScreen() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <LoadingContent message="Loading products..." />
  }

  return <Content />
}
```

**Props**:

```typescript
interface LoadingContentProps {
  message?: string;
}
```

**Features**:

- Centered loading indicator
- Optional custom message
- Uses `ActivityIndicator` from React Native

### ErrorContent

Error display with retry option.

**Location**: `src/components/ui/ErrorContent.tsx`

```typescript
import { ErrorContent } from '@/components/ui/ErrorContent'

function MyScreen() {
  const [error, setError] = useState<Error | null>(null)

  if (error) {
    return (
      <ErrorContent
        message={error.message}
        onRetry={loadData}
      />
    )
  }

  return <Content />
}
```

**Props**:

```typescript
interface ErrorContentProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}
```

**Features**:

- Visual error display
- Optional retry button
- Customizable messages

### ToastSnack

Toast notification system.

**Location**: `src/components/ui/ToastSnack.tsx`

```typescript
import { ToastSnack } from '@/components/ui/ToastSnack'
import { useToastStore } from '@/store/toastStore'

function App() {
  const { toasts } = useToastStore()

  return (
    <>
      <Navigation />
      {toasts.map(toast => (
        <ToastSnack
          key={toast.id}
          toast={toast}
        />
      ))}
    </>
  )
}
```

**Props**:

```typescript
interface ToastSnackProps {
  toast: Toast;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}
```

**Usage with Store**:

```typescript
import { useToastStore } from '@/store/toastStore';

function MyComponent() {
  const { show } = useToastStore();

  const handleSuccess = () => {
    show('Success!', 'success');
  };

  const handleError = () => {
    show('An error occurred', 'error');
  };
}
```

### Collapsible

Collapsible/expandable component with animation.

**Location**: `src/components/Collapsible.tsx`

```typescript
import { Collapsible } from '@/components/Collapsible'

function MyScreen() {
  return (
    <Collapsible title="Details">
      <ThemedText>Hidden content</ThemedText>
      <ThemedText>Will be shown on expand</ThemedText>
    </Collapsible>
  )
}
```

**Props**:

```typescript
interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}
```

**Features**:

- Smooth expand/collapse animation
- Chevron icon indicating state
- Accessible with screen readers

## Layout Components

### ParallaxScrollView

Scrollable screen with parallax header.

**Location**: `src/components/ParallaxScrollView.tsx`

```typescript
import { ParallaxScrollView } from '@/components/ParallaxScrollView'

function MyScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/header.png')}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.content}>
        <ThemedText type="title">Title</ThemedText>
        <ThemedText>Content...</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  )
}
```

**Props**:

```typescript
interface ParallaxScrollViewProps {
  headerBackgroundColor: { light: string; dark: string };
  headerImage: React.ReactNode;
  children: React.ReactNode;
}
```

**Features**:

- Parallax effect on scroll
- Animated header
- Theme support

### IconSymbol

Universal icon component.

**Location**: `src/components/ui/IconSymbol.tsx`

```typescript
import { IconSymbol } from '@/components/ui/IconSymbol'

function MyComponent() {
  return (
    <>
      <IconSymbol name="house.fill" size={24} color="#007AFF" />
      <IconSymbol name="cart" size={32} />
      <IconSymbol name="person" size={20} color="red" />
    </>
  )
}
```

**Props**:

```typescript
interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}
```

**Available Icons**:

- SF Symbols on iOS
- Material Icons on Android
- Consistent fallbacks

## Form Components

### Button

Reusable button component.

**Location**: `src/components/ui/Button.tsx`

```typescript
import { Button } from '@/components/ui/Button'

function MyScreen() {
  return (
    <>
      <Button
        title="Primary Action"
        onPress={handlePress}
        variant="primary"
      />

      <Button
        title="Secondary Action"
        onPress={handlePress}
        variant="secondary"
      />

      <Button
        title="Disabled"
        onPress={handlePress}
        disabled
      />

      <Button
        title="Loading..."
        loading
      />
    </>
  )
}
```

**Props**:

```typescript
interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}
```

### Input

Text input component with validation.

**Location**: `src/components/ui/Input.tsx`

```typescript
import { Input } from '@/components/ui/Input'

function MyForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()

  return (
    <Input
      label="Email"
      value={email}
      onChangeText={setEmail}
      error={error}
      placeholder="john@example.com"
      keyboardType="email-address"
      autoCapitalize="none"
    />
  )
}
```

**Props**:

```typescript
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}
```

## List Components

### ProductCard

Product display card.

**Location**: `src/components/ProductCard.tsx`

```typescript
import { ProductCard } from '@/components/ProductCard'

function ProductList() {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => navigate('ProductScreen', { id: item.id })}
          onAddToCart={() => addToCart(item.id)}
        />
      )}
    />
  )
}
```

**Props**:

```typescript
interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
}
```

**Features**:

- Product image display
- Name, price, stock
- "Add to cart" button
- Badge for low stock

### CartItem

Cart item component.

**Location**: `src/components/CartItem.tsx`

```typescript
import { CartItem } from '@/components/CartItem'

function CartScreen() {
  return (
    <FlatList
      data={cartItems}
      renderItem={({ item }) => (
        <CartItem
          item={item}
          onUpdateQuantity={(qty) => updateItem(item.id, qty)}
          onRemove={() => removeItem(item.id)}
        />
      )}
    />
  )
}
```

**Props**:

```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}
```

**Features**:

- Product display
- Quantity controls (+/-)
- Subtotal
- Remove button

## Composition Patterns

### Layout Composition

```typescript
function MyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Title</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {loading ? (
          <LoadingContent />
        ) : error ? (
          <ErrorContent message={error.message} onRetry={retry} />
        ) : (
          <ProductList products={products} />
        )}
      </ThemedView>
    </ThemedView>
  )
}
```

### Compound Components Pattern

```typescript
// Card.tsx
function Card({ children }: { children: React.ReactNode }) {
  return <ThemedView style={styles.card}>{children}</ThemedView>
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <ThemedView style={styles.header}>{children}</ThemedView>
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <ThemedView style={styles.content}>{children}</ThemedView>
}

Card.Header = CardHeader
Card.Content = CardContent

// Usage
function MyComponent() {
  return (
    <Card>
      <Card.Header>
        <ThemedText type="subtitle">Title</ThemedText>
      </Card.Header>
      <Card.Content>
        <ThemedText>Content...</ThemedText>
      </Card.Content>
    </Card>
  )
}
```

### Render Props Pattern

```typescript
interface DataFetcherProps<T> {
  fetch: () => Promise<T>
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

function DataFetcher<T>({ fetch, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return <>{children(data, loading, error)}</>
}

// Usage
function MyScreen() {
  return (
    <DataFetcher fetch={productService.getProducts}>
      {(products, loading, error) => {
        if (loading) return <LoadingContent />
        if (error) return <ErrorContent message={error.message} />
        return <ProductList products={products!} />
      }}
    </DataFetcher>
  )
}
```

## Best Practices

### 1. TypeScript Props

Always define props with TypeScript:

```typescript
interface MyComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

function MyComponent({ title, onPress, disabled, children }: MyComponentProps) {
  // ...
}
```

### 2. Default Props

Use default values in destructuring:

```typescript
function Button({ title, variant = 'primary', disabled = false, loading = false }: ButtonProps) {
  // ...
}
```

### 3. testID for Testing

Always add `testID` for testable components:

```typescript
function Button({ title, testID }: ButtonProps) {
  return (
    <TouchableOpacity testID={testID}>
      <Text testID={`${testID}-text`}>{title}</Text>
    </TouchableOpacity>
  )
}

// In tests
const button = getByTestId('login-button')
expect(button).toBeTruthy()
```

### 4. Accessibility

Add accessibility labels:

```typescript
function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      accessibilityLabel={title}
      accessibilityRole="button"
      onPress={onPress}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  )
}
```

### 5. Performance Optimization

Use `React.memo` for expensive components:

```typescript
interface ProductCardProps {
  product: Product
  onPress: () => void
}

export const ProductCard = React.memo(function ProductCard({
  product,
  onPress
}: ProductCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: product.imageUrl }} />
      <Text>{product.name}</Text>
      <Text>{product.price} €</Text>
    </TouchableOpacity>
  )
}, (prev, next) => {
  // Only re-render if product has changed
  return prev.product.id === next.product.id &&
         prev.product.name === next.product.name &&
         prev.product.price === next.product.price
})
```

### 6. StyleSheet.create

Always use `StyleSheet.create`:

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

// Not
const styles = {
  container: { flex: 1 }, // ❌ Creates new object on each render
};
```

### 7. Conditional Rendering

Use patterns for clarity:

```typescript
// ✅ Ternary
{loading ? <LoadingContent /> : <Content />}

// ✅ && for single condition
{error && <ErrorContent message={error.message} />}

// ✅ Early return
function MyComponent({ data }) {
  if (!data) return <EmptyState />
  return <Content data={data} />
}

// ❌ Avoid complex conditions in JSX
{!loading && !error && data && data.length > 0 && <Content />}
```

### 8. Component Organization

Structure your components:

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

// 2. Types
interface MyComponentProps {
  title: string
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState()

  // 3.2 Handlers
  const handlePress = () => {
    // ...
  }

  // 3.3 Effects
  useEffect(() => {
    // ...
  }, [])

  // 3.4 Render
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  )
}

// 4. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
```

## Testing Components

See [TESTING.md](./TESTING.md#2-component-tests) for detailed examples.

```typescript
// Quick example
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Button title="Click me" onPress={onPress} />
    )

    fireEvent.press(getByText('Click me'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
```

---

**Next Step**: [State Management](./STATE_MANAGEMENT.md)
