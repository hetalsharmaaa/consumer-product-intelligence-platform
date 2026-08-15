import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function getProducts() {
  const { data } = await api.get('/');
  return data.products || [];
}
export async function searchProducts(query) {
  const { data } = await api.get('/search/', { params: { q: query } });
  return data.products || [];
}
export async function smartSearch(query) {
  const { data } = await api.get('/smart-search/', { params: { q: query } });
  return data.products || [];
}
export async function getProduct(id) {
  const { data } = await api.get(`/${id}/`);
  return data;
}
export async function getProductByBarcode(barcode) {
  const { data } = await api.get(`/barcode/${encodeURIComponent(barcode)}/`);
  return data;
}
export async function compareProducts(ids, priority = '') {
  const { data } = await api.get('/compare/', { params: { ids: ids.join(','), priority } });
  return data;
}
export async function analyzeIngredients(id) {
  const { data } = await api.get(`/${id}/ingredients/`);
  return data;
}
export async function aiCompareProducts(ids, priority = '') {
  const { data } = await api.get('/ai/compare/', { params: { ids: ids.join(','), priority } });
  return data;
}
export async function getAlternatives(id, preference = '') {
  const { data } = await api.get(`/ai/alternatives/${id}/`, { params: { preference } });
  return data;
}
export async function chatWithAI(question, productId = null, history = []) {
  const { data } = await api.post('/ai/chat/', { question, product_id: productId, history });
  return data;
}
export async function scanBarcodeImage(file) {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post('/ai/image-recognition/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function registerUser(name, email, password) {
  const { data } = await api.post('/auth/register/', {
    username: name.trim().replace(/\s+/g, '_').toLowerCase(),
    email: email.trim(),
    password,
  });
  return data;
}
export async function loginUser(email, password) {
  const { data } = await api.post('/auth/login/', { email: email.trim(), password });
  return data;
}
export async function getProfile() {
  const { data } = await api.get('/auth/profile/');
  return data;
}

export async function getWishlist() {
  const { data } = await api.get('/wishlist/');
  return data;
}
export async function addWishlist(productId) {
  const { data } = await api.post('/wishlist/add/', { product_id: productId });
  return data;
}
export async function removeWishlist(productId) {
  const { data } = await api.delete(`/wishlist/remove/${productId}/`);
  return data;
}
export async function clearWishlist() {
  const { data } = await api.delete('/wishlist/clear/');
  return data;
}

export async function getSearchHistory() {
  const { data } = await api.get('/search-history/');
  return data.search_history || [];
}
export async function clearSearchHistory() {
  const { data } = await api.delete('/search-history/clear/');
  return data;
}
export async function deleteSearchHistory(id) {
  const { data } = await api.delete(`/search-history/${id}/delete/`);
  return data;
}

export async function getRecommendations() {
  const { data } = await api.get('/recommendations/');
  return data;
}
export async function getBrands() {
  const { data } = await api.get('/brands/');
  return data.brands || [];
}
export async function getBrand(id) {
  const { data } = await api.get(`/brands/${id}/`);
  return data;
}
export async function getBrandProducts(id) {
  const { data } = await api.get(`/brands/${id}/products/`);
  return data.products || [];
}

export async function getReviewsByProductId(productId) {
  const { data } = await api.get(`/reviews/product/${productId}/`);
  return data.reviews || [];
}
export async function submitReview(productId, reviewData) {
  const { data } = await api.post(`/reviews/product/${productId}/add/`, reviewData);
  return data;
}
export async function updateReview(id, reviewData) {
  const { data } = await api.patch(`/reviews/${id}/update/`, reviewData);
  return data;
}
export async function deleteReview(id) {
  const { data } = await api.delete(`/reviews/${id}/delete/`);
  return data;
}

export async function getCategories() {
  const products = await getProducts();
  return [...new Set(products.map(p => p.category).filter(Boolean))].sort();
}
export async function getFeaturedProducts() {
  return (await getProducts()).filter(p => Number(p.rating) >= 4.5).slice(0, 8);
}
export async function getTrendingProducts() {
  return (await getProducts()).slice(0, 8);
}
export async function getSimilarProducts(productId, limit = 4) {
  const product = await getProduct(productId);
  if (!product) return [];
  return (await getProducts()).filter(p => p.id !== product.id && p.category === product.category).slice(0, limit);
}

export default api;
