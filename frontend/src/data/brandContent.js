import {
  AirVent,
  BadgeCheck,
  Box,
  Flower2,
  Leaf,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SunMedium,
  Truck,
  Waves
} from 'lucide-react';

export const brandContact = {
  name: 'Gaurav Nursery',
  address: 'Aliganj Bazar, Sultanpur, Uttar Pradesh',
  supportPhone: '+91 63520 31504',
  supportEmail: 'support@gauravnursery.online',
  whatsappPhone: '916352031504',
  whatsappMessage: 'Hi Gaurav Nursery, I need help selecting plants.'
};

export const trustFeatures = [
  { icon: Leaf, label: 'Live Healthy Plants', text: 'Nursery fresh selection checked before dispatch.' },
  { icon: Box, label: 'Safe Packaging', text: 'Root-secured and damage-protected for transit.' },
  { icon: Truck, label: 'Pan India Delivery', text: 'Reliable shipping with clear delivery estimates.' },
  { icon: Sparkles, label: 'Plant Care Support', text: 'Practical care guidance after purchase.' },
  { icon: RefreshCcw, label: 'Replacement Support', text: 'Quick help if the plant arrives damaged.' },
  { icon: ShieldCheck, label: 'Secure Payments', text: 'Trusted online payment and COD options.' },
  { icon: Smartphone, label: 'WhatsApp Help', text: 'Fast support on mobile for product selection.' },
  { icon: Flower2, label: 'Nursery Fresh Plants', text: 'Real stock, seasonal freshness, and careful sourcing.' }
];

export const packagingSteps = [
  'Healthy plant selected',
  'Roots secured',
  'Eco-safe wrapping',
  'Damage-protected boxing',
  'Fast dispatch'
];

export const safePackagingHighlights = [
  { icon: SunMedium, title: 'Live Arrival Guarantee', text: 'Packed to arrive healthy and ready to adapt.' },
  { icon: PackageCheck, title: 'Damage Protection', text: 'Sturdy boxing and cushioning reduce transit stress.' },
  { icon: Waves, title: 'Moisture Care', text: 'Moisture-aware packing keeps roots protected in transit.' },
  { icon: AirVent, title: 'Breathable Layers', text: 'Packaging allows plants to breathe during travel.' }
];

