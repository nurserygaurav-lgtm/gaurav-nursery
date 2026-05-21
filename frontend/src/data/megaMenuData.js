export function slugifyMenuLabel(label) {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function shopLink(label) {
  return `/shop?category=${encodeURIComponent(label)}`;
}

const plantSections = [
  {
    title: 'Trending Plants',
    items: ['Indoor Plants', 'Best Seller Plants', 'Winter Plants', 'Flowering Plants', 'Air Purifying Plants', 'Bonsai Plants', 'Fruit Plants', 'Rose Plants']
  },
  {
    title: 'By Type',
    items: ['Air Plants', 'Bamboo Plants', 'Cactus Plants', 'Creeper Plants', 'Ferns', 'Ficus Plants', 'Herb Plants', 'Shrubs']
  },
  {
    title: 'By Features Uses',
    items: ['Air Purifying Plants', 'Aromatic Plants', 'Drought Tolerant Plants', 'Hanging Plants', 'Low Maintenance Plants', 'Lucky Plants', 'Medicinal Plants', 'Pet Friendly Plants']
  },
  {
    title: 'By Location',
    items: ['Indoor Plants', 'Outdoor Plants', 'Plants for Bedroom', 'Plants for Kitchen', 'Plants for Office', 'Plants for Balcony']
  },
  {
    title: 'Foliage Plants',
    items: ['Aglaonema Plants', 'Aloe Vera Plants', 'Areca Palm Plants', 'Calathea Plants', 'Money Plants', 'Rubber Plants', 'Snake Plants']
  },
  {
    title: 'Flowering Plants',
    items: ['Adenium Plants', 'Bougainvillea Plants', 'Hibiscus Plants', 'Jasmine Plants', 'Rose Plants', 'Lotus Plants']
  },
  {
    title: 'By Season',
    items: ['Summer Plants', 'Winter Plants', 'Monsoon Plants', 'All Season Plants']
  },
  {
    title: 'By Color',
    items: ['Red Flower Plants', 'Yellow Flower Plants', 'White Flower Plants', 'Pink Flower Plants']
  }
];

export const megaMenuItems = [
  {
    label: 'Gardening',
    icon: 'Sprout',
    tagline: 'Smart kits, curated packs, and garden setups',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
    badge: 'New Arrivals',
    sections: [
      {
        title: 'Garden Ideas',
        items: ['Garden Kits', 'Miniature Gardens', 'Terrace Garden', 'Balcony Garden', 'Office Garden', 'Vertical Garden', 'Eco Friendly Gifts', 'Festival Plant Packs', 'Seasonal Packs']
      },
      {
        title: 'Top Selling',
        items: ['Kitchen Garden Kit', 'Organic Veggie Kit', 'Succulent Bowl Kit', 'Herb Starter Kit', 'Monsoon Care Kit']
      },
      {
        title: 'Services',
        items: ['Garden Setup', 'Balcony Makeover', 'Plant Maintenance', 'Corporate Plant Styling']
      }
    ],
    featured: [
      { name: 'Balcony Garden Kit', price: 'From Rs.799', image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=320&q=80' },
      { name: 'Miniature Garden Set', price: 'Trending', image: 'https://images.unsplash.com/photo-1509423350716-97f2360af5e4?auto=format&fit=crop&w=320&q=80' }
    ]
  },
  {
    label: 'Plants',
    icon: 'Leaf',
    tagline: 'Indoor, outdoor, flowering, foliage, lucky plants',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
    badge: 'Trending',
    sections: plantSections,
    featured: [
      { name: 'Money Plant Marble Queen', price: 'Rs.299', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=320&q=80' },
      { name: 'Areca Palm XL', price: 'Rs.799', image: 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=320&q=80' },
      { name: 'Rose Plant Combo', price: 'Top Selling', image: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=320&q=80' }
    ]
  },
  {
    label: 'Seeds',
    icon: 'Wheat',
    tagline: 'Vegetable, flower, herb, and seasonal seed packs',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80',
    badge: 'Fast Growing',
    sections: [
      { title: 'Shop Seeds', items: ['Vegetable Seeds', 'Flower Seeds', 'Herb Seeds', 'Microgreen Seeds', 'Fruit Seeds', 'Imported Seeds'] },
      { title: 'By Season', items: ['Summer Seeds', 'Winter Seeds', 'Monsoon Seeds', 'All Season Seeds'] },
      { title: 'Top Selling', items: ['Tomato Seeds', 'Chilli Seeds', 'Coriander Seeds', 'Marigold Seeds', 'Spinach Seeds'] }
    ],
    featured: [
      { name: 'Kitchen Seed Box', price: 'Rs.249', image: 'https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&w=320&q=80' },
      { name: 'Microgreen Starter', price: 'New', image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=320&q=80' }
    ]
  },
  {
    label: 'Bulbs',
    icon: 'Flower2',
    tagline: 'Seasonal flowering bulbs for balconies and gardens',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=80',
    badge: 'Seasonal',
    sections: [
      { title: 'Flower Bulbs', items: ['Lily Bulbs', 'Tulip Bulbs', 'Daffodil Bulbs', 'Gladiolus Bulbs', 'Ranunculus Bulbs', 'Dahlia Bulbs'] },
      { title: 'Planting Needs', items: ['Bulb Soil Mix', 'Bulb Planters', 'Bloom Booster', 'Garden Labels'] }
    ],
    featured: [
      { name: 'Lily Bulb Pack', price: 'Rs.399', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=320&q=80' }
    ]
  },
  {
    label: 'Planters',
    icon: 'Package',
    tagline: 'Ceramic, self-watering, hanging, and balcony planters',
    image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=900&q=80',
    badge: 'Premium',
    sections: [
      { title: 'By Material', items: ['Ceramic Planters', 'Plastic Planters', 'Metal Planters', 'Terracotta Planters', 'Fiber Planters', 'Wooden Planters'] },
      { title: 'By Use', items: ['Indoor Planters', 'Outdoor Planters', 'Hanging Planters', 'Railing Planters', 'Self Watering Planters'] },
      { title: 'Top Selling', items: ['White Ceramic Pots', 'Tabletop Planters', 'Balcony Railing Pots', 'Designer Planter Sets'] }
    ],
    featured: [
      { name: 'Ceramic Pot Duo', price: 'Rs.499', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=320&q=80' },
      { name: 'Self Watering Pot', price: 'Top Selling', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=320&q=80' }
    ]
  },
  {
    label: 'Soil & Fertilizer',
    icon: 'Shovel',
    tagline: 'Organic nutrition, potting mixes, and plant boosters',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=80',
    badge: 'Organic',
    sections: [
      { title: 'Soil Mixes', items: ['Potting Soil', 'Cactus Soil', 'Orchid Mix', 'Seedling Mix', 'Bonsai Soil', 'Cocopeat'] },
      { title: 'Fertilizers', items: ['Organic Fertilizer', 'Vermicompost', 'Seaweed Fertilizer', 'NPK Fertilizer', 'Bone Meal', 'Neem Cake'] },
      { title: 'Plant Care', items: ['Root Booster', 'Flower Booster', 'Pest Control', 'Leaf Shine', 'Plant Food Sticks'] }
    ],
    featured: [
      { name: 'Organic Potting Mix', price: 'Rs.199', image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=320&q=80' }
    ]
  },
  {
    label: 'Gifts',
    icon: 'Gift',
    tagline: 'Gift-ready plants for every occasion',
    image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=900&q=80',
    badge: 'Gift Ready',
    sections: [
      { title: 'Occasions', items: ['Birthday Gifts', 'Anniversary Gifts', 'Housewarming Gifts', 'Wedding Gifts', 'Return Gifts', 'Festival Gifts'] },
      { title: 'Plant Gifts', items: ['Lucky Bamboo Gifts', 'Succulent Gifts', 'Desktop Plant Gifts', 'Premium Plant Hampers'] },
      { title: 'Add Ons', items: ['Greeting Cards', 'Gift Wraps', 'Personalized Notes', 'Decorative Pots'] }
    ],
    featured: [
      { name: 'Lucky Bamboo Gift', price: 'Rs.349', image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=320&q=80' }
    ]
  },
  {
    label: 'Pebbles',
    icon: 'Gem',
    tagline: 'Decorative stones, marble chips, and garden accents',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=900&q=80',
    badge: 'Decor',
    sections: [
      { title: 'Decor Pebbles', items: ['White Pebbles', 'Black Pebbles', 'Color Pebbles', 'River Stones', 'Marble Chips', 'Polished Pebbles'] },
      { title: 'Uses', items: ['Planter Decoration', 'Terrarium Decor', 'Aquarium Pebbles', 'Pathway Stones', 'Zen Garden Stones'] }
    ],
    featured: [
      { name: 'White Marble Pebbles', price: 'Rs.149', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=320&q=80' }
    ]
  },
  {
    label: 'Accessories',
    icon: 'Wrench',
    tagline: 'Tools, supports, labels, and care essentials',
    image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=900&q=80',
    badge: 'Essentials',
    sections: [
      { title: 'Garden Tools', items: ['Hand Trowels', 'Pruners', 'Watering Cans', 'Sprayers', 'Gloves', 'Garden Forks'] },
      { title: 'Plant Supports', items: ['Moss Sticks', 'Plant Stands', 'Trellis', 'Clips and Ties', 'Hanging Hooks'] },
      { title: 'Top Selling', items: ['Care Tool Kit', 'Premium Pruner', 'Metal Watering Can', 'Plant Labels'] }
    ],
    featured: [
      { name: 'Gardening Tool Kit', price: 'Rs.599', image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=320&q=80' }
    ]
  },
  {
    label: 'Corporate Gifting',
    icon: 'Building2',
    tagline: 'Bulk plant gifts, branding, and event hampers',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
    badge: 'Bulk Orders',
    sections: [
      { title: 'Corporate Plants', items: ['Employee Welcome Kits', 'Client Gifts', 'Event Giveaways', 'Desk Plant Hampers', 'Premium Gift Boxes'] },
      { title: 'Customization', items: ['Branded Sleeves', 'Custom Notes', 'Bulk Packaging', 'Pan India Dispatch'] },
      { title: 'Use Cases', items: ['Diwali Gifting', 'Conference Gifts', 'Office Green Drives', 'Real Estate Handover Gifts'] }
    ],
    featured: [
      { name: 'Desk Plant Bulk Box', price: 'Request Quote', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=320&q=80' }
    ]
  }
].map((menu) => ({
  ...menu,
  slug: slugifyMenuLabel(menu.label),
  to: `/category/${slugifyMenuLabel(menu.label)}`,
  shopAllTo: shopLink(menu.label),
  sections: menu.sections.map((section) => ({
    ...section,
    items: section.items.map((label) => ({
      label,
      to: shopLink(label),
      slug: slugifyMenuLabel(label)
    }))
  }))
}));

export function findMegaMenuBySlug(slug) {
  return megaMenuItems.find((item) => item.slug === slug);
}
