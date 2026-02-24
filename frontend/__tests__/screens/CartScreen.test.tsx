import { render } from '@/utils/test-utils';
import CartScreen from '@/screens/CartScreen';

jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn(() => ({
    items: [],
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    syncWithBackend: jest.fn(),
    totalPrice: 0,
  })),
}));

jest.mock('@/services/paymentService', () => ({
  paymentService: {
    createOrder: jest.fn(),
    captureOrder: jest.fn(),
  },
}));

jest.mock('@/components/cart/CartItemRow', () => ({
  CartItemRow: () => null,
}));
jest.mock('@/components/cart/CartSummary', () => ({
  CartSummary: () => null,
}));
jest.mock('@/components/cart/StockValidationDialog', () => ({
  StockValidationDialog: () => null,
}));
jest.mock('@/components/cart/PaymentDialog', () => ({
  PaymentDialog: () => null,
}));
jest.mock('@/components/cart/PurchaseHistory', () => ({
  PurchaseHistory: () => null,
}));

describe('CartScreen', () => {
  it('renders cart', () => {
    const { UNSAFE_root } = render(<CartScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
