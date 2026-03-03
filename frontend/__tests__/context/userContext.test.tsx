import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { UserProvider, useUser } from '@/context/userContext';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/authContext';

jest.mock('@/services/userService');
jest.mock('@/context/authContext');

const mockUserService = userService as jest.Mocked<typeof userService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockUserData = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '1234567890',
  billingAddress: {
    street: '123 Test St',
    city: 'Test City',
    zipCode: '12345',
    country: 'Test Country',
  },
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error when useUser is used outside UserProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useUser());
    }).toThrow('useUser must be used within UserProvider');

    consoleSpy.mockRestore();
  });

  it('loads user data when authenticated', async () => {
    mockUseAuth.mockReturnValue({
      userId: 'user-123',
      isAuthenticated: true,
      isLoading: false,
      token: 'test-token',
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUserService.getUserProfile.mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockUserService.getUserProfile).toHaveBeenCalledWith('user-123');
    expect(result.current.userData).toEqual(mockUserData);
    expect(result.current.error).toBeNull();
  });

  it('does not load user data when not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      userId: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockUserService.getUserProfile).not.toHaveBeenCalled();
    expect(result.current.userData).toBeNull();
  });

  it('handles error when loading user data fails', async () => {
    mockUseAuth.mockReturnValue({
      userId: 'user-123',
      isAuthenticated: true,
      isLoading: false,
      token: 'test-token',
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUserService.getUserProfile.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load user profile');
    expect(result.current.userData).toBeNull();
  });

  it('updateUser updates user profile and reloads data', async () => {
    mockUseAuth.mockReturnValue({
      userId: 'user-123',
      isAuthenticated: true,
      isLoading: false,
      token: 'test-token',
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUserService.getUserProfile.mockResolvedValue(mockUserData);
    mockUserService.updateUserProfile.mockResolvedValue({
      ...mockUserData,
      firstName: 'Jane',
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.updateUser({ firstName: 'Jane' });

    expect(mockUserService.updateUserProfile).toHaveBeenCalledWith('user-123', {
      firstName: 'Jane',
    });
    expect(mockUserService.getUserProfile).toHaveBeenCalledTimes(2);
  });

  it('updateUser throws error when no userId', async () => {
    mockUseAuth.mockReturnValue({
      userId: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(result.current.updateUser({ firstName: 'Jane' })).rejects.toThrow(
      'No user ID available'
    );
  });

  it('updatePassword calls userService correctly', async () => {
    mockUseAuth.mockReturnValue({
      userId: 'user-123',
      isAuthenticated: true,
      isLoading: false,
      token: 'test-token',
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUserService.getUserProfile.mockResolvedValue(mockUserData);
    mockUserService.updateUserPassword.mockResolvedValue();

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.updatePassword('oldPass', 'newPass');

    expect(mockUserService.updateUserPassword).toHaveBeenCalledWith(
      'user-123',
      'oldPass',
      'newPass'
    );
  });

  it('updatePassword throws error when no userId', async () => {
    mockUseAuth.mockReturnValue({
      userId: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(result.current.updatePassword('old', 'new')).rejects.toThrow(
      'No user ID available'
    );
  });

  it('refetchUser reloads user data', async () => {
    mockUseAuth.mockReturnValue({
      userId: 'user-123',
      isAuthenticated: true,
      isLoading: false,
      token: 'test-token',
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUserService.getUserProfile.mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockUserService.getUserProfile).toHaveBeenCalledTimes(1);

    await result.current.refetchUser();

    expect(mockUserService.getUserProfile).toHaveBeenCalledTimes(2);
  });
});
