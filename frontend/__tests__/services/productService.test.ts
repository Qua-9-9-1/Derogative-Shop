import { productService } from '../../src/services/productService';
import { apiClient } from '@/services/api';

jest.mock('@/services/api');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should have getProductByBarcode function', () => {
    expect(typeof productService.getProductByBarcode).toBe('function');
  });

  it('should have searchProducts function', () => {
    expect(typeof productService.searchProducts).toBe('function');
  });

  describe('getProductByBarcode', () => {
    it('returns product on success', async () => {
      mockedApiClient.get.mockResolvedValue({
        data: {
          name: 'Test',
          brand: 'Brand',
          imageUrl: 'img',
          smallImageUrl: 'small',
          stockQuantity: 5,
          price: 10,
          nutriscore: 'A',
          nutritionalInfo: { energy: '100kcal' },
        },
      } as any);
      const res = await productService.getProductByBarcode('123');
      expect(res?.name).toBe('Test');
      expect(res?.brands).toBe('Brand');
      expect(res?.image_url).toBe('img');
      expect(res?.small_image_url).toBe('small');
      expect(res?.quantity).toBe(5);
      expect(res?.price).toBe(10);
      expect(res?.nutriscore).toBe('A');
      expect(res?.nutritional_info).toEqual({ energy: '100kcal' });
    });

    it('returns null when no product data', async () => {
      mockedApiClient.get.mockResolvedValue({ data: null } as any);
      const res = await productService.getProductByBarcode('123');
      expect(res).toBeNull();
    });

    it('returns null on error', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('Network error'));
      const res = await productService.getProductByBarcode('123');
      expect(res).toBeNull();
    });
  });

  describe('searchProducts', () => {
    it('returns filtered array of products', async () => {
      mockedApiClient.get.mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'A',
            brand: 'Brand',
            imageUrl: 'img',
            smallImageUrl: 'small',
            stockQuantity: 2,
            price: 1,
          },
          {
            id: '2',
            name: 'B',
            brand: 'Brand2',
            imageUrl: 'img2',
            smallImageUrl: 'small2',
            stockQuantity: 0,
            price: 2,
          },
        ],
      } as any);
      const res = await productService.searchProducts('A');
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(1);
      expect(res[0].name).toBe('A');
      expect(res[0].brands).toBe('Brand');
    });

    it('returns empty array when no data', async () => {
      mockedApiClient.get.mockResolvedValue({ data: null } as any);
      const res = await productService.searchProducts('test');
      expect(res).toEqual([]);
    });

    it('returns empty array on error', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('Network error'));
      const res = await productService.searchProducts('test');
      expect(res).toEqual([]);
    });
  });

  describe('checkStockAvailability', () => {
    it('returns out of stock items', async () => {
      mockedApiClient.get.mockResolvedValue({
        data: [
          { id: '1', stockQuantity: 5 },
          { id: '2', stockQuantity: 0 },
        ],
      } as any);

      const cartItems = [
        { id: '1', name: 'Product 1', quantity: 10, price: 10 },
        { id: '2', name: 'Product 2', quantity: 1, price: 5 },
      ] as any;

      const res = await productService.checkStockAvailability(cartItems);
      expect(res.length).toBe(2);
      expect(res[0].id).toBe('1');
      expect(res[1].id).toBe('2');
    });

    it('returns empty array when all items in stock', async () => {
      mockedApiClient.get.mockResolvedValue({
        data: [
          { id: '1', stockQuantity: 10 },
          { id: '2', stockQuantity: 5 },
        ],
      } as any);

      const cartItems = [
        { id: '1', name: 'Product 1', quantity: 5, price: 10 },
        { id: '2', name: 'Product 2', quantity: 2, price: 5 },
      ] as any;

      const res = await productService.checkStockAvailability(cartItems);
      expect(res).toEqual([]);
    });

    it('returns empty array when no data', async () => {
      mockedApiClient.get.mockResolvedValue({ data: null } as any);
      const res = await productService.checkStockAvailability([]);
      expect(res).toEqual([]);
    });

    it('returns empty array on error', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('Network error'));
      const cartItems = [{ id: '1', name: 'Product 1', quantity: 5, price: 10 }] as any;
      const res = await productService.checkStockAvailability(cartItems);
      expect(res).toEqual([]);
    });
  });
});
