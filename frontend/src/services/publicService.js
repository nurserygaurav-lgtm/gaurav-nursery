import api from './api.js';

export async function getStoreSummary() {
  const { data } = await api.get('/public/summary');
  return data?.summary || {};
}
