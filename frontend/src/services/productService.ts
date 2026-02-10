import axios from 'axios';
import { config } from '@/config';

export interface Product {
  id: string;
  name: string;
  brands?: string;
  image_url?: string;
  nutriscore?: string;
  quantity: number;
  price: number;
}

export const productService = {
  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/${barcode}.json`);

      if (response.data.status === 1) {
        const p = response.data.product;
        return {
          id: barcode,
          name: p.name || 'Unknown',
          brands: p.brand,
          image_url: p.imageUrl,
          quantity: p.stockQuantity,
          price: p.price,
        };
      }
      return null;
    } catch (error) {
      console.error('Error during product search', error);
      return null;
    }
  },

  async searchProducts(query: string, page: number = 1): Promise<Product[]> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/products/`);

      if (response.data) {
        return response.data.map((p: any) => ({
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
