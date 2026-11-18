/**
 * api.js — Pre-configured Axios instance.
 * All API calls across the app should use this instance.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ct_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle global errors (e.g. 401 redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale token on unauthorized
      localStorage.removeItem('ct_token');
      localStorage.removeItem('ct_user');
    }
    return Promise.reject(error);
  }
);

export default api;
