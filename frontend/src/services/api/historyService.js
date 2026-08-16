import apiClient from './apiClient';

export const historyService = {
  /**
   * Get current user's search history
   */
  async getSearchHistory() {
    return apiClient.get('/search-history/');
  },

  /**
   * Clear user's search history
   */
  async clearSearchHistory() {
    return apiClient.delete('/search-history/clear/');
  },

  /**
   * Delete a specific search history entry
   */
  async deleteSearchHistory(id) {
    return apiClient.delete(`/search-history/${id}/delete/`);
  }
};
