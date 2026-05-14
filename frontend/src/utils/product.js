export function getProductTitle(product) {
  return product?.title || product?.name || 'Untitled product';
}

export function getProductImage(product) {
  return product?.images?.[0]?.url || product?.image || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80';
}

export function getSellerName(product) {
  return product?.seller?.sellerProfile?.shopName || product?.seller?.name || product?.sellerName || 'Gaurav Nursery Seller';
}
