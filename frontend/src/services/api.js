import axios from 'axios';

// Axios instance
// Local: http://localhost:8000
// Production: Render backend URL from VITE_API_URL
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expired / unauthorized
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;

        case 403:
          console.error('Access forbidden');
          break;

        case 500:
          console.error('Server error');
          break;

        default:
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default api;