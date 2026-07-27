import axios from 'axios';
import env from '../config/env.js';
import { safeLocalStorageGet, safeSessionStorageGet } from '../utils/storage.js';

const apiBaseUrl = `${env.apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000
});

api.interceptors.request.use((config) => {
  // Public endpoints must not inherit a stale browser token. Some backends reject
  // an invalid Authorization header before reaching their public route handler.
  if (config.skipAuth) {
    delete config.headers.Authorization;
    return config;
  }

  const token = safeLocalStorageGet('gaurav_nursery_token') || safeSessionStorageGet('gaurav_nursery_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
