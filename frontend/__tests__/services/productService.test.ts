import { productService } from '@/services/productService';
jest.mock('axios');
const axios = require('axios');

describe('productService', () => {
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
    axios.get.mockResolvedValue({ data: [
      { id: '1', name: 'A', brand: 'Brand', imageUrl: 'img', stockQuantity: 2, price: 1 }
    ] });
    const res = await productService.searchProducts('A');
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].brands).toBe('Brand');
    expect(res[0].image_url).toBe('img');
    expect(res[0].quantity).toBe(2);
    expect(res[0].price).toBe(1);
  });
});
