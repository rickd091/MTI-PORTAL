// src/services/api/institutionApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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
      throw new Error(error.response?.data?.message || 'Failed to create institution');
    }
  },

  // Other API methods...
  get: (id) => axios.get(`${API_URL}/api/institutions/${id}`),
  update: (id, data) => axios.put(`${API_URL}/api/institutions/${id}`, data),
  list: () => axios.get(`${API_URL}/api/institutions`)
};