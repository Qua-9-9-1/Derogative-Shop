import React from 'react';
import { render } from '@/utils/test-utils';
import ProductScreen from '@/screens/ProductScreen';

jest.mock('@/services/productService', () => ({
  productService: {
    getAllProducts: jest.fn(() => Promise.resolve([])),
    searchProducts: jest.fn(() => Promise.resolve([])),
  },
}));

jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn(() => ({
    items: [],
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
  })),
}));

describe('ProductScreen', () => {
  it('renders without crashing', () => {
    render(<ProductScreen />);
  });
});
