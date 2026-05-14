import api from './api.js';

export async function createPaymentOrder() {
  const { data } = await api.post('/payments/create-order');
  return data;
}

export async function verifyPayment(payload) {
  const { data } = await api.post('/payments/verify', payload);
  return data;
}
