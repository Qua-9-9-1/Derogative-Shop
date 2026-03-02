import { act } from '@testing-library/react-native';
import { useCartStore } from '../../src/store/cartStore';
import { cartService } from '@/services/cartService';

jest.mock('../../src/services/cartService', () => ({
  cartService: {
    getCart: jest.fn(() => Promise.resolve([])),
    syncCart: jest.fn(() => Promise.resolve()),
  },
}));

const mockCartService = cartService as jest.Mocked<typeof cartService>;

beforeEach(() => {
  useCartStore.setState({ items: [], isDirty: false, isLoading: false });
  jest.clearAllMocks();
});

describe('useCartStore', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 10.99,
    quantity: 5,
    brands: 'Test Brand',
    image_url: 'test.jpg',
  };

  it('addItem adds new item to cart', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
    });
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].id).toBe('1');
    expect(items[0].quantity).toBe(1);
    expect(useCartStore.getState().isDirty).toBe(true);
  });

  it('addItem increments quantity for existing item', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct);
    });
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
  });

  it('updateQuantity updates item quantity', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().updateQuantity('1', 5);
    });
    
    const items = useCartStore.getState().items;
    expect(items[0].quantity).toBe(5);
    expect(useCartStore.getState().isDirty).toBe(true);
  });

  it('updateQuantity removes item when quantity is 0', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().updateQuantity('1', 0);
    });
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(0);
  });

  it('updateQuantity prevents negative quantities', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().updateQuantity('1', -5);
    });
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(0);
  });

  it('clearCart removes all items', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().clearCart();
    });
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(0);
    expect(useCartStore.getState().isDirty).toBe(true);
  });

  it('clearCart does nothing when cart is already empty', () => {
    const initialState = useCartStore.getState();
    
    act(() => {
      useCartStore.getState().clearCart();
    });
    
    expect(useCartStore.getState().isDirty).toBe(false);
  });

  it('getItemCount returns total item count', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem({ ...mockProduct, id: '2' });
      useCartStore.getState().updateQuantity('1', 3);
    });
    
    const count = useCartStore.getState().getItemCount();
    expect(count).toBe(4);
  });

  it('getItemCount returns 0 for empty cart', () => {
    const count = useCartStore.getState().getItemCount();
    expect(count).toBe(0);
  });

  it('totalPrice calculates correct total', () => {
    act(() => {
      useCartStore.getState().addItem({ ...mockProduct, price: 10, quantity: 5 });
      useCartStore.getState().addItem({ ...mockProduct, id: '2', price: 5, quantity: 5 });
      useCartStore.getState().updateQuantity('1', 2);
    });
    
    const total = useCartStore.getState().totalPrice();
    expect(total).toBe(25);
  });

  it('totalPrice returns 0 for empty cart', () => {
    const total = useCartStore.getState().totalPrice();
    expect(total).toBe(0);
  });

  it('initializeCart loads items from backend', async () => {
    const mockItems = [
      { ...mockProduct, quantity: 2 },
      { ...mockProduct, id: '2', quantity: 1 },
    ];
    mockCartService.getCart.mockResolvedValue(mockItems);

    await act(async () => {
      await useCartStore.getState().initializeCart();
    });

    expect(mockCartService.getCart).toHaveBeenCalled();
    expect(useCartStore.getState().items).toEqual(mockItems);
    expect(useCartStore.getState().isDirty).toBe(false);
    expect(useCartStore.getState().isLoading).toBe(false);
  });

  it('initializeCart handles errors gracefully', async () => {
    mockCartService.getCart.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      await useCartStore.getState().initializeCart();
    });

    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().isLoading).toBe(false);
  });

  it('syncWithBackend syncs dirty cart', async () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct);
    });

    await act(async () => {
      await useCartStore.getState().syncWithBackend();
    });

    expect(mockCartService.syncCart).toHaveBeenCalled();
    expect(useCartStore.getState().isDirty).toBe(false);
  });

  it('syncWithBackend skips sync when not dirty', async () => {
    await act(async () => {
      await useCartStore.getState().syncWithBackend();
    });

    expect(mockCartService.syncCart).not.toHaveBeenCalled();
  });

  it('syncWithBackend handles errors gracefully', async () => {
    mockCartService.syncCart.mockRejectedValue(new Error('Sync failed'));
    
    act(() => {
      useCartStore.getState().addItem(mockProduct);
    });

    await act(async () => {
      await useCartStore.getState().syncWithBackend();
    });

    expect(useCartStore.getState().isDirty).toBe(true);
  });
});
