import { Alert } from 'react-native';
import { config } from '@/config';
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

  async logout(token?: string) {
    try {
      await axios.post(
        `${config.api.baseUrl}/auth/logout`,
        {},
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
    } catch (error: any) {
      Alert.alert('Logout Error', error.response?.data?.message || error.message);
    }
  },

  async validateToken(token: string) {
    try {
      const response = await axios.get(`${config.api.baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return null;
    }
  },
};
