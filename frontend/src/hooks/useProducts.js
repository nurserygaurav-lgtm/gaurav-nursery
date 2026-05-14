import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService.js';

export function useProducts(params) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        const response = await getProducts(params);
        if (isMounted) setProducts(response.products || []);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Unable to load products');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [params]);

  return { products, isLoading, error };
}
