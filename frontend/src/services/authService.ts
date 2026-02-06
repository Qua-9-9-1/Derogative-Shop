import { Alert } from 'react-native';
import { config } from '../config';
import axios from 'axios';

export const authService = {
  async register(email: string, pass: string) {
    try {
      const response = await axios.post(`${config.api.baseUrl}/auth/register`, {
        email,
        password: pass,
      });
      return response.data;
    } catch (error: any) {
      Alert.alert('Registration Error', error.response?.data?.message || error.message);
      return null;
    }
  },

  async login(email: string, pass: string) {
    try {
      const response = await axios.post(`${config.api.baseUrl}/auth/login`, {
        email,
        password: pass,
      });
      return response.data;
    } catch (error: any) {
      Alert.alert('Login Error', error.response?.data?.message || error.message);
      return null;
    }
  },

  async logout() {
      try {
          await axios.post(`${config.api.baseUrl}/auth/logout`);
      } catch (error: any) {
          Alert.alert('Logout Error', error.response?.data?.message || error.message);
      }
  },
};
