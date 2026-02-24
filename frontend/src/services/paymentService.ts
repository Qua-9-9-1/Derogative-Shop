import axios from "axios";
import { Alert } from "react-native";
import { config } from '@/config';

const BASE_URL = config.api.baseUrl

export const paymentService = {

  async createOrder(token: string) {
    try {
      const response = await axios.post(
        `${BASE_URL}/orders/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
            // { paypalOrderId, approveLink }

    } catch (error: any) {
      Alert.alert(
        "Create Order Error",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  async captureOrder(token: string, paypalOrderId: string) {
    try {
      const response = await axios.post(
        `${BASE_URL}/orders/capture`,
        { paypalOrderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error: any) {
      Alert.alert(
        "Capture Error",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  async getOrderHistory(token: string) {
    try {
      const response = await axios.get(
        `${BASE_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error: any) {
      Alert.alert(
        "History Error",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },
};
