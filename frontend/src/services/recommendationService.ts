import { apiClient } from './api';
import { Product } from './productService';

export const recommendationService = {
  async getRecommendations(): Promise<Product[]> {
    try {
      const response = await apiClient.get('/recommendations');
      const p = response.data;
      return p.map((item: any) => ({
        id: item.id,
        name: item.name || 'Unknown',
        brands: item.brand,
        image_url: item.imageUrl,
        small_image_url: item.smallImageUrl,
        quantity: item.stockQuantity,
        price: item.price,
        nutriscore: item.nutriscore,
        nutritional_info: item.nutritionalInfo,
      }));
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },
};
