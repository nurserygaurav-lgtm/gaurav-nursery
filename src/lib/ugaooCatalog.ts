// Curated Bestselling Plant Catalog based on Ugaoo.com
// Real Indian nursery pricing, authentic botanical specs, sunlight, water, and multi-angle imagery.

export interface UgaooPlantItem {
  id: string
  title: string
  category: string
  categoryId: string
  price: number
  mrp: number
  stock: number
  description: string
  sunlight: string
  waterRequirement: string
  plantHeight: string
  potSize: string
  soilType: string
  difficulty: string
  plantType: string
  careTips: string
  images: string[]
}

export const UGAOO_BESTSELLERS: UgaooPlantItem[] = [
  {
    id: 'ugaoo-lucky-bamboo-2-layer',
    title: 'Lucky Bamboo Plant - 2 Layer (with Decorative Bowl)',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 399,
    mrp: 499,
    stock: 50,
    description: 'Specialized 2-tier Lucky Bamboo (Dracaena sanderiana) cultivated in pristine nursery conditions with a decorative glass bowl. Purifies indoor air, attracts prosperity and vitality. Perfect for office desks, living spaces, and auspicious gifting.',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Low (Once a week)',
    plantHeight: '15 - 20 cm',
    potSize: '8 - 10 cm Glass Bowl / Diamond Planter',
    soilType: 'Hydroponic water with polished river pebbles',
    difficulty: 'Beginner Friendly',
    plantType: 'Good Luck / Air Purifying',
    careTips: 'Keep in bright indirect room light. Change clean filtered water once every 7 to 10 days. Avoid direct scorching sun.',
    images: [
      '/images/products/lucky-bamboo-collage.jpg',
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80',
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-golden-money-plant',
    title: 'Golden Money Plant (Epipremnum aureum)',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 299,
    mrp: 399,
    stock: 60,
    description: 'Classic Indian home favorite with glossy heart-shaped foliage splashed with golden yellow hues. NASA air purifier that thrives with minimal fuss and brings positive Vastu energy.',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Moderate (2-3 days)',
    plantHeight: '12 - 15 inches',
    potSize: '5 inch self-watering pot',
    soilType: 'Cocopeat & vermicompost mix',
    difficulty: 'Beginner Friendly',
    plantType: 'Air Purifying / Vastu',
    careTips: 'Allow top 1 inch of soil to dry out between waterings. Thrives in low light to bright indirect sunlight.',
    images: [
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80',
      'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-zz-plant',
    title: 'ZZ Plant (Zamioculcas zamiifolia)',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 499,
    mrp: 699,
    stock: 40,
    description: 'Virtually indestructible plant featuring architectural stems and naturally shiny, deep green waxy leaves. Perfect for modern living rooms and low-light apartment corners.',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Low (Once a week)',
    plantHeight: '14 - 18 inches',
    potSize: '6 inch nursery pot',
    soilType: 'Well-draining porous potting soil',
    difficulty: 'Beginner Friendly',
    plantType: 'Air Purifying / Low Maintenance',
    careTips: 'Water sparingly every 10 to 14 days. Tolerates deep shade and fluctuating indoor temperatures effortlessly.',
    images: [
      'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800&q=80',
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-snake-plant-superba',
    title: 'Sansevieria Snake Plant (Futura Superba)',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 349,
    mrp: 499,
    stock: 75,
    description: 'Heavy-duty air purifier that releases oxygen during nighttime. Broad upright variegated leaves bordered with striking golden-yellow margins.',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Low (Once a week)',
    plantHeight: '12 - 16 inches',
    potSize: '5 inch ceramic planter',
    soilType: 'Gritty succulent and cactus mix',
    difficulty: 'Beginner Friendly',
    plantType: 'Air Purifying',
    careTips: 'Water only when soil is completely dry. Extremely drought-resistant and pest-free.',
    images: [
      'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-jade-plant-mini',
    title: 'Jade Plant Mini (Crassula ovata)',
    category: 'Bonsai & Succulents',
    categoryId: 'bonsai-succulents',
    price: 299,
    mrp: 399,
    stock: 55,
    description: 'Vastu and Feng Shui favorite with plump, jade-green teardrop succulent leaves. Associated with financial growth, luck, and positive energy.',
    sunlight: 'Moderate',
    waterRequirement: 'Low (Once a week)',
    plantHeight: '6 - 9 inches',
    potSize: '4 inch ceramic planter',
    soilType: 'Perlite and gritty succulent soil',
    difficulty: 'Beginner Friendly',
    plantType: 'Good Luck / Succulent',
    careTips: 'Needs bright indirect sunlight. Water only when leaves feel slightly soft to touch.',
    images: [
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-peace-lily',
    title: 'Peace Lily (Spathiphyllum) Flowering',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 399,
    mrp: 549,
    stock: 35,
    description: 'Lush emerald foliage paired with elegant white blooms. Renowned for filtering airborne toxins like benzene, carbon monoxide, and formaldehyde.',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Moderate (2-3 days)',
    plantHeight: '12 - 15 inches',
    potSize: '6 inch self-watering pot',
    soilType: 'Moisture retentive rich organic potting mix',
    difficulty: 'Beginner Friendly',
    plantType: 'Flowering / Air Purifying',
    careTips: 'Keep in filtered light. Drooping leaves indicate it is time for a thorough watering.',
    images: [
      'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-areca-palm',
    title: 'Areca Palm Air Purifier',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 599,
    mrp: 799,
    stock: 30,
    description: 'Graceful feathery palm fronds that lend a tropical luxury resort vibe to any living room or balcony while humidifying dry indoor air naturally.',
    sunlight: 'Moderate',
    waterRequirement: 'Moderate (2-3 days)',
    plantHeight: '24 - 30 inches',
    potSize: '8 inch nursery planter',
    soilType: 'Rich loam with vermicompost and cocopeat',
    difficulty: 'Beginner Friendly',
    plantType: 'Foliage / Tropical',
    careTips: 'Keep near a bright window. Mist foliage in hot summers and keep soil evenly moist.',
    images: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-aglaonema-pink',
    title: 'Aglaonema Pink Anjamani (Chinese Evergreen)',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 549,
    mrp: 749,
    stock: 25,
    description: 'Striking hot-pink leaves bordered with deep emerald edges. One of the most sought-after colorful indoor houseplants for designer living spaces.',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Moderate (2-3 days)',
    plantHeight: '10 - 14 inches',
    potSize: '6 inch designer pot',
    soilType: 'Aerated potting blend with pine bark',
    difficulty: 'Beginner Friendly',
    plantType: 'Colorful Foliage',
    careTips: 'Avoid overwatering. Thrives in warm, humid indoor conditions under low to moderate light.',
    images: [
      'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-rubber-plant-burgundy',
    title: 'Rubber Plant Burgundy (Ficus elastica)',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 499,
    mrp: 699,
    stock: 40,
    description: 'Bold, leathery foliage in an alluring deep burgundy-black shade. Makes an imposing statement plant for living rooms and office foyers.',
    sunlight: 'Moderate',
    waterRequirement: 'Moderate (2-3 days)',
    plantHeight: '16 - 22 inches',
    potSize: '7 inch nursery pot',
    soilType: 'Well-drained rich garden soil',
    difficulty: 'Beginner Friendly',
    plantType: 'Statement Tree',
    careTips: 'Wipe leaves with a damp microfiber cloth to maintain glossy sheen. Provide bright indirect light.',
    images: [
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-spider-plant',
    title: 'Spider Plant Variegated (Chlorophytum comosum)',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 279,
    mrp: 399,
    stock: 50,
    description: 'Playful cascading arching foliage with cream and green stripes. 100% pet-friendly and prolific producer of baby plantlets.',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Moderate (2-3 days)',
    plantHeight: '8 - 12 inches',
    potSize: '5 inch hanging or desktop pot',
    soilType: 'Lightweight cocopeat potting mix',
    difficulty: 'Beginner Friendly',
    plantType: 'Pet Safe / Air Purifying',
    careTips: 'Great for hanging baskets. Water when top layer of soil dries. Avoid fluoride-heavy tap water.',
    images: [
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-ficus-ginseng-bonsai',
    title: 'Ginseng Ficus Bonsai (S-Curve Trunk)',
    category: 'Bonsai & Succulents',
    categoryId: 'bonsai-succulents',
    price: 899,
    mrp: 1299,
    stock: 20,
    description: 'Sculptural miniature tree featuring thick, swollen aerial banyan roots resembling a ginseng root. Infuses Zen serenity and aesthetic balance.',
    sunlight: 'Moderate',
    waterRequirement: 'Moderate (2-3 days)',
    plantHeight: '10 - 14 inches',
    potSize: '7 inch ceramic shallow bonsai pot',
    soilType: 'Akadama, pumice, and gravel blend',
    difficulty: 'Intermediate',
    plantType: 'Bonsai',
    careTips: 'Keep in bright indirect light. Mist leaves twice weekly. Prune tips every couple of months to maintain miniature form.',
    images: [
      'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'
    ]
  },
  {
    id: 'ugaoo-syngonium-white-butterfly',
    title: 'Syngonium White Butterfly (Arrowhead Plant)',
    category: 'Indoor Plants',
    categoryId: 'indoor-plants',
    price: 249,
    mrp: 349,
    stock: 65,
    description: 'Delicate arrowhead-shaped leaves with silver-white centers and lime-green borders. Extremely versatile and fast growing.',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Moderate (2-3 days)',
    plantHeight: '8 - 12 inches',
    potSize: '5 inch grower pot',
    soilType: 'Moisture retentive potting soil',
    difficulty: 'Beginner Friendly',
    plantType: 'Air Purifying / Foliage',
    careTips: 'Adaptable to water or soil. Keep away from intense direct sun.',
    images: [
      'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'
    ]
  }
]
