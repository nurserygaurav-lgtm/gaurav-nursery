import api from './api.js';

let sellerDashboardCache = null;
let sellerDashboardCacheAt = 0;
const CACHE_TTL_MS = 15000;

export async function getSellerDashboard({ force = false } = {}) {
  if (!force && sellerDashboardCache && Date.now() - sellerDashboardCacheAt < CACHE_TTL_MS) {
    return sellerDashboardCache;
  }

  const { data } = await api.get('/dashboard/seller');
  sellerDashboardCache = data;
  sellerDashboardCacheAt = Date.now();
  return data;
}

export function clearSellerDashboardCache() {
  sellerDashboardCache = null;
  sellerDashboardCacheAt = 0;
}
