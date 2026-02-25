import { apiClient } from './api';

export const userService = {
  async getUserProfile(userId: string) {
    try {
      const response = await apiClient.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId: string, profileData: any) {
    try {
      const response = await apiClient.put(`/user/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async updateUserPassword(userId: string, oldPassword: string, newPassword: string) {
    try {
      await apiClient.put(`/user/${userId}/password`, { oldPassword, newPassword });
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  },

  async deleteUserAccount(userId: string) {
    try {
      await apiClient.delete(`/user/${userId}`);
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  },
};
