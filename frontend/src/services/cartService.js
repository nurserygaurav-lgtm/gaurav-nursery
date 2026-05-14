import api from './api.js';

export async function getCart() {
  const { data } = await api.get('/cart');
  return data;
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await api.post('/cart', { productId, quantity });
  return data;
}

export async function updateCartItem(productId, quantity) {
  const { data } = await api.put(`/cart/${productId}`, { quantity });
  return data;
}

export async function removeCartItem(productId) {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
}
