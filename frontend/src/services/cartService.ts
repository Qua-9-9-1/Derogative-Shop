import { Alert } from 'react-native';
import { apiClient } from './api';
import { CartItem } from '@/store/cartStore';

export const cartService = {
  async getCart() {
    try {
      const response = await apiClient.get('/cart');
      return response.data;
    } catch (error: any) {
      Alert.alert('Cart Error', error.response?.data?.message || error.message);
      return { items: [] };
    }
  },

  async syncCart(items: CartItem[]) {
    try {
      await apiClient.put('/cart/sync', { items });
    } catch (error: any) {
      Alert.alert('Cart Sync Error', error.response?.data?.message || error.message);
    }
  },
};
