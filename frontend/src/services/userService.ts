import axios from 'axios';
import { config } from '@/config';

export const userService = {
  async getUserProfile(userId: string, token: string) {
    try {
      const response = await axios.get(`${config.api.baseUrl}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId: string, token: string, profileData: any) {
    try {
      const response = await axios.put(`${config.api.baseUrl}/user/${userId}`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async deleteUserAccount(userId: string, token: string) {
    try {
      await axios.delete(`${config.api.baseUrl}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  },
};
