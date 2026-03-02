import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { config } from '@/config';

class SimpleEventEmitter {
  private listeners: { [key: string]: Array<() => void> } = {};

  on(event: string, callback: () => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: () => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }

  emit(event: string) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((callback) => callback());
  }
}

export const authEventEmitter = new SimpleEventEmitter();

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
      } else {
        await SecureStore.deleteItemAsync('user_token');
        await SecureStore.deleteItemAsync('user_id');
      }

      authEventEmitter.emit('auth:logout');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
