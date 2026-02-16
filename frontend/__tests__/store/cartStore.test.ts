import { act } from '@testing-library/react-native';
import { useCartStore } from '../../src/store/cartStore';

jest.mock('../../src/services/cartService', () => ({
  cartService: {
    getCart: jest.fn(() => Promise.resolve({ items: [] })),
    syncCart: jest.fn(() => Promise.resolve()),
  },
}));

beforeEach(() => {
  useCartStore.setState({ items: [], isDirty: false, isLoading: false });
});

describe('useCartStore', () => {
  it('addItem adds item to cart', () => {
    act(() => {
      useCartStore.getState().addItem({ id: '1', name: 'Test', price: 10, quantity: 1 });
    });
    const items = useCartStore.getState().items;
    expect(items.length).toBeGreaterThan(0);
  });

  it('clearCart clears items', () => {
    act(() => {
      useCartStore.getState().addItem({ id: '1', name: 'Test', price: 10, quantity: 1 });
      useCartStore.getState().clearCart();
    });
    const items = useCartStore.getState().items;
    expect(items.length).toBe(0);
  });
});
