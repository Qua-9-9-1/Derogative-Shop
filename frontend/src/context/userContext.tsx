import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { userService } from '@/services/userService';

interface UserData {
  firstName: string;
  email: string;
  id: string;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { userId, token } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    if (!userId || !token) {
      setError('User not authenticated');
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await userService.getUserProfile(userId);
      setUserData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load user profile');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId, token]);

  return (
    <UserContext.Provider value={{ userData, loading, error, refetchUser: loadUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
