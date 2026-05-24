import api from './api.js';
import {
  safeCustomEvent,
  safeDispatchEvent,
  safeLocalStorageGet,
  safeLocalStorageSet
} from '../utils/storage.js';

export const WISHLIST_COUNT_STORAGE_KEY = 'gaurav_nursery_wishlist_count';

function getWishlistCountFromResponse(data) {
  if (Number.isFinite(data?.summary?.itemCount)) return data.summary.itemCount;
  if (Number.isFinite(data?.summary?.count)) return data.summary.count;
  if (Array.isArray(data?.wishlist?.products)) return data.wishlist.products.length;
  if (Array.isArray(data?.products)) return data.products.length;
  return 0;
}

export function readStoredWishlistCount() {
  const storedCount = Number(safeLocalStorageGet(WISHLIST_COUNT_STORAGE_KEY));
  return Number.isFinite(storedCount) ? storedCount : 0;
}

export function syncWishlistCountFromResponse(data) {
  const count = getWishlistCountFromResponse(data);
  safeLocalStorageSet(WISHLIST_COUNT_STORAGE_KEY, String(count));
  safeDispatchEvent(safeCustomEvent('wishlist-count-updated', { count }));
  return count;
}

export async function getWishlist() {
  const { data } = await api.get('/wishlist');
  syncWishlistCountFromResponse(data);
  return data;
}

export async function addToWishlist(productId) {
  const { data } = await api.post('/wishlist', { productId });
  syncWishlistCountFromResponse(data);
  return data;
}

export async function removeFromWishlist(productId) {
  const { data } = await api.delete(`/wishlist/${productId}`);
  syncWishlistCountFromResponse(data);
  return data;
}
