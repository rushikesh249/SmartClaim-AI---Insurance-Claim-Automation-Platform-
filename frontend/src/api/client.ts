import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For debugging in development
    if (import.meta.env.DEV) {
      console.log('API Method:', config.method?.toUpperCase());
      console.log('API URL:', `${config.baseURL || ''}${config.url || ''}`);
      if (config.data) {
        console.log('Request payload:', config.data);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 and log errors
client.interceptors.response.use(
  (response) => {
    // For debugging in development
    if (import.meta.env.DEV) {
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
    }
    return response;
  },
  (error) => {
    // Log error for debugging
    if (import.meta.env.DEV) {
      console.error('API Error Status:', error.response?.status);
      console.error('API Error Data:', error.response?.data);
    }
    
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default client;