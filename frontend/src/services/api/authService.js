import apiClient from './apiClient';

export const authService = {
  /**
   * Login user
   */
  async login(credentials) {
    return apiClient.post('/auth/login/', credentials);
  },

  /**
   * Register new user
   */
  async register(userData) {
    return apiClient.post('/auth/register/', userData);
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    return apiClient.get('/auth/me/');
  },

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    return apiClient.patch('/auth/me/', userData);
  }
};
