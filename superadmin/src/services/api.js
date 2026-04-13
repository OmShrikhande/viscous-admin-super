import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superadmin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // 401 → redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('superadmin_token');
      localStorage.removeItem('superadmin_user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Retry logic (1 retry for network errors)
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Service methods
const apiService = {
  get: (url, params) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  patch: (url, data) => api.patch(url, data),
  delete: (url) => api.delete(url),
  upload: (url, formData, onProgress) =>
    api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
};

export default apiService;
