import api from './api.js';

export async function getSellerDashboard() {
  const { data } = await api.get('/dashboard/seller');
  return data;
}
