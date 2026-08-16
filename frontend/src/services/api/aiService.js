import apiClient from './apiClient';

export const aiService = {
  /**
   * Send a message to the AI chatbot
   */
  async chatWithAI(question, productId = null, history = []) {
    return apiClient.post('/ai/chat/', { question, product_id: productId, history });
  },

  /**
   * Scan barcode from image
   */
  async scanBarcodeImage(file) {
    const form = new FormData();
    form.append('image', file);
    return apiClient.post('/ai/image-recognition/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Compare products using AI
   */
  async aiCompareProducts(ids, priority = '') {
    return apiClient.get('/ai/compare/', { params: { ids: ids.join(','), priority } });
  },

  /**
   * Get Alternatives using AI
   */
  async getAlternatives(id, preference = '') {
    return apiClient.get(`/ai/alternatives/${id}/`, { params: { preference } });
  }
};
