import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  CheckCircle2,
  Droplets,
  Heart,
  Leaf,
  MessageCircle,
  Ruler,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  SunMedium,
  Truck
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { brandContact, trustFeatures } from '../../data/brandContent.js';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProductById, getProducts } from '../../services/productService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle, getSellerName, handleImageError, FALLBACK_PLANT_IMAGE } from '../../utils/product.js';

import { safeLocalStorageGet, safeLocalStorageSet } from '../../utils/storage.js';

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-[#dbe8d8] bg-white shadow-soft">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-black text-[#0b3d1e]">{item.question}</span>
        <span className="rounded-full bg-[#f1faf1] px-3 py-1 text-xs font-black text-[#2f5f34]">{isOpen ? 'Hide' : 'Read'}</span>
      </button>
      {isOpen && <div className="border-t border-[#edf5ea] px-5 py-4 text-sm leading-7 text-stone-600">{item.answer}</div>}
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [deliveryMeta, setDeliveryMeta] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const productId = product?._id || id;

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
      const current = JSON.parse(safeLocalStorageGet('recentlyViewedProducts') || '[]');
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
      safeLocalStorageSet('recentlyViewedProducts', JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  }, [product]);

  async function handleAddToCart() {
    if (!productId) {
      showToast('Product is still loading, please try again.', 'error');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${productId}` } } });
      return;
    }

    try {
      await addToCart(productId, quantity);
      showToast('Added to cart');
    } catch (err) {
      showToast(getApiError(err, 'Unable to add to cart'), 'error');
    }
  }

  async function handleWishlist() {
    if (!productId) {
      showToast('Product is still loading, please try again.', 'error');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToWishlist(productId);
      showToast('Saved to wishlist');
    } catch (err) {
      showToast(getApiError(err, 'Unable to update wishlist'), 'error');
    }
  }

  async function handleBuyNow() {
    if (!productId) {
      showToast('Product is still loading, please try again.', 'error');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${productId}` } } });
      return;
    }

    try {
      await addToCart(productId, quantity);
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
      // ignore cancellations
    }
  }

  function handlePincodeCheck(event) {
    event.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setDeliveryMessage('Enter a valid 6 digit pincode');
      setDeliveryMeta(null);
      return;
    }

    const number = Number(pincode.slice(-1));
    const days = Number(product?.deliveryDays || 4) + (number % 2);
    const codAvailable = product?.codAvailable === false ? 'not available' : 'available';
    setDeliveryMessage(`Delivery available in ${days}-${days + 2} days.`);
    setDeliveryMeta({ codAvailable, days });
  }

  const gallery = useMemo(() => [getProductImage(product), ...(product?.images || []).map((image) => image.url)].filter(Boolean), [product]);
  const sellingPrice = Number(product?.offerPrice || product?.price || 0);
  const mrp = Number(product?.price || 0);
  const productFaqs = [
    { question: 'If plant arrives damaged?', answer: 'Please contact support with order details and photos. We review damaged-arrival cases for replacement support.' },
    { question: 'Delivery time?', answer: 'Delivery time depends on your pincode and stock location. Use the checker for an estimated window.' },
    { question: 'COD available?', answer: product?.codAvailable === false ? 'COD is currently unavailable for this product.' : 'COD is available for eligible pincodes.' },
    { question: 'How are plants packed?', answer: 'Roots are secured, plants are wrapped, cushioned, and boxed to reduce transport stress.' },
    { question: 'Indoor plant care?', answer: 'Most indoor plants prefer bright indirect light, measured watering, and occasional feeding.' },
    { question: 'Replacement policy?', answer: 'Damaged arrivals can be reviewed by support for replacement guidance.' },
    { question: 'Return policy?', answer: 'Because live plants are delicate, returns are handled case by case through support.' }
  ];

  const careItems = [
    { icon: SunMedium, label: 'Sunlight', value: product?.care?.sunlight || product?.sunlight || 'Bright indirect sunlight' },
    { icon: Droplets, label: 'Watering', value: product?.care?.watering || product?.waterLevel || 'Water when top soil feels dry' },
    { icon: Leaf, label: 'Indoor/Outdoor', value: product?.care?.placement || ((product?.category || '').toLowerCase().includes('outdoor') ? 'Outdoor' : 'Indoor friendly') },
    { icon: Box, label: 'Pot Size', value: product?.care?.potSize || 'Standard nursery pot' },
    { icon: Ruler, label: 'Height', value: product?.care?.height || 'Nursery grown healthy plant' },
    { icon: Sprout, label: 'Fertilizer', value: product?.care?.fertilizer || 'Organic fertilizer monthly' },
    { icon: ShieldCheck, label: 'Pet Safety', value: product?.care?.petSafety || 'Check species-specific safety before placing near pets' },
    { icon: Truck, label: 'Delivery Notes', value: product?.care?.deliveryNotes || 'Packed carefully for live arrival' }
  ];
  const whatsInTheBox = product?.packageIncludes?.length
    ? product.packageIncludes
    : [
        '1 healthy plant',
        '1 nursery pot',
        '1 plant care guide card'
      ];
  const packagingPromise = product?.packagingNote || 'Safe packaging guarantee: cushioned, root-secured, and ready for transit.';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: getProductTitle(product),
    image: gallery,
    description: product?.seo?.metaDescription || product?.description,
    category: product?.category,
    brand: {
      '@type': 'Brand',
      name: 'Gaurav Nursery'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: sellingPrice,
      availability: product?.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 lg:px-8">
        <Skeleton className="aspect-square rounded-[2rem]" />
        <Skeleton className="min-h-[24rem] rounded-[2rem] md:min-h-[28rem]" />
      </section>
    );
  }

  if (error || !product) {
    return <p className="mx-auto mt-10 max-w-3xl rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error || 'Product not found'}</p>;
  }

  return (
    <section className="premium-container py-8 pb-28">
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.92fr)] xl:gap-8">
        <div>
          <div className="group overflow-hidden rounded-[2rem] bg-white shadow-soft">
            <img
              className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
              src={selectedImage || getProductImage(product)}
              alt={product?.seo?.altText || getProductTitle(product)}
              loading="lazy"
              decoding="async"
              onError={(e) => handleImageError(e, FALLBACK_PLANT_IMAGE)}
            />
          </div>

          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
              {gallery.slice(0, 5).map((image) => (
                <button key={image} className={`overflow-hidden rounded-xl border-2 bg-white ${selectedImage === image ? 'border-[#0b3d1e]' : 'border-transparent'}`} onClick={() => setSelectedImage(image)} type="button">
                  <img
                    className="aspect-square w-full object-cover"
                    src={image}
                    alt={getProductTitle(product)}
                    onError={(e) => handleImageError(e, FALLBACK_PLANT_IMAGE)}
                  />

                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#4caf50]">{product.subcategory || product.category}</p>
          <h1 className="mt-2 text-[clamp(1.9rem,3.5vw,3.5rem)] font-black text-[#0b3d1e]">{getProductTitle(product)}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-bold text-stone-600">
            <Link className="rounded-full bg-[#f1faf1] px-3 py-1 text-[#0b3d1e] transition hover:bg-[#e2f3df]" to={`/shop?seller=${encodeURIComponent(getSellerName(product))}`}>
              Sold by {getSellerName(product)}
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f1faf1] px-3 py-1 text-[#2f5f34]">
              <ShieldCheck size={15} /> Trusted nursery supply
            </span>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-white p-4 shadow-soft sm:p-5">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-4xl font-black text-[#0b3d1e]">{formatCurrency(sellingPrice)}</p>
              {product.offerPrice && <p className="pb-1 text-lg font-bold text-stone-400 line-through">{formatCurrency(mrp)}</p>}
              {product.offerPrice && <span className="mb-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{Math.round(((mrp - sellingPrice) / mrp) * 100)}% OFF</span>}
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-600">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'} | {product.codAvailable === false ? 'Prepaid only' : 'COD available for eligible pincodes'}</p>
          </div>

          <p className="mt-6 leading-7 text-stone-600">{product.description}</p>
          {product.benefits && <p className="mt-3 rounded-[1.5rem] bg-[#f7fff5] p-4 text-sm font-semibold leading-6 text-[#0b3d1e]">{product.benefits}</p>}

          <form className="mt-6 rounded-[1.5rem] border border-[#dbe8d8] bg-white p-4 shadow-soft" onSubmit={handlePincodeCheck}>
            <label className="text-sm font-black text-[#0b3d1e]">Check Delivery Availability</label>
            <div className="mt-3 flex gap-2">
              <input className="form-input" maxLength={6} onChange={(event) => setPincode(event.target.value)} placeholder="Enter pincode" value={pincode} />
              <Button type="submit" variant="outline">Check</Button>
            </div>
            {deliveryMessage && (
              <div className="mt-3 rounded-2xl bg-[#f7fff5] p-4 text-sm font-bold text-[#0b3d1e]">
                <div className="flex items-center gap-2"><CheckCircle2 size={17} /> {deliveryMessage}</div>
                {deliveryMeta && <p className="mt-2 text-stone-600">COD {deliveryMeta.codAvailable} | Estimated days: {deliveryMeta.days}-{deliveryMeta.days + 2}</p>}
              </div>
            )}
          </form>

          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <input className="form-input w-full sm:w-24" min="1" max={product.stock} onChange={(event) => setQuantity(Number(event.target.value))} type="number" value={quantity} />
            <Button disabled={!product.stock} onClick={handleAddToCart}><ShoppingCart className="mr-2" size={18} /> Add to Cart</Button>
            <Button disabled={!product.stock} onClick={handleBuyNow} variant="secondary">Buy Now</Button>
            <Button variant="outline" onClick={handleWishlist}><Heart className="mr-2" size={18} /> Wishlist</Button>
            <Button variant="outline" onClick={handleShare}><Share2 className="mr-2" size={18} /> Share</Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#f1faf1] px-3 py-2 text-sm font-black text-[#2f5f34]">Live healthy plant</span>
            <span className="rounded-full bg-[#f1faf1] px-3 py-2 text-sm font-black text-[#2f5f34]">Safe packaging</span>
            <span className="rounded-full bg-[#f1faf1] px-3 py-2 text-sm font-black text-[#2f5f34]">Replacement support</span>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-[#dbe8d8] bg-[#f7fff5] p-5 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4caf50]">Safe Packaging Guarantee</p>
            <p className="mt-2 text-sm leading-7 text-stone-600">{packagingPromise}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-[clamp(1.4rem,2.4vw,2rem)] font-black text-[#0b3d1e]">Plant Care Guide</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {careItems.map((item) => (
              <div key={item.label} className="rounded-[1.5rem] bg-[#f7fff5] p-4">
                <item.icon className="text-[#4caf50]" size={22} />
                <p className="mt-3 text-sm font-black text-[#0b3d1e]">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-stone-600">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4caf50]">What&apos;s in the box</p>
          <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,2rem)] font-black text-[#0b3d1e]">Clear package contents</h2>
          <div className="mt-5 grid gap-3">
            {whatsInTheBox.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[1.25rem] border border-[#e5f0e0] bg-[#f7fff5] px-4 py-3">
                <CheckCircle2 size={18} className="text-[#4caf50]" />
                <span className="text-sm font-semibold text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#0b3d1e] p-5 text-white shadow-soft sm:p-6">
          <h2 className="text-2xl font-black">Need plant help?</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">Chat with Gaurav Nursery for care guidance, order questions, or bulk nursery delivery.</p>
          <a className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[#25d366] px-5 text-sm font-black text-white" href={`https://wa.me/${brandContact.whatsappPhone}?text=${encodeURIComponent(brandContact.whatsappMessage)}`} rel="noreferrer" target="_blank">
            <MessageCircle className="mr-2" size={18} /> WhatsApp Support
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-[clamp(1.4rem,2.4vw,2rem)] font-black text-[#0b3d1e]">FAQ</h2>
          <div className="mt-4 grid gap-3">
            {productFaqs.map((item, index) => (
              <AccordionItem key={item.question} item={item} isOpen={openFaq === index} onToggle={() => setOpenFaq((current) => (current === index ? -1 : index))} />
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-[clamp(1.4rem,2.4vw,2rem)] font-black text-[#0b3d1e]">Trust Signals</h2>
          <div className="mt-4 grid gap-3">
            {trustFeatures.slice(0, 4).map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-[1.35rem] border border-[#e8f6ec] bg-[#f7fff5] p-4">
                <span className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#0b3d1e] text-white">
                  <item.icon size={18} />
                </span>
                <div>
                  <p className="font-black text-[#0b3d1e]">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!!relatedProducts.length && (
        <div className="mt-10">
          <h2 className="text-[clamp(1.4rem,2.4vw,2rem)] font-black text-[#0b3d1e]">Related Products</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <a key={item._id} className="rounded-[1.5rem] bg-white p-3 shadow-soft transition hover:-translate-y-1" href={`/products/${item._id}`}>
                <img className="aspect-square rounded-xl object-cover" src={getProductImage(item)} alt={getProductTitle(item)} onError={handleImageError} />
                <p className="mt-3 line-clamp-2 font-black text-[#0b3d1e]">{getProductTitle(item)}</p>
                <p className="mt-1 font-black text-[#2f5f34]">{formatCurrency(item.offerPrice || item.price)}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-3 border-t border-[#dbe8d8] bg-white/95 p-3 shadow-card backdrop-blur lg:hidden">
        <Button disabled={!product.stock} onClick={handleAddToCart} variant="outline"><ShoppingCart className="mr-2" size={18} /> Cart</Button>
        <Button disabled={!product.stock} onClick={handleBuyNow}>Buy Now</Button>
      </div>
    </section>
  );
}
