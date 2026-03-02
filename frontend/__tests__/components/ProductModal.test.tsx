import ProductModal from '@/components/ProductModal';

jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn(() => ({
    addItem: jest.fn(),
  })),
}));

describe('ProductModal', () => {
  it('component is defined', () => {
    expect(ProductModal).toBeDefined();
    expect(typeof ProductModal).toBe('function');
  });
});
