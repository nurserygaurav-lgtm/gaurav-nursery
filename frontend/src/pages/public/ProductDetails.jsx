import { Heart, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProductById } from '../../services/productService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle, getSellerName } from '../../utils/product.js';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: product ? getProductTitle(product) : 'Product',
    description: product?.description || 'View premium plants and garden essentials at Gaurav Nursery.',
    image: product ? getProductImage(product) : '/brand.svg',
    type: 'product'
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        if (isMounted) setProduct(data.product);
      } catch (err) {
        if (isMounted) setError(getApiError(err, 'Unable to load product'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    try {
      await addToCart(id, quantity);
      showToast('Added to cart');
    } catch (err) {
      showToast(getApiError(err, 'Unable to add to cart'), 'error');
    }
  }

  async function handleWishlist() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToWishlist(id);
      showToast('Saved to wishlist');
    } catch (err) {
      showToast(getApiError(err, 'Unable to update wishlist'), 'error');
    }
  }

  async function handleBuyNow() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    try {
      await addToCart(id, quantity);
      navigate('/checkout');
    } catch (err) {
      showToast(getApiError(err, 'Unable to continue to checkout'), 'error');
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
        <Skeleton className="aspect-square" />
        <Skeleton className="h-96" />
      </section>
    );
  }

  if (error || !product) {
    return <p className="mx-auto mt-10 max-w-3xl rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error || 'Product not found'}</p>;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: getProductTitle(product),
    image: [getProductImage(product)],
    description: product.description,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Gaurav Nursery'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href
    }
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <div>
        <img className="aspect-square w-full rounded-lg object-cover shadow-soft" src={getProductImage(product)} alt={getProductTitle(product)} loading="lazy" decoding="async" />
        {!!product.images?.length && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.images.slice(0, 4).map((image) => (
              <img key={image.publicId || image.url} className="aspect-square rounded-lg object-cover" src={image.url} alt={getProductTitle(product)} />
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-leaf-600">{product.category}</p>
        <h1 className="mt-2 text-3xl font-black text-leaf-900">{getProductTitle(product)}</h1>
        <p className="mt-3 text-stone-600">Sold by {getSellerName(product)}</p>
        <p className="mt-6 text-3xl font-black text-leaf-900">{formatCurrency(product.price)}</p>
        <p className="mt-3 text-sm font-semibold text-stone-600">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <p className="mt-6 leading-7 text-stone-600">{product.description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <input
            className="form-input w-24"
            min="1"
            max={product.stock}
            onChange={(event) => setQuantity(Number(event.target.value))}
            type="number"
            value={quantity}
          />
          <Button disabled={!product.stock} onClick={handleAddToCart}>
            <ShoppingCart className="mr-2" size={18} />
            Add to Cart
          </Button>
          <Button disabled={!product.stock} onClick={handleBuyNow} variant="secondary">
            Buy Now
          </Button>
          <Button variant="outline" onClick={handleWishlist}>
            <Heart className="mr-2" size={18} />
            Wishlist
          </Button>
        </div>
      </div>
    </section>
  );
}
