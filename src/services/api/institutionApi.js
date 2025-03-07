// src/services/api/institutionApi.js
import axios from 'axios';
import { handleApiError } from '@/utils/error/errorHandler';

// Use Vite environment variable format
const API_URL = import.meta.env.VITE_API_URL;

export const institutionApi = {
  create: async (institutionData) => {
    try {
      const response = await axios.post(`${API_URL}/api/institutions`, institutionData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Other API methods...
  get: (id) => axios.get(`${API_URL}/api/institutions/${id}`),
  update: (id, data) => axios.put(`${API_URL}/api/institutions/${id}`, data),
  list: () => axios.get(`${API_URL}/api/institutions`)
};