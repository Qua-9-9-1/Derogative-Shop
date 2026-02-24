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

jest.mock('@/context/authContext', () => {
  const React = require('react');
  const AuthContext = React.createContext({
    token: 'test-token',
    userId: 'test-user-id',
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  });

  return {
    AuthProvider: ({ children }: any) => React.createElement(AuthContext.Provider, {
      value: {
        token: 'test-token',
        userId: 'test-user-id',
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      }
    }, children),
    useAuth: () => React.useContext(AuthContext),
  };
});

jest.mock('@/context/userContext', () => {
  const React = require('react');
  const UserContext = React.createContext({
    userData: { firstName: 'Test', email: 'test@example.com', id: 'test-user-id' },
    loading: false,
    error: null,
    refetchUser: jest.fn(),
  });

  return {
    UserProvider: ({ children }: any) => React.createElement(UserContext.Provider, {
      value: {
        userData: { firstName: 'Test', email: 'test@example.com', id: 'test-user-id' },
        loading: false,
        error: null,
        refetchUser: jest.fn(),
      }
    }, children),
    useUser: () => React.useContext(UserContext),
  };
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        {children}
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
