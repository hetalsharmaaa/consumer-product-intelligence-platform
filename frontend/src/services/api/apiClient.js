import axios from 'axios';

// Create an Axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      // Optionally redirect to login, but usually handled by AuthContext
    }
    
    // Format error message to be standard across the app
    const customError = new Error(
      error.response?.data?.message || 
      error.response?.data?.detail || 
      error.message || 
      'An unexpected error occurred'
    );
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    customError.originalError = error;
    
    return Promise.reject(customError);
  }
);

export default apiClient;
