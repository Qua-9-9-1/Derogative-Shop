import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';

interface AuthContextData {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await SecureStore.getItemAsync('user_token');
      const storedUserId = await SecureStore.getItemAsync('user_id');

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

      await SecureStore.setItemAsync('user_token', result.token);
      await SecureStore.setItemAsync('user_id', result.user.id);
    } else {
      throw new Error("Échec de la connexion");
    }
  };

  const logout = async () => {
    setToken(null);
    setUserId(null);
    await SecureStore.deleteItemAsync('user_token');
    await SecureStore.deleteItemAsync('user_id');
  };

  return (
    <AuthContext.Provider value={{ token, userId, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);