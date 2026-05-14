import { useCallback, useEffect, useState } from 'react';
import { getSellerProducts } from '../services/productService.js';
import { getApiError } from '../utils/auth.js';

export function useSellerProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getSellerProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(getApiError(err, 'Unable to load seller products'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, setProducts, isLoading, error, reload: loadProducts };
}
