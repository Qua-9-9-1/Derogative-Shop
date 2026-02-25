import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { userService } from '@/services/userService';

export interface BillingAddress {
  street: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  billingAddress: BillingAddress | null;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
  updateUser: (data: Partial<UserData>) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { userId, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    if (!userId || !isAuthenticated) {
      setUserData(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await userService.getUserProfile(userId);
      setUserData(data);
      setError(null);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Failed to load user profile');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [userId, isAuthenticated]);

  const updateUser = useCallback(
    async (data: Partial<UserData>) => {
      if (!userId) {
        throw new Error('No user ID available');
      }

      try {
        setLoading(true);
        await userService.updateUserProfile(userId, data);
        await loadUserData();
      } catch (err) {
        console.error('Error updating user profile:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, loadUserData]
  );

  const updatePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      if (!userId) {
        throw new Error('No user ID available');
      }

      try {
        setLoading(true);
        await userService.updateUserPassword(userId, oldPassword, newPassword);
      } catch (err) {
        console.error('Error updating password:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    loadUserData();
  }, [isAuthenticated, authLoading, userId, loadUserData]);

  return (
    <UserContext.Provider
      value={{ userData, loading, error, refetchUser: loadUserData, updateUser, updatePassword }}
    >
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
