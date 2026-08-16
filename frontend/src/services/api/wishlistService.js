import apiClient from './apiClient';

export const wishlistService = {
  /**
   * Get all wishlist items
   */
  async getWishlist() {
    return apiClient.get('/wishlist/');
  },

  /**
   * Add a product to wishlist
   */
  async addToWishlist(productId) {
    return apiClient.post('/wishlist/', { product_id: productId });
  },

  /**
   * Remove a product from wishlist
   */
  async removeFromWishlist(productId) {
    return apiClient.delete(`/wishlist/${productId}/`);
  },

  /**
   * Check if a product is in wishlist
   */
  async checkWishlistStatus(productId) {
    return apiClient.get(`/wishlist/${productId}/status/`);
  },

  /**
   * Clear wishlist
   */
  async clearWishlist() {
    return apiClient.delete('/wishlist/clear/');
  }
};
