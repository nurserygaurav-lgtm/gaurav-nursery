import { Droplets, Heart, Leaf, MessageCircle, Ruler, Share2, ShieldCheck, ShoppingCart, Sprout, Star, SunMedium, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProductById, getProducts } from '../../services/productService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle, getSellerName, handleImageError } from '../../utils/product.js';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
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
        if (isMounted) {
          setProduct(data.product);
          setSelectedImage(getProductImage(data.product));
        }
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

  useEffect(() => {
    if (!product?.category) return;
    let isMounted = true;

    async function loadRelatedProducts() {
      try {
        const data = await getProducts({ category: product.category, limit: 5 });
        if (isMounted) setRelatedProducts((data.products || []).filter((item) => item._id !== product._id).slice(0, 4));
      } catch {
        if (isMounted) setRelatedProducts([]);
      }
    }

    loadRelatedProducts();
    return () => {
      isMounted = false;
    };
  }, [product]);

  useEffect(() => {
    if (!product?._id) return;
    try {
      const current = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
      const nextProduct = {
        _id: product._id,
        name: getProductTitle(product),
        title: getProductTitle(product),
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: getProductImage(product),
        images: product.images
      };
      const next = [nextProduct, ...(Array.isArray(current) ? current.filter((item) => item._id !== product._id) : [])].slice(0, 8);
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(next));
    } catch {
      // Recently viewed is a progressive enhancement; ignore storage failures.
    }
  }, [product]);

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

  async function handleShare() {
    const shareData = {
      title: getProductTitle(product),
      text: product.description,
      url: window.location.href
    };

    try {
      if (window.navigator.share) {
        await window.navigator.share(shareData);
      } else {
        await window.navigator.clipboard.writeText(window.location.href);
        showToast('Product link copied');
      }
    } catch {
      // Share cancellation does not need an error toast.
    }
  }

  function handlePincodeCheck(event) {
    event.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setDeliveryMessage('Enter a valid 6 digit pincode');
      return;
    }
    const days = Number(product.deliveryDays || 5);
    setDeliveryMessage(`Delivery available in ${days}-${days + 2} days. COD ${product.codAvailable === false ? 'not available' : 'available'}.`);
  }

  if (isLoading) {
    return (
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 lg:px-8">
        <Skeleton className="aspect-square" />
        <Skeleton className="min-h-[24rem] md:min-h-[28rem]" />
      </section>
    );
  }

  if (error || !product) {
    return <p className="mx-auto mt-10 max-w-3xl rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error || 'Product not found'}</p>;
  }

  const gallery = [getProductImage(product), ...(product.images || []).map((image) => image.url)].filter(Boolean);
  const sellingPrice = Number(product.offerPrice || product.price || 0);
  const mrp = Number(product.price || 0);
  const careCards = [
    { icon: SunMedium, label: 'Sunlight', value: product.care?.sunlight || 'Bright indirect sunlight' },
    { icon: Droplets, label: 'Watering', value: product.care?.watering || 'Water when top soil feels dry' },
    { icon: Sprout, label: 'Fertilizer', value: product.care?.fertilizer || 'Organic fertilizer monthly' },
    { icon: Ruler, label: 'Plant Height', value: product.care?.height || 'Nursery grown healthy plant' },
    { icon: Leaf, label: 'Pot Size', value: product.care?.potSize || 'Standard nursery pot' },
    { icon: ShieldCheck, label: 'Care Difficulty', value: product.care?.difficulty || 'Easy' }
  ];
  const faqs = [
    ['Is this plant healthy on arrival?', 'Yes, each plant is checked, packed securely, and shipped with a live arrival focus.'],
    ['Can I pay with COD?', product.codAvailable === false ? 'COD is currently unavailable for this product.' : 'Yes, COD is available for eligible pincodes.'],
    ['What if I need care help?', 'You can contact Gaurav Nursery on WhatsApp for watering, sunlight, and fertilizer guidance.']
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: getProductTitle(product),
    image: gallery,
    description: product.seo?.metaDescription || product.description,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Gaurav Nursery'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: sellingPrice,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6 lg:px-8">
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)] xl:gap-8">
        <div>
          <div className="group overflow-hidden rounded-2xl bg-leaf-50 shadow-soft">
            <img className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110" src={selectedImage || getProductImage(product)} alt={product.seo?.altText || getProductTitle(product)} loading="lazy" decoding="async" onError={handleImageError} />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
              {gallery.slice(0, 5).map((image) => (
                <button key={image} className={`overflow-hidden rounded-xl border-2 bg-leaf-50 ${selectedImage === image ? 'border-leaf-700' : 'border-transparent'}`} onClick={() => setSelectedImage(image)} type="button">
                  <img className="aspect-square w-full object-cover" src={image} alt={getProductTitle(product)} onError={handleImageError} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-leaf-600">{product.subcategory || product.category}</p>
          <h1 className="mt-2 text-[clamp(1.9rem,3.5vw,3.5rem)] font-black text-leaf-950">{getProductTitle(product)}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-bold text-stone-600">
            <span>Sold by {getSellerName(product)}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
              <Star size={15} fill="currentColor" /> {product.ratingAverage || '4.8'} ({product.ratingCount || 24} reviews)
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-4 shadow-soft sm:p-5">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-4xl font-black text-leaf-950">{formatCurrency(sellingPrice)}</p>
              {product.offerPrice && <p className="pb-1 text-lg font-bold text-stone-400 line-through">{formatCurrency(mrp)}</p>}
              {product.offerPrice && <span className="mb-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{Math.round(((mrp - sellingPrice) / mrp) * 100)}% OFF</span>}
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-600">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'} | {product.codAvailable === false ? 'Prepaid only' : 'COD available'}</p>
          </div>

          <p className="mt-6 leading-7 text-stone-600">{product.description}</p>
          {product.benefits && <p className="mt-3 rounded-2xl bg-leaf-50 p-4 text-sm font-semibold leading-6 text-leaf-900">{product.benefits}</p>}

          {!!product.variants?.length && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-black text-leaf-950">Variants</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => <span key={variant.label} className="rounded-full border border-leaf-200 px-4 py-2 text-sm font-bold text-leaf-900">{variant.label}</span>)}
              </div>
            </div>
          )}

          <form className="mt-6 rounded-2xl border border-leaf-100 bg-white p-4 shadow-soft" onSubmit={handlePincodeCheck}>
            <label className="text-sm font-black text-leaf-950">Check delivery estimate</label>
            <div className="mt-3 flex gap-2">
              <input className="form-input" maxLength={6} onChange={(event) => setPincode(event.target.value)} placeholder="Enter pincode" value={pincode} />
              <Button type="submit" variant="outline">Check</Button>
            </div>
            {deliveryMessage && <p className="mt-3 flex items-center gap-2 text-sm font-bold text-leaf-800"><Truck size={17} /> {deliveryMessage}</p>}
          </form>

          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <input className="form-input w-full sm:w-24" min="1" max={product.stock} onChange={(event) => setQuantity(Number(event.target.value))} type="number" value={quantity} />
            <Button disabled={!product.stock} onClick={handleAddToCart}><ShoppingCart className="mr-2" size={18} /> Add to Cart</Button>
            <Button disabled={!product.stock} onClick={handleBuyNow} variant="secondary">Buy Now</Button>
            <Button variant="outline" onClick={handleWishlist}><Heart className="mr-2" size={18} /> Wishlist</Button>
            <Button variant="outline" onClick={handleShare}><Share2 className="mr-2" size={18} /> Share</Button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-[clamp(1.4rem,2.4vw,2rem)] font-black text-leaf-950">Plant Care Guide</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careCards.map((item) => (
              <div key={item.label} className="rounded-2xl bg-leaf-50 p-4">
                <item.icon className="text-leaf-700" size={22} />
                <p className="mt-3 text-sm font-black text-leaf-950">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-stone-600">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-800">
            Air purification benefits: {product.care?.airPurification || 'Helps improve indoor freshness and brings a natural calm to your space.'}
          </div>
        </div>

        <div className="rounded-2xl bg-leaf-950 p-5 text-white shadow-soft sm:p-6">
          <h2 className="text-2xl font-black">Need plant help?</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">Chat with Gaurav Nursery for care guidance, order questions, or bulk nursery delivery.</p>
          <a className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[#25d366] px-5 text-sm font-black text-white" href="https://wa.me/916352031504" rel="noreferrer" target="_blank">
            <MessageCircle className="mr-2" size={18} /> WhatsApp Support
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-[clamp(1.4rem,2.4vw,2rem)] font-black text-leaf-950">FAQ</h2>
          <div className="mt-4 grid gap-3">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-2xl border border-leaf-100 p-4">
                <p className="font-black text-leaf-950">{question}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-[clamp(1.4rem,2.4vw,2rem)] font-black text-leaf-950">Ratings & Reviews</h2>
          <div className="mt-4 rounded-2xl bg-leaf-50 p-5">
            <div className="flex items-center gap-2 text-amber-500">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}</div>
            <p className="mt-3 font-black text-leaf-950">Healthy plant, excellent packaging</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">Reviews are shown from verified customer activity as your store receives orders.</p>
          </div>
        </div>
      </div>

      {!!relatedProducts.length && (
        <div className="mt-10">
          <h2 className="text-[clamp(1.4rem,2.4vw,2rem)] font-black text-leaf-950">Related Products</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <a key={item._id} className="rounded-2xl bg-white p-3 shadow-soft transition hover:-translate-y-1" href={`/products/${item._id}`}>
                <img className="aspect-square rounded-xl object-cover" src={getProductImage(item)} alt={getProductTitle(item)} onError={handleImageError} />
                <p className="mt-3 line-clamp-2 font-black text-leaf-950">{getProductTitle(item)}</p>
                <p className="mt-1 font-black text-leaf-800">{formatCurrency(item.offerPrice || item.price)}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-3 border-t border-leaf-100 bg-white/95 p-3 shadow-card backdrop-blur lg:hidden">
        <Button disabled={!product.stock} onClick={handleAddToCart} variant="outline"><ShoppingCart className="mr-2" size={18} /> Cart</Button>
        <Button disabled={!product.stock} onClick={handleBuyNow}>Buy Now</Button>
      </div>
    </section>
  );
}
