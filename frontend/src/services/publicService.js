import api from './api.js';

export async function getStoreSummary() {
  try {
    const { data } = await api.get('/public/summary', { skipAuth: true });
    return data?.summary || {};
  } catch (error) {
    if (error?.response?.status === 401) {
      return {};
    }
    throw error;
  }
}