export const customerPlantGallery = [
  { city: 'Lucknow', plant: 'Snake Plant', message: 'Delivered safely and settled quickly.', image: 'https://images.unsplash.com/photo-1491143815639-1b0a1f7b4e64?auto=format&fit=crop&w=900&q=85' },
  { city: 'Delhi', plant: 'Money Plant', message: 'Thriving after 2 weeks at home.', image: 'https://images.unsplash.com/photo-1437750769465-301382cdf094?auto=format&fit=crop&w=900&q=85' },
  { city: 'Mumbai', plant: 'Areca Palm', message: 'Arrived fresh and beautifully packed.', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85' },
  { city: 'Pune', plant: 'Peace Lily', message: 'Loved the guidance and healthy roots.', image: 'https://images.unsplash.com/photo-1509423350716-97f2360af5e4?auto=format&fit=crop&w=900&q=85' },
  { city: 'Bangalore', plant: 'Tulsi', message: 'Great packaging and easy to repot.', image: 'https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&w=900&q=85' }
];

export const combos = [
  { title: 'Air Purifying Combo', subtitle: 'For fresher indoor air and easy care.', savings: 'Save up to 18%', href: '/shop?category=Air%20Purifying%20Plants' },
  { title: 'Balcony Garden Starter Kit', subtitle: 'Build a compact balcony garden fast.', savings: 'Bundle price', href: '/shop?search=balcony' },
  { title: 'Gift Plant Combo', subtitle: 'Elegant plants that are gift-ready.', savings: 'Best gifting value', href: '/shop?search=gift' },
  { title: 'Office Desk Combo', subtitle: 'Low maintenance plants for workspaces.', savings: 'Desk-friendly pack', href: '/shop?search=office' },
  { title: 'Fruit Plant Combo', subtitle: 'Add edible greenery to your home.', savings: 'Seasonal savings', href: '/shop?category=Fruit%20Plants' },
  { title: 'Flowering Combo', subtitle: 'Color-rich plants for balconies and patios.', savings: 'Popular bundle', href: '/shop?category=Flowering%20Plants' }
];

export const urgencySignals = ['Only 7 left', 'Recently purchased', 'Fast selling', 'Nursery fresh stock'];

export const recentDeliveryCities = ['Lucknow', 'Delhi', 'Mumbai', 'Pune', 'Bangalore'];

export const plantCareFaqs = [
  {
    question: 'If plant arrives damaged?',
    answer: 'Contact support with photos within the replacement window and we will help with a verified resolution.'
  },
  {
    question: 'Delivery time?',
    answer: 'Delivery time depends on location and stock, but product pages show a pincode-based estimate where available.'
  },
  {
    question: 'COD available?',
    answer: 'COD is available for eligible pincodes and selected products.'
  },
  {
    question: 'How are plants packed?',
    answer: 'Plants are root-secured, wrapped, cushioned, and boxed to reduce transport damage.'
  },
  {
    question: 'Indoor plant care?',
    answer: 'Most indoor plants prefer bright indirect light, measured watering, and periodic feeding.'
  },
  {
    question: 'Replacement policy?',
    answer: 'Damaged-arrival cases are handled through support review and replacement approval where applicable.'
  },
  {
    question: 'Return policy?',
    answer: 'Because live plants are delicate, returns are handled carefully and case by case through support.'
  }
];

export const shopFilters = {
  categories: [
    'Indoor',
    'Outdoor',
    'Air Purifying',
    'Pet Friendly',
    'Low Maintenance',
    'Low Light',
    'Flowering',
    'Fruit Plants',
    'Balcony Plants',
    'Office Plants',
    'Lucky Plants',
    'Medicinal Plants'
  ],
  sortOptions: ['Popular', 'Best Selling', 'New Arrivals', 'Price Low to High', 'Price High to Low']
};

export const blogCategories = [
  'Indoor Care',
  'Summer Care',
  'Balcony Gardening',
  'Fertilizer Tips',
  'Fruit Plant Care',
  'Monsoon Tips'
];

export const blogPosts = [
  {
    slug: 'how-to-save-tulsi-in-summer',
    title: 'How to Save Tulsi in Summer',
    category: 'Summer Care',
    excerpt: 'Practical shading, watering, and soil tips to keep Tulsi strong through heat.',
    image: 'https://images.unsplash.com/photo-1605146768827-6d6a4a0d3d36?auto=format&fit=crop&w=1200&q=85'
  },
  {
    slug: 'indoor-plant-care-routine',
    title: 'A Simple Indoor Plant Care Routine',
    category: 'Indoor Care',
    excerpt: 'A weekly routine for watering, wiping leaves, and checking light levels.',
    image: 'https://images.unsplash.com/photo-1444392061186-9fc38f84f726?auto=format&fit=crop&w=1200&q=85'
  },
  {
    slug: 'balcony-garden-beginners-guide',
    title: 'Balcony Gardening for Beginners',
    category: 'Balcony Gardening',
    excerpt: 'Start small with smart plant choices, planters, and drainage basics.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85'
  }
];

export const productCareFields = [
  { key: 'sunlight', label: 'Sunlight', icon: SunMedium },
  { key: 'watering', label: 'Watering', icon: Waves },
  { key: 'placement', label: 'Indoor/Outdoor', icon: Leaf },
  { key: 'temperature', label: 'Temperature', icon: BadgeCheck },
  { key: 'potSize', label: 'Pot Size', icon: Box },
  { key: 'height', label: 'Height', icon: Sparkles },
  { key: 'fertilizer', label: 'Fertilizer', icon: RefreshCcw },
  { key: 'petSafety', label: 'Pet Safety', icon: ShieldCheck },
  { key: 'deliveryNotes', label: 'Delivery Notes', icon: Truck }
];
