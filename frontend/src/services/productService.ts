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
  nutritional_info?: {
    energy?: string;
    fat?: string;
    saturated_fat?: string;
    carbohydrates?: string;
    sugars?: string;
    fiber?: string;
    proteins?: string;
    salt?: string;
    [key: string]: string | undefined;
  };
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
          nutriscore: p.nutriscore,
          nutritional_info: p.nutritionalInfo,
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
            small_image_url: p.smallImageUrl,
            quantity: p.stockQuantity,
            price: p.price,
            nutriscore: p.nutriscore,
            nutritional_info: p.nutritionalInfo,
          }));
      }
      return [];
    } catch (error) {
      console.error('Error during product search', error);
      return [];
    }
  },

  async checkStockAvailability(cartItems: Product[]): Promise<Product[]> {
    try {
      const response = await apiClient.get('/products/');
      
      if (!response.data) return [];

      const productsMap = new Map<string, number>(
        response.data.map((p: any) => [p.id, p.stockQuantity])
      );

      const outOfStockItems = cartItems.filter(item => {
        const availableStock: number = productsMap.get(item.id) || 0;
        return item.quantity > availableStock;
      });

      return outOfStockItems;
    } catch (error) {
      console.error('Error checking stock availability', error);
      return [];
    }
  },
};
