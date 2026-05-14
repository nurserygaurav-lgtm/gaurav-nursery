import axios from 'axios';
import env from '../config/env.js';

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gaurav_nursery_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
