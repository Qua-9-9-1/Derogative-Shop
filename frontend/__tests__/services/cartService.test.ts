import { cartService } from '../../src/services/cartService';
import { apiClient } from '@/services/api';

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('cartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should have getCart function', () => {
    expect(typeof cartService.getCart).toBe('function');
  });

  describe('getCart', () => {
    it('returns cart data on success', async () => {
      mockedApiClient.get.mockResolvedValueOnce({
        data: [
          {
            product: {
              id: '1',
              name: 'Test',
              price: '10',
              imageUrl: null,
              smallImageUrl: null,
              brand: 'TestBrand',
            },
            quantity: 1,
          },
        ],
      } as any);
      const res = await cartService.getCart();
      expect(res.length).toBe(1);
      expect(res[0].name).toBe('Test');
      expect(res[0].price).toBe(10);
      expect(res[0].brands).toBe('TestBrand');
    });

    it('returns empty array when no data', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: null } as any);
      const res = await cartService.getCart();
      expect(res).toEqual([]);
    });

    it('returns empty array on error', async () => {
      mockedApiClient.get.mockRejectedValueOnce({
        response: { data: { message: 'Cart not found' } },
      });
      const res = await cartService.getCart();
      expect(res).toEqual([]);
    });
  });

  describe('syncCart', () => {
    it('calls apiClient.put on success', async () => {
      mockedApiClient.put.mockResolvedValueOnce({} as any);
      await cartService.syncCart([
        { id: '1', name: 'Test', price: 10, quantity: 1, brands: 'TestBrand' },
      ]);
      expect(mockedApiClient.put).toHaveBeenCalledWith('/cart/sync', [
        { id: '1', name: 'Test', price: 10, quantity: 1, brands: 'TestBrand' },
      ]);
    });

    it('handles error during sync', async () => {
      mockedApiClient.put.mockRejectedValueOnce({
        response: { data: { message: 'Sync failed' } },
      });
      await cartService.syncCart([{ id: '1', name: 'Test', price: 10, quantity: 1 }] as any);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
