import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests that need authentication
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const accommodationService = {
  // Search accommodations with filters
  searchAccommodations: async (params) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add search term
      if (params.searchTerm) {
        queryParams.append('search', params.searchTerm);
      }
      
      // Add price range
      if (typeof params.min_price === 'number') {
        queryParams.append('min_price', params.min_price);
      }
      if (typeof params.max_price === 'number') {
        queryParams.append('max_price', params.max_price);
      }
      
      // Add accessibility filters
      if (params.accessibility) {
        queryParams.append('accessibility', JSON.stringify(params.accessibility));
      }
      
      // Add type filters
      if (params.type) {
        queryParams.append('type', JSON.stringify(params.type));
      }
      
      // Add pagination
      if (params.page) {
        queryParams.append('page', params.page);
      }
      if (params.per_page) {
        queryParams.append('per_page', params.per_page);
      }
      
      const response = await apiClient.get(`/api/accommodations?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching accommodations:', error);
      throw error.response?.data?.error || 'Failed to search accommodations';
    }
  },

  // Get accommodation details
  getAccommodation: async (id) => {
    try {
      const response = await apiClient.get(`/api/accommodations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting accommodation:', error);
      throw error.response?.data?.error || 'Failed to get accommodation details';
    }
  }
};
