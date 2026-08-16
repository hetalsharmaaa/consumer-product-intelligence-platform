import apiClient from './apiClient';

export const brandService = {
  /**
   * Get all brands
   */
  async getBrands(params = {}) {
    return apiClient.get('/brands/', { params });
  },

  /**
   * Get a specific brand by name or ID
   */
  async getBrand(identifier) {
    return apiClient.get(`/brands/${encodeURIComponent(identifier)}/`);
  },

  /**
   * Get brand statistics
   */
  async getBrandStats(identifier) {
    return apiClient.get(`/brands/${encodeURIComponent(identifier)}/stats/`);
  },

  /**
   * Get products by brand
   */
  async getBrandProducts(identifier) {
    return apiClient.get(`/brands/${encodeURIComponent(identifier)}/products/`);
  }
};
