// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const institutionService = {
  create: (data) => apiClient.post('/institutions', data),
  update: (id, data) => apiClient.put(`/institutions/${id}`, data),
  get: (id) => apiClient.get(`/institutions/${id}`),
  list: (params) => apiClient.get('/institutions', { params }),
  delete: (id) => apiClient.delete(`/institutions/${id}`),
  uploadDocument: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/institutions/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Progress Tracking Middleware
const withProgress = (promise, onProgress) => {
  return promise.then(response => {
    onProgress && onProgress(100);
    return response;
  }).catch(error => {
    onProgress && onProgress(0);
    throw error;
  });
};