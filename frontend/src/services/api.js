import axios from 'axios';
import env from '../config/env.js';
import { safeLocalStorageGet, safeSessionStorageGet } from '../utils/storage.js';

const apiBaseUrl = `${env.apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 600000
});

api.interceptors.request.use((config) => {
  const token = safeLocalStorageGet('gaurav_nursery_token') || safeSessionStorageGet('gaurav_nursery_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
