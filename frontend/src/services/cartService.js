import api from './api.js';
import {
  safeCustomEvent,
  safeDispatchEvent,
  safeLocalStorageGet,
  safeLocalStorageSet
} from '../utils/storage.js';

export const CART_COUNT_STORAGE_KEY = 'gaurav_nursery_cart_count';

function getItemCountFromResponse(data) {
  if (Number.isFinite(data?.summary?.itemCount)) return data.summary.itemCount;
  if (Array.isArray(data?.cart?.items)) {
    return data.cart.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  }
  return 0;
}

export function readStoredCartCount() {
  const storedCount = Number(safeLocalStorageGet(CART_COUNT_STORAGE_KEY));
  return Number.isFinite(storedCount) ? storedCount : 0;
}

export function syncCartCountFromResponse(data) {
  const count = getItemCountFromResponse(data);
  safeLocalStorageSet(CART_COUNT_STORAGE_KEY, String(count));
  safeDispatchEvent(safeCustomEvent('cart-count-updated', { count }));
  return count;
}

export async function getCart() {
  const { data } = await api.get('/cart');
  syncCartCountFromResponse(data);
  return data;
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await api.post('/cart', { productId, quantity });
  syncCartCountFromResponse(data);
  return data;
}

export async function updateCartItem(productId, quantity) {
  const { data } = await api.put(`/cart/${productId}`, { quantity });
  syncCartCountFromResponse(data);
  return data;
}

export async function removeCartItem(productId) {
  const { data } = await api.delete(`/cart/${productId}`);
  syncCartCountFromResponse(data);
  return data;
}
