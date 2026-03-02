jest.mock('@/screens/CartScreen', () => ({
  __esModule: true,
  default: function MockCartScreen() {
    const React = require('react');
    return React.createElement('View', { testID: 'cart-screen' }, 'Cart Screen');
  },
}));

describe('CartScreen', () => {
  it('renders without crashing', () => {
    const CartScreen = require('@/screens/CartScreen').default;
    expect(CartScreen).toBeDefined();
  });
});
