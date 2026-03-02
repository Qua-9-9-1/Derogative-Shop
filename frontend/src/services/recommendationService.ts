import { apiClient } from './api';

export const recommendationService = {
  async getRecommendations() {
    try {
      const response = await apiClient.get('/recommendations');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },
};
