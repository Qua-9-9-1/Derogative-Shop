import { Alert } from 'react-native';
import { apiClient } from './api';

export const paymentService = {
  async createOrder() {
    try {
      const response = await apiClient.post('/orders/create');

      return response.data;
      // { paypalOrderId, approveLink }
    } catch (error: any) {
      Alert.alert('Create Order Error', error.response?.data?.error || error.message);
      throw error;
    }
  },

  async captureOrder(paypalOrderId: string) {
    try {
      const response = await apiClient.post('/orders/capture', { paypalOrderId });

      return response.data;
    } catch (error: any) {
      Alert.alert('Capture Error', error.response?.data?.error || error.message);
      throw error;
    }
  },

  async getOrderHistory() {
    try {
      const response = await apiClient.get('/orders');

      return response.data;
    } catch (error: any) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  },
};
