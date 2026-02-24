import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { config } from '@/config';

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem('user_token');
  } else {
    return await SecureStore.getItemAsync('user_token');
  }
}

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (Platform.OS === 'web') {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_id');
        window.dispatchEvent(new Event('auth:logout'));
      } else {
        await SecureStore.deleteItemAsync('user_token');
        await SecureStore.deleteItemAsync('user_id');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
