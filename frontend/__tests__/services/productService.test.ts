import { productService } from '@/services/productService';
jest.mock('axios');
const axios = require('axios');

describe('productService', () => {
  it('getProductByBarcode returns product on status 1', async () => {
    axios.get.mockResolvedValue({ data: { status: 1, product: { product_name: 'Test', brands: 'Brand', image_front_small_url: 'img', nutriscore_grade: 'b' } } });
    const res = await productService.getProductByBarcode('123');
    expect(res?.name).toBe('Test');
  });

  it('getProductByBarcode returns null on status 0', async () => {
    axios.get.mockResolvedValue({ data: { status: 0 } });
    const res = await productService.getProductByBarcode('123');
    expect(res).toBeNull();
  });

  it('searchProducts returns array', async () => {
    axios.get.mockResolvedValue({ data: { products: [{ id: '1', name: 'A', price: 1 }] } });
    const res = await productService.searchProducts('A');
    expect(Array.isArray(res)).toBe(true);
  });
});
