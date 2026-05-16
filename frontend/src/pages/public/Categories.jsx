import { ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { getProducts } from '../../services/productService.js';
import { getApiError } from '../../utils/auth.js';

const fallbackCategories = ['Indoor Plants', 'Flowering Plants', 'Fruit Plants', 'Seeds', 'Planters', 'Garden Tools'];

const categoryImages = [
  'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1524598171353-ce84a38e98ef?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=700&q=80'
];

export default function Categories() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getProducts({ page: 1, limit: 100 });
        if (isMounted) setProducts(data.products || []);
      } catch (err) {
        if (isMounted) setError(getApiError(err, 'Unable to load categories'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const names = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return (names.length ? names : fallbackCategories).map((name, index) => ({
      name,
      image: categoryImages[index % categoryImages.length],
      count: products.filter((product) => product.category === name).length
    }));
  }, [products]);

  return (
    <section className="premium-container py-10">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-600">Categories</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-leaf-950">Shop by Collection</h1>
      </div>

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
        </div>
      )}

      {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}

      {!isLoading && !error && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.name} className="group overflow-hidden rounded-[1.25rem] border border-leaf-100 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card" to={`/shop?category=${encodeURIComponent(category.name)}`}>
              <img className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" src={category.image} alt={category.name} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-leaf-950">{category.name}</h2>
                    <p className="mt-2 text-sm font-semibold text-stone-600">{category.count || 'Curated'} products for healthy garden growth.</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-900 transition group-hover:bg-leaf-900 group-hover:text-white">
                    <ArrowRight size={19} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
