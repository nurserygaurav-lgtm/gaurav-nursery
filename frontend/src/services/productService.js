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

export async function generateProductImages(payload) {
  const { data } = await api.post('/products/ai-images', payload);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

export async function bulkDeleteProducts(productIds) {
  const { data } = await api.delete('/products/bulk-delete', { data: { productIds } });
  return data;
}

// Admin-only: delete all products created today
export async function deleteTodayProducts() {
  const { data } = await api.delete('/products/delete-today-products');
  return data;
}

export async function bulkImportProducts(file, onUploadProgress) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });
  return data;
}

export async function downloadProductImportSample() {
  const { data } = await api.get('/products/import/sample', { responseType: 'blob' });
  return data;
}
