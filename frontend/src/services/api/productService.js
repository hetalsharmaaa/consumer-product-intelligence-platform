import apiClient from './apiClient';

export const productService = {
  /**
   * Get all products with optional filters
   */
  async getProducts(params = {}) {
    return apiClient.get('/', { params });
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id) {
    return apiClient.get(`/${id}/`);
  },

  /**
   * Search products
   */
  async searchProducts(query) {
    return apiClient.get('/search/', { params: { q: query } });
  },
  
  /**
   * Smart Search products
   */
  async smartSearch(query) {
    return apiClient.get('/smart-search/', { params: { q: query } });
  },

  /**
   * Get product by barcode
   */
  async getProductByBarcode(barcode) {
    return apiClient.get(`/barcode/${encodeURIComponent(barcode)}/`);
  },

  /**
   * Compare products
   */
  async compareProducts(ids, priority = '') {
    return apiClient.get('/compare/', { params: { ids: ids.join(','), priority } });
  },
  
  /**
   * Analyze ingredients
   */
  async analyzeIngredients(id) {
    return apiClient.get(`/${id}/ingredients/`);
  },

  /**
   * Get similar products (fallback if AI recommendation isn't available)
   */
  async getSimilarProducts(id, limit = 4) {
    return apiClient.get(`/${id}/similar/`, { params: { limit } });
  },

  /**
   * Get Categories (computed client-side from all products)
   */
  async getCategories() {
    const products = await this.getProducts();
    return [...new Set(products.map(p => p.category).filter(Boolean))].sort();
  },

  /**
   * Get Featured Products (computed client-side from all products)
   */
  async getFeaturedProducts() {
    const products = await this.getProducts();
    return products.filter(p => Number(p.rating) >= 4.5).slice(0, 8);
  },

  /**
   * Get Trending Products (computed client-side from all products)
   */
  async getTrendingProducts() {
    const products = await this.getProducts();
    return products.slice(0, 8);
  }
};
