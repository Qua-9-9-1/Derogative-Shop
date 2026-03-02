import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useSegments: jest.fn(() => []),
  Stack: ({ children }: any) => children,
  Tabs: ({ children }: any) => children,
}));

jest.mock('@/hooks/useCartSync', () => ({
  useCartSync: jest.fn(),
}));

jest.mock('@/context/authContext', () => ({
  AuthProvider: ({ children }: any) => children,
  useAuth: jest.fn(() => ({
    token: 'test-token',
    userId: 'test-user-id',
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  })),
}));

jest.mock('@/context/userContext', () => ({
  UserProvider: ({ children }: any) => children,
  useUser: jest.fn(() => ({
    userData: { firstName: 'Test', email: 'test@example.com', id: 'test-user-id' },
    loading: false,
    error: null,
    refetchUser: jest.fn(),
    updateUser: jest.fn(),
    updatePassword: jest.fn(),
  })),
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <PaperProvider>{children}</PaperProvider>
    </SafeAreaProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
