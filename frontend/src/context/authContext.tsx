import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';
import { Platform } from 'react-native';

interface AuthContextData {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

async function saveItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key: string) {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

async function deleteItem(key: string) {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await getItem('user_token');
      const storedUserId = await getItem('user_id');

      if (storedToken && storedUserId) {
        setToken(storedToken);
        setUserId(storedUserId);
      }
    };
    loadAuthData();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);

    if (result && result.token && result.user) {
      setToken(result.token);
      setUserId(result.user.id);

      await saveItem('user_token', result.token);
      await saveItem('user_id', result.user.id);
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    setToken(null);
    setUserId(null);
    await deleteItem('user_token');
    await deleteItem('user_id');
  };

  return (
    <AuthContext.Provider value={{ token, userId, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
