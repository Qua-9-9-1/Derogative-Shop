import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  brands?: string;
  image_url?: string;
  nutriscore?: string;
  price: number;
}

const API_URL = 'https://world.openfoodfacts.org/api/v0/product';
const SEARCH_API_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

export const productService = {
  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await axios.get(`${API_URL}/${barcode}.json`);

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
      console.error('Erreur API OFF', error);
      return null;
    }
  },

  async searchProducts(query: string, page: number = 1): Promise<Product[]> {
    try {
      const response = await axios.get(SEARCH_API_URL, {
        params: {
          search_terms: query,
          search_simple: 1,
          action: 'process',
          json: 1,
          page: page,
          page_size: 20,
        },
      });

      if (response.data.products) {
        return response.data.products.map((p: any) => ({
          id: p.code,
          name: p.product_name || 'Unknown',
          brands: p.brands || 'Unknown',
          image_url: p.image_front_small_url,
          nutriscore: p.nutriscore_grade,
          price: 999,
        }));
      }
      return [];
    } catch (error) {
      console.error('Erreur Search OFF', error);
      return [];
    }
  },
};
