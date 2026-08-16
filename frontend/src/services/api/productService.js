import apiClient from './apiClient';

export const productService = {
  /**
   * Get all products with optional filters
   */
  async getProducts(params = {}) {
    return apiClient.get('/products/', { params });
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id) {
    return apiClient.get(`/products/${id}/`);
  },

  /**
   * Search products
   */
  async searchProducts(query) {
    return apiClient.get('/products/', { params: { search: query } });
  },

  /**
   * Get similar products
   */
  async getSimilarProducts(id, limit = 4) {
    return apiClient.get(`/products/${id}/similar/`, { params: { limit } });
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts() {
    return apiClient.get('/products/featured/');
  },

  /**
   * Get trending products
   */
  async getTrendingProducts() {
    return apiClient.get('/products/trending/');
  },

  /**
   * Get categories and their counts
   */
  async getCategories() {
    return apiClient.get('/products/categories/');
  }
};
