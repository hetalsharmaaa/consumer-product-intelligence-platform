import apiClient from './apiClient';

export const recommendationService = {
  /**
   * Get personalized recommendations for the current user
   */
  async getRecommendations() {
    return apiClient.get('/recommendations/');
  }
};
