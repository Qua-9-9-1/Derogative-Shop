import { apiClient } from './api';

export interface Product {
  id: string;
  name: string;
  brands?: string;
  small_image_url?: string;
  image_url?: string;
  nutriscore?: string;
  quantity: number;
  price: number;
}

export const productService = {
  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await apiClient.get(`/products/${barcode}`);

      if (response.data) {
        const p = response.data;
        return {
          id: barcode,
          name: p.name || 'Unknown',
          brands: p.brand,
          small_image_url: p.smallImageUrl,
          image_url: p.imageUrl,
          quantity: p.stockQuantity,
          price: p.price,
        };
      }
      console.warn('No product found for barcode:', barcode);
      return null;
    } catch (error) {
      console.error('Error during product search', error);
      return null;
    }
  },

  async searchProducts(query: string, page: number = 1): Promise<Product[]> {
    try {
      const response = await apiClient.get('/products/');

      if (response.data) {
        return response.data
          .filter((p: any) => p.stockQuantity > 0)
          .map((p: any) => ({
            id: p.id,
            name: p.name || 'Unknown',
            brands: p.brand,
            image_url: p.imageUrl,
            quantity: p.stockQuantity,
            price: p.price,
          }));
      }
      return [];
    } catch (error) {
      console.error('Error during product search', error);
      return [];
    }
  },
};
