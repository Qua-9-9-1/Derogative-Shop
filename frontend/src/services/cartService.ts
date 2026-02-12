import { Alert } from 'react-native';
import { config } from '@/config';
import axios from 'axios';
import { CartItem } from '@/store/cartStore';

export const cartService = {
  async getCart() {
    try {
      const response = await axios.get(`${config.api.baseUrl}/cart`);
      return response.data;
    } catch (error: any) {
      Alert.alert('Cart Error', error.response?.data?.message || error.message);
      return { items: [] };
    }
  },

  async syncCart(items: CartItem[]) {
    try {
      await axios.put(`${config.api.baseUrl}/cart/sync`, { items });
    } catch (error: any) {
      Alert.alert('Cart Sync Error', error.response?.data?.message || error.message);
    }
  },
};
