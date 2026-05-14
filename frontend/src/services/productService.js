import api from './api.js';

export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return data;
}

export async function searchProducts(params = {}) {
  const { data } = await api.get('/products/search', { params });
  return data;
}

export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function getSellerProducts() {
  const { data } = await api.get('/products/seller');
  return data;
}

export async function createProduct(formData) {
  const { data } = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function updateProduct(id, formData) {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
