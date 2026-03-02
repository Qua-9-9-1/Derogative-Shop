import { authService } from '@/services/authService';
import { apiClient } from '@/services/api';
import { Alert } from 'react-native';

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have login function', () => {
    expect(typeof authService.login).toBe('function');
  });

  describe('register', () => {
    it('returns data on success', async () => {
      mockedApiClient.post.mockResolvedValue({ data: { email: 'a@b.com' } } as any);
      const res = await authService.register('a@b.com', 'pass');
      expect(res).toEqual({ email: 'a@b.com' });
    });

    it('handles error and returns null', async () => {
      mockedApiClient.post.mockRejectedValue({
        response: { data: { message: 'Email already exists' } },
      });
      const res = await authService.register('a@b.com', 'pass');
      expect(res).toBeNull();
      expect(Alert.alert).toHaveBeenCalledWith('Registration Error', 'Email already exists');
    });
  });

  describe('login', () => {
    it('returns data on success', async () => {
      mockedApiClient.post.mockResolvedValue({ data: { token: 'tok' } } as any);
      const res = await authService.login('a@b.com', 'pass');
      expect(res).toEqual({ token: 'tok' });
    });

    it('handles error and returns null', async () => {
      mockedApiClient.post.mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } },
      });
      const res = await authService.login('a@b.com', 'pass');
      expect(res).toBeNull();
      expect(Alert.alert).toHaveBeenCalledWith('Login Error', 'Invalid credentials');
    });
  });

  describe('logout', () => {
    it('calls apiClient.post on success', async () => {
      mockedApiClient.post.mockResolvedValue({} as any);
      await authService.logout();
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('handles error during logout', async () => {
      mockedApiClient.post.mockRejectedValue({
        response: { data: { message: 'Token expired' } },
      });
      await authService.logout();
      expect(Alert.alert).toHaveBeenCalledWith('Logout Error', 'Token expired');
    });
  });

  describe('validateToken', () => {
    it('returns user data when token is valid', async () => {
      mockedApiClient.get.mockResolvedValue({ data: { id: '123', email: 'a@b.com' } } as any);
      const res = await authService.validateToken();
      expect(res).toEqual({ id: '123', email: 'a@b.com' });
      expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/me');
    });

    it('returns null when token is invalid', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('Unauthorized'));
      const res = await authService.validateToken();
      expect(res).toBeNull();
    });
  });
});
