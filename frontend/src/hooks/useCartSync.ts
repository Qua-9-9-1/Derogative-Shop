import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/authContext';

export const useCartSync = () => {
  const { isDirty, syncWithBackend, initializeCart } = useCartStore();
  const { isAuthenticated } = useAuth();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      initializeCart();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isDirty && isAuthenticated) {
        console.log('Cart is dirty, scheduling sync...');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        syncWithBackend();
      }, 2000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDirty, isAuthenticated]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/) && isDirty) {
        syncWithBackend();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isDirty]);
};
