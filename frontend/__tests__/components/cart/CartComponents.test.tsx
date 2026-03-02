import { CartItemRow } from '@/components/cart/CartItemRow';
import { StockValidationDialog } from '@/components/cart/StockValidationDialog';

describe('Cart Components', () => {
  describe('CartItemRow', () => {
    it('component is defined', () => {
      expect(CartItemRow).toBeDefined();
      expect(typeof CartItemRow).toBe('function');
    });
  });

  describe('StockValidationDialog', () => {
    it('component is defined', () => {
      expect(StockValidationDialog).toBeDefined();
      expect(typeof StockValidationDialog).toBe('function');
    });
  });
});
