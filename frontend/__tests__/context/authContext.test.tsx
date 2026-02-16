import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../src/context/authContext';

jest.mock('../../src/services/authService', () => ({
  authService: {
    login: jest.fn(() => Promise.resolve({ token: 'token', user: { id: 'userId' } })),
  },
}));

describe('authContext', () => {
  it('provides default values', () => {
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.token).toBeNull();
    expect(result.current.userId).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login updates token and userId', async () => {
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('test@test.com', 'password');
    });
    expect(result.current.token).toBe('token');
    expect(result.current.userId).toBe('userId');
    expect(result.current.isAuthenticated).toBe(true);
  });
});
