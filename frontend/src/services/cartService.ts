import { apiClient } from './api';
import { CartItem } from '@/store/cartStore';

export const cartService = {
  async getCart() {
    try {
      const response = await apiClient.get('/cart');
      const backendItems = response.data || [];
      return backendItems.map((item: any) => ({
        id: item.product.id,
        name: item.product.name,
        brands: item.product.brand,
        image_url: item.product.imageUrl,
        small_image_url: item.product.smallImageUrl,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
      }));
    } catch (error: any) {
      console.error('Cart Error:', error.response?.data?.message || error.message);
      return [];
    }
  },

  async syncCart(items: CartItem[]) {
    try {
      await apiClient.put('/cart/sync', items);
    } catch (error: any) {
      console.error('Cart Sync Error:', error.response?.data || error.message);
    }
  },
};
