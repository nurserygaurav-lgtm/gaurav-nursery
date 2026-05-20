export const FALLBACK_PLANT_IMAGE = 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80';

export function getProductTitle(product) {
  return product?.title || product?.name || 'Untitled product';
}

export function getProductImage(product) {
  return product?.images?.[0]?.url || product?.image || FALLBACK_PLANT_IMAGE;
}

export function getSellerName(product) {
  return product?.seller?.sellerProfile?.shopName || product?.seller?.name || product?.sellerName || 'Gaurav Nursery Seller';
}

export function handleImageError(event, fallback = FALLBACK_PLANT_IMAGE) {
  if (event.currentTarget.src === fallback) return;
  event.currentTarget.src = fallback;
}
