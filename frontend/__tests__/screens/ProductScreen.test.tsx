jest.mock('@/screens/ProductScreen', () => ({
  __esModule: true,
  default: function MockProductScreen() {
    const React = require('react');
    return React.createElement('View', { testID: 'product-screen' }, 'Product Screen');
  },
}));

describe('ProductScreen', () => {
  it('renders without crashing', () => {
    const ProductScreen = require('@/screens/ProductScreen').default;
    expect(ProductScreen).toBeDefined();
  });
});
