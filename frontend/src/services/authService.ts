import { Alert } from 'react-native';
import { apiClient } from './api';

export const authService = {
  async register(email: string, pass: string) {
    try {
      const response = await apiClient.post('/auth/register', {
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
      const response = await apiClient.post('/auth/login', {
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
      await apiClient.post('/auth/logout');
    } catch (error: any) {
      Alert.alert('Logout Error', error.response?.data?.message || error.message);
    }
  },

  async validateToken() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error: any) {
      return null;
    }
  },
};
