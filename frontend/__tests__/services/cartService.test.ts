import { cartService } from '../../src/services/cartService';

describe('cartService', () => {
  it('should have getCart function', () => {
    expect(typeof cartService.getCart).toBe('function');
  });
});
