import { productService } from '../../src/services/productService';
jest.mock('axios');
const axios = require('axios');

describe('productService', () => {
  it('should have getProductByBarcode function', () => {
    expect(typeof productService.getProductByBarcode).toBe('function');
  });

  it('should have searchProducts function', () => {
    expect(typeof productService.searchProducts).toBe('function');
  });

  it('getProductByBarcode returns product on status 1', async () => {
    axios.get.mockResolvedValue({
      data: {
        status: 1,
        product: {
          name: 'Test',
          brand: 'Brand',
          imageUrl: 'img',
          stockQuantity: 5,
          price: 10,
        },
      },
    });
    const res = await productService.getProductByBarcode('123');
    expect(res?.name).toBe('Test');
    expect(res?.brands).toBe('Brand');
    expect(res?.image_url).toBe('img');
    expect(res?.quantity).toBe(5);
    expect(res?.price).toBe(10);
  });

  it('getProductByBarcode returns null on status 0', async () => {
    axios.get.mockResolvedValue({ data: { status: 0 } });
    const res = await productService.getProductByBarcode('123');
    expect(res).toBeNull();
  });

  it('searchProducts returns array', async () => {
    axios.get.mockResolvedValue({
      data: [
        { id: '1', name: 'A', brand: 'Brand', imageUrl: 'img', stockQuantity: 2, price: 1 },
        { id: '2', name: 'B', brand: 'Brand2', imageUrl: 'img2', stockQuantity: 0, price: 2 },
      ],
    });
    const res = await productService.searchProducts('A');
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('A');
  });
});
