import axios from 'axios';
import { config } from '@/config';

export interface Product {
  id: string;
  name: string;
  brands?: string;
  image_url?: string;
  nutriscore?: string;
  price: number;
}

export const productService = {
  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await axios.get(`${config.api.foodfactsUrl}/${barcode}.json`);

      if (response.data.status === 1) {
        const p = response.data.product;
        return {
          id: barcode,
          name: p.product_name || 'Unknown',
          brands: p.brands,
          image_url: p.image_front_small_url,
          nutriscore: p.nutriscore_grade,
          price: 999,
        };
      }
      return null;
    } catch (error) {
      console.error('Error API OFF', error);
      return null;
    }
  },

  async searchProducts(query: string, page: number = 1): Promise<Product[]> {
    try {
      const response = await axios.get(`${config.api.foodfactsUrl}/products.json`, {
        params: {
          search_terms: query,
          page,
          page_size: 20,
          json: true,
        },
      });

      console.log('OFF search response', response.data);
      if (response.data.products) {
        return response.data.products.map((p: any) => ({
          id: p.code,
          name: p.product_name || 'Unknown',
          brands: p.brands,
          image_url: p.image_front_small_url,
          nutriscore: p.nutriscore_grade,
          price: 999,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error API OFF', error);
      return [];
    }
  },
};
