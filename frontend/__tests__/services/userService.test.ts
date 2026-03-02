import { userService } from '../../src/services/userService';
import { apiClient } from '@/services/api';

jest.mock('@/services/api');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have getUserProfile function', () => {
    expect(typeof userService.getUserProfile).toBe('function');
  });

  it('getUserProfile returns user data', async () => {
    const mockUser = { id: '1', firstName: 'John', email: 'john@test.com' };
    mockedApiClient.get.mockResolvedValue({ data: mockUser } as any);

    const result = await userService.getUserProfile('1');
    
    expect(mockedApiClient.get).toHaveBeenCalledWith('/user/1');
    expect(result).toEqual(mockUser);
  });

  it('getUserProfile throws error on failure', async () => {
    mockedApiClient.get.mockRejectedValue(new Error('Network error'));

    await expect(userService.getUserProfile('1')).rejects.toThrow('Network error');
  });

  it('updateUserProfile updates user data', async () => {
    const profileData = { firstName: 'Jane', lastName: 'Doe' };
    const mockResponse = { id: '1', ...profileData };
    mockedApiClient.put.mockResolvedValue({ data: mockResponse } as any);

    const result = await userService.updateUserProfile('1', profileData);
    
    expect(mockedApiClient.put).toHaveBeenCalledWith('/user/1', profileData);
    expect(result).toEqual(mockResponse);
  });

  it('updateUserProfile throws error on failure', async () => {
    mockedApiClient.put.mockRejectedValue(new Error('Update failed'));

    await expect(userService.updateUserProfile('1', {})).rejects.toThrow('Update failed');
  });

  it('updateUserPassword calls API correctly', async () => {
    mockedApiClient.put.mockResolvedValue({ data: {} } as any);

    await userService.updateUserPassword('1', 'oldPass', 'newPass');
    
    expect(mockedApiClient.put).toHaveBeenCalledWith('/user/1/password', { 
      oldPassword: 'oldPass', 
      newPassword: 'newPass' 
    });
  });

  it('updateUserPassword throws error on failure', async () => {
    mockedApiClient.put.mockRejectedValue(new Error('Password update failed'));

    await expect(userService.updateUserPassword('1', 'old', 'new')).rejects.toThrow('Password update failed');
  });

  it('deleteUserAccount calls API correctly', async () => {
    mockedApiClient.delete.mockResolvedValue({ data: {} } as any);

    await userService.deleteUserAccount('1');
    
    expect(mockedApiClient.delete).toHaveBeenCalledWith('/user/1');
  });

  it('deleteUserAccount throws error on failure', async () => {
    mockedApiClient.delete.mockRejectedValue(new Error('Delete failed'));

    await expect(userService.deleteUserAccount('1')).rejects.toThrow('Delete failed');
  });
});
