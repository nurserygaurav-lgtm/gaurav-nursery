import api from './api.js';

export async function createCodOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data;
}

export async function getMyOrders() {
  const { data } = await api.get('/orders/my-orders');
  return data;
}

export async function getOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

export async function getSellerOrders() {
  const { data } = await api.get('/orders/seller');
  return data;
}

export async function getAllOrders() {
  const { data } = await api.get('/orders');
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
}
