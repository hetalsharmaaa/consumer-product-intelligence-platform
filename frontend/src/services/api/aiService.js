import apiClient from './apiClient';

export const aiService = {
  /**
   * Send a message to the AI chatbot
   */
  async chat(message, context = {}) {
    return apiClient.post('/ai/chat/', { message, context });
  },

  /**
   * Analyze an ingredient list
   */
  async analyzeIngredients(ingredients) {
    return apiClient.post('/ai/analyze-ingredients/', { ingredients });
  },

  /**
   * Get an AI verdict comparing multiple products
   */
  async compareProducts(productIds) {
    return apiClient.post('/ai/compare/', { product_ids: productIds });
  }
};
