import apiClient from './apiClient';

export const reviewService = {
  /**
   * Get reviews for a product
   */
  async getProductReviews(productId, params = {}) {
    return apiClient.get(`/reviews/product/${productId}/`, { params });
  },

  /**
   * Add a new review
   */
  async addReview(productId, data) {
    return apiClient.post(`/reviews/product/${productId}/`, data);
  },

  /**
   * Mark a review as helpful
   */
  async markHelpful(reviewId) {
    return apiClient.post(`/reviews/${reviewId}/helpful/`);
  },

  /**
   * Report a review
   */
  async reportReview(reviewId, reason) {
    return apiClient.post(`/reviews/${reviewId}/report/`, { reason });
  }
};
