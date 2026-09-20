import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CategorySpec {
  name: string
  slug: string
  description: string
  imageUrl: string
  baseTemplates: Array<{
    title: string
    basePrice: number
    sunlight: string
    waterRequirement: string
    plantHeight: string
    potSize: string
    soilType: string
    difficulty: string
    plantType: string
    careTips: string
    imageUrls: string[]
    description: string
  }>
}

// 10 Comprehensive Categories with Rich Botanical Specs
const CATEGORY_SPECS: CategorySpec[] = [
  // 1. Indoor Plants
  {
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    description: 'Low maintenance, air purifying plants suitable for living rooms, bedrooms, and offices.',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
    baseTemplates: [
      {
        title: 'Golden Money Plant (Epipremnum aureum)',
        basePrice: 249,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 15 inches',
        potSize: '5 inch self-watering pot',
        soilType: 'Cocopeat & vermicompost mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Air Purifying / Vastu',
        careTips: 'Allow top 1 inch of soil to dry out between waterings. Thrives in low light to bright indirect sunlight.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Classic Indian home favorite with glossy heart-shaped foliage splashed with golden yellow hues. NASA air purifier that thrives with minimal fuss and brings positive Vastu energy.'
      },
      {
        title: 'ZZ Plant (Zamioculcas zamiifolia)',
        basePrice: 449,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '14 - 18 inches',
        potSize: '6 inch nursery pot',
        soilType: 'Well-draining porous potting soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Air Purifying / Low Maintenance',
        careTips: 'Water sparingly every 10 to 14 days. Tolerates deep shade and fluctuating indoor temperatures effortlessly.',
        imageUrls: ['https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800&q=80'],
        description: 'Virtually indestructible plant featuring architectural stems and naturally shiny, deep green waxy leaves. Perfect for modern living rooms and low-light apartment corners.'
      },
      {
        title: 'Sansevieria Snake Plant (Futura Superba)',
        basePrice: 299,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '12 - 16 inches',
        potSize: '5 inch ceramic planter',
        soilType: 'Gritty succulent and cactus mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Air Purifying',
        careTips: 'Water only when soil is completely dry. Extremely drought-resistant and pest-free.',
        imageUrls: ['https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&q=80'],
        description: 'Heavy-duty air purifier that releases oxygen during nighttime. Broad upright variegated leaves bordered with striking golden-yellow margins.'
      },
      {
        title: 'Aglaonema Pink Anjamani (Chinese Evergreen)',
        basePrice: 499,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '10 - 14 inches',
        potSize: '6 inch designer pot',
        soilType: 'Aerated potting blend with pine bark',
        difficulty: 'Beginner Friendly',
        plantType: 'Colorful Foliage',
        careTips: 'Avoid overwatering. Thrives in warm, humid indoor conditions under low to moderate light.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Striking hot-pink leaves bordered with deep emerald edges. One of the most sought-after colorful indoor houseplants for designer living spaces.'
      },
      {
        title: 'Rubber Plant Burgundy (Ficus elastica)',
        basePrice: 399,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '16 - 22 inches',
        potSize: '7 inch nursery pot',
        soilType: 'Well-drained rich garden soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Statement Tree',
        careTips: 'Wipe leaves with a damp microfiber cloth to maintain glossy sheen. Provide bright indirect light.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Bold, leathery foliage in an alluring deep burgundy-black shade. Makes an imposing statement plant for living rooms and office foyers.'
      },
      {
        title: 'Monstera Deliciosa (Swiss Cheese Plant)',
        basePrice: 549,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '18 - 24 inches',
        potSize: '8 inch moss pole planter',
        soilType: 'Chunkier aroid mix with orchid bark and perlite',
        difficulty: 'Beginner Friendly',
        plantType: 'Tropical Foliage',
        careTips: 'Provide support with a coco-pole. Water when top 2 inches of soil feel dry.',
        imageUrls: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80'],
        description: 'Iconic jungle aesthetic with dramatic split leaves and fenestrations. Fast-growing and instantly transforms any interior into a lush sanctuary.'
      },
      {
        title: 'Philodendron Birkin (Variegated Pinstripe)',
        basePrice: 349,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '8 - 12 inches',
        potSize: '5 inch ceramic planter',
        soilType: 'Lightweight well-draining soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Designer Aroid',
        careTips: 'Keep in bright indirect light to preserve crisp creamy pinstripes. Avoid soggy roots.',
        imageUrls: ['https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=800&q=80'],
        description: 'Compact designer aroid with dark green ovate leaves highlighted by sharp, creamy-white pinstripes. A collector favorite.'
      },
      {
        title: 'Calathea Orbifolia (Giant Prayer Plant)',
        basePrice: 499,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '14 - 18 inches',
        potSize: '6 inch self-watering pot',
        soilType: 'Moisture-retentive peat and perlite mix',
        difficulty: 'Intermediate',
        plantType: 'Ornamental Foliage',
        careTips: 'Use filtered water to prevent leaf edge browning. Thrives in humid bathrooms or with room humidifiers.',
        imageUrls: ['https://images.unsplash.com/photo-1599685315640-9ceab2f58944?w=800&q=80'],
        description: 'Magnificent round leaves adorned with delicate silvery-green painterly brushstrokes. Folds leaves gently at dusk in prayer.'
      },
      {
        title: 'Lucky Bamboo Plant - 2 Layer (Decorative Bowl)',
        basePrice: 249,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '15 - 20 cm',
        potSize: '8 - 10 cm Glass Bowl',
        soilType: 'Hydroponic water with river pebbles',
        difficulty: 'Beginner Friendly',
        plantType: 'Good Luck / Air Purifying',
        careTips: 'Keep in bright indirect room light. Change clean filtered water once every 7 to 10 days.',
        imageUrls: ['/images/products/lucky-bamboo-collage.jpg'],
        description: 'Specialized 2-tier Lucky Bamboo (Dracaena sanderiana) cultivated in pristine nursery conditions with a decorative glass bowl. Attracts prosperity and positive energy.'
      },
      {
        title: 'Dieffenbachia Camille (Dumb Cane)',
        basePrice: 299,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 16 inches',
        potSize: '6 inch nursery pot',
        soilType: 'Standard potting soil + cocopeat',
        difficulty: 'Beginner Friendly',
        plantType: 'Broad Foliage',
        careTips: 'Thrives in medium indirect sunlight. Water evenly when top inch dries.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Broad, luminous leaves featuring creamy yellow-white centers bordered with rich dark green margins. Extremely vigorous grower.'
      }
    ]
  },

  // 2. Outdoor Plants
  {
    name: 'Outdoor Plants',
    slug: 'outdoor-plants',
    description: 'Sun-loving plants, hardy flowering shrubs, and landscape ornamentals.',
    imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80',
    baseTemplates: [
      {
        title: 'Bougainvillea Royal Magenta Bonsai',
        basePrice: 399,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '14 - 18 inches',
        potSize: '8 inch mud pot',
        difficulty: 'Intermediate',
        plantType: 'Flowering Shrub',
        careTips: 'Needs at least 6 hours of full sun for heavy blossoming. Allow soil to dry out between waterings.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Spectacular trailing bougainvillea with paper-thin fuchsia blooms. Heat tolerant, drought-hardy, and remarkably vibrant.'
      },
      {
        title: 'Croton Petra (Multicolor Broadleaf)',
        basePrice: 249,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '14 - 20 inches',
        potSize: '7 inch nursery planter',
        soilType: 'Rich garden loam with vermicompost',
        difficulty: 'Beginner Friendly',
        plantType: 'Colorful Foliage',
        careTips: 'Full outdoor morning sun intensifies the fiery red, orange, and yellow leaf veins.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Fiery kaleidoscope of autumn colors across broad leathery leaves. Thrives in Indian balcony gardens.'
      },
      {
        title: 'Hibiscus Hawaiian Red (Hybrid Gurhal)',
        basePrice: 299,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '16 - 22 inches',
        potSize: '8 inch clay pot',
        soilType: 'Fertile slightly acidic potting soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Flowering Shrub',
        careTips: 'Feed with organic potassium and bone meal monthly to promote continuous bud formation.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Large, saucer-shaped scarlet red blossoms with protruding golden stamens. Sacred flower associated with prosperity.'
      },
      {
        title: 'Ficus Panda Ball Topiary (Microcarpa)',
        basePrice: 649,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '20 - 26 inches',
        potSize: '9 inch architectural planter',
        soilType: 'Heavy garden soil with compost',
        difficulty: 'Intermediate',
        plantType: 'Topiary Shrub',
        careTips: 'Prune every 6-8 weeks to maintain the crisp spherical globe silhouette.',
        imageUrls: ['https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'],
        description: 'Precision-pruned live topiary ball featuring thick, rounded glossy leaves. Elevates modern villa entrances and terraces.'
      },
      {
        title: 'Madurai Mogra (Arabian Sambac Jasmine)',
        basePrice: 199,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 16 inches',
        potSize: '7 inch terracotta pot',
        soilType: 'Porous organic loam with cow dung compost',
        difficulty: 'Beginner Friendly',
        plantType: 'Fragrant Shrub',
        careTips: 'Prune branches after each flowering flush to stimulate vigorous new flower spikes.',
        imageUrls: ['https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80'],
        description: 'Intensely fragrant white double-blooms prized across India for worship, garlands, and evening garden aroma.'
      },
      {
        title: 'Ixora Rugmini (Dwarf Red Dwarf Coral)',
        basePrice: 229,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '10 - 14 inches',
        potSize: '6 inch nursery pot',
        soilType: 'Acidic, well-draining garden soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Dense Bloomer',
        careTips: 'Thrives in direct sunlight. Keep soil slightly moist during hot dry periods.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Dense clusters of star-shaped ruby flowers that bloom non-stop throughout the tropical year.'
      },
      {
        title: 'Plumeria Champa (Golden Fragrance Frangipani)',
        basePrice: 399,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '22 - 30 inches',
        potSize: '10 inch terracotta planter',
        soilType: 'Fast-draining gritty soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Flowering Tree',
        careTips: 'Extremely drought hardy. Reduce watering in winter dormancy.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Velvety cream petals with a golden-yellow heart emitting an enchanting citrusy-sweet perfume.'
      },
      {
        title: 'Thuja Occidentalis (Morpankhi / Oriental Arborvitae)',
        basePrice: 299,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '18 - 24 inches',
        potSize: '8 inch nursery pot',
        soilType: 'Well-draining garden loam',
        difficulty: 'Beginner Friendly',
        plantType: 'Evergreen Conifer',
        careTips: 'Requires 4-6 hours of sunlight. Water when top 2 inches dry out.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Traditional Indian auspicious evergreen conifer with feather-like fan foliage, often planted in symmetrical pairs.'
      },
      {
        title: 'Tecoma Stans (Golden Bells Yellow Trumpet)',
        basePrice: 249,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '20 - 28 inches',
        potSize: '8 inch grower pot',
        soilType: 'Any well-drained garden soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Flowering Shrub',
        careTips: 'Cut back leggy stems after monsoon to encourage bushy flowering canopy.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Vigorous sun-worshipper covered in cheerful clusters of bright yellow bell flowers that attract butterflies.'
      },
      {
        title: 'Cycas Revoluta (Sago Palm Ornamental)',
        basePrice: 699,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '16 - 22 inches',
        potSize: '9 inch wide terracotta dish',
        soilType: 'Sandy gritty potting mix',
        difficulty: 'Intermediate',
        plantType: 'Ancient Cycad',
        careTips: 'Very slow growing. Water deeply but infrequently; ensure crown never stays waterlogged.',
        imageUrls: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80'],
        description: 'Prehistoric architectural cycad with symmetrical feather-like fronds growing from a stout rugged trunk.'
      }
    ]
  },

  // 3. Flowering Plants
  {
    name: 'Flowering Plants',
    slug: 'flowering-plants',
    description: 'Vibrant blooms, exotic adeniums, fragrant roses, and orchids.',
    imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&q=80',
    baseTemplates: [
      {
        title: 'Adenium Desert Rose (Grafted Thai Hybrid)',
        basePrice: 349,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '10 - 14 inches',
        potSize: '6 inch nursery pot',
        soilType: 'Well-draining gritty mix (Adenium special)',
        difficulty: 'Beginner Friendly',
        plantType: 'Flowering Succulent',
        careTips: 'Provide 5-6 hours of direct sunlight. Allow soil to completely dry out before watering.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Stunning sculpted caudex with brilliant multi-layered magenta blossoms. Thrives in Indian heat with minimal water.'
      },
      {
        title: 'Kashmiri Fragrant Red Rose (Desi Gulab)',
        basePrice: 199,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '14 - 18 inches',
        potSize: '7 inch clay pot',
        soilType: 'Clay loam mixed with 30% vermicompost',
        difficulty: 'Beginner Friendly',
        plantType: 'Fragrant Rose',
        careTips: 'Prune dead stems in autumn. Feed with mustard cake and bone meal.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Classic heavily-scented Indian desi red rose famous for rosewater (gulab jal), pooja, and aromatic balconies.'
      },
      {
        title: 'Peace Lily (Spathiphyllum) Flowering',
        basePrice: 249,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 15 inches',
        potSize: '6 inch self-watering pot',
        soilType: 'Moisture retentive rich organic potting mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Flowering / Air Purifying',
        careTips: 'Keep in filtered light. Drooping leaves indicate it is time for a thorough watering.',
        imageUrls: ['https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80'],
        description: 'Lush emerald foliage paired with elegant white blooms. Renowned for filtering airborne toxins.'
      },
      {
        title: 'Dendrobium Purple Orchid (Blooming Cane)',
        basePrice: 499,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 16 inches',
        potSize: '5 inch perforated orchid pot',
        soilType: 'Pine bark chips, charcoal, and cocopeat chunks',
        difficulty: 'Intermediate',
        plantType: 'Epiphytic Orchid',
        careTips: 'Mist roots daily in warm weather. Water through bark mix without letting standing water pool at root base.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Exotic long-lasting spray of royal purple and lavender blossoms lasting up to 8-10 weeks.'
      },
      {
        title: 'Kalanchoe Blossfeldiana (Flaming Katy Pink)',
        basePrice: 249,
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '8 - 12 inches',
        potSize: '5 inch ceramic planter',
        soilType: 'Gritty succulent potting mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Flowering Succulent',
        careTips: 'Place in bright sunny room. Water only when soil is parched.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Compact succulent with scalloped jade leaves bearing dense heads of miniature double rose-like blossoms.'
      },
      {
        title: 'Parijat (Nyctanthes Night-Flowering Coral Jasmine)',
        basePrice: 229,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '16 - 22 inches',
        potSize: '8 inch nursery pot',
        soilType: 'Well-draining garden soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Sacred Flowering Tree',
        careTips: 'Flowers bloom at night and drop gently by dawn. Needs bright open sunshine.',
        imageUrls: ['https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80'],
        description: 'Heavenly fragrant sacred white flower with an orange coral tube stem, celebrated in ancient Ayurvedic lore.'
      },
      {
        title: 'Crossandra Infundibuliformis (Aboli Firecracker)',
        basePrice: 199,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '10 - 14 inches',
        potSize: '6 inch nursery pot',
        soilType: 'Organic potting loam',
        difficulty: 'Beginner Friendly',
        plantType: 'Perennial Bloomer',
        careTips: 'Loves warm semi-shaded locations. Pinch off faded flower spikes to boost branching.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Fan-shaped salmon-apricot blossoms popular across Maharashtra and South India for traditional hair adornment.'
      },
      {
        title: 'Gardenia Gandharaj (Cape Jasmine Fragrant)',
        basePrice: 329,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 16 inches',
        potSize: '7 inch clay pot',
        soilType: 'Acidic, moist, organically rich soil',
        difficulty: 'Intermediate',
        plantType: 'Aromatic Shrub',
        careTips: 'Keep soil evenly moist with rainwater or acidified water. Shelter from fierce midday sun.',
        imageUrls: ['https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80'],
        description: 'Creamy white waxy rosettes with a hypnotic floral fragrance that perfumes entire balconies.'
      },
      {
        title: 'Gerbera Daisy Hybrid (Candy Pink)',
        basePrice: 229,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '10 - 14 inches',
        potSize: '6 inch pot',
        soilType: 'Well-draining porous potting mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Perennial Daisy',
        careTips: 'Water around the root rim; do not pour water directly into the center crown.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Vibrant cheerfulness on sturdy stems with radiant magenta-pink daisy petals.'
      },
      {
        title: 'Anthurium Red Flamingo Flower',
        basePrice: 449,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 16 inches',
        potSize: '6 inch self-watering pot',
        soilType: 'Coarse aroid blend with orchid bark',
        difficulty: 'Intermediate',
        plantType: 'Tropical Exotic',
        careTips: 'Wipe glossy spathes with a damp sponge. Keep in bright room with moderate humidity.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Lustrous, lacquered heart-shaped scarlet spathes with a yellow spadix spike that bloom continuously for months.'
      }
    ]
  },

  // 4. Bonsai & Succulents
  {
    name: 'Bonsai & Succulents',
    slug: 'bonsai-succulents',
    description: 'Artistic miniature trees and drought-tolerant hardy succulents.',
    imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&q=80',
    baseTemplates: [
      {
        title: 'Ginseng Ficus Microcarpa Bonsai (S-Curve)',
        basePrice: 749,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '10 - 14 inches',
        potSize: '7 inch ceramic shallow dish',
        soilType: 'Akadama & pumice gravel blend',
        difficulty: 'Intermediate',
        plantType: 'Bonsai',
        careTips: 'Keep near bright indirect window. Mist foliage regularly. Prune excess shoots every 2 months.',
        imageUrls: ['https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'],
        description: 'Graceful aesthetic tabletop bonsai with aerial banyan roots. Brings Zen peace, prosperity, and natural elegance.'
      },
      {
        title: 'Jade Plant Mini (Crassula ovata)',
        basePrice: 199,
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '6 - 9 inches',
        potSize: '4 inch ceramic planter',
        soilType: 'Perlite and gritty succulent soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Good Luck / Succulent',
        careTips: 'Needs bright indirect sunlight. Water only when leaves feel slightly soft to touch.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Vastu and Feng Shui favorite with plump, jade-green teardrop succulent leaves. Associated with financial growth.'
      },
      {
        title: 'Haworthia Fasciata (Zebra Plant Succulent)',
        basePrice: 229,
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '4 - 6 inches',
        potSize: '3.5 inch ceramic pot',
        soilType: 'Mineral grit and cactus mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Compact Succulent',
        careTips: 'Zero maintenance. Water lightly every 10-14 days. Does not require direct scorching sun.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Compact rosette with thick, dark green triangular leaves embossed with distinctive horizontal white zebra stripes.'
      },
      {
        title: 'Echeveria Elegans (Mexican Snowball Rose)',
        basePrice: 249,
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '4 - 7 inches',
        potSize: '4 inch terracotta cup',
        soilType: 'Gritty perlite mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Succulent Rosette',
        careTips: 'Avoid water accumulating in the central rosette. Give plenty of bright morning sun.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Mesmerizing geometric rosette of silvery-blue succulent leaves that blush soft pink in winter chill.'
      },
      {
        title: 'Carmona Fukien Tea Tree Bonsai',
        basePrice: 849,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 16 inches',
        potSize: '8 inch glazed ceramic bonsai dish',
        soilType: 'Akadama, volcanic lava, and peat',
        difficulty: 'Intermediate',
        plantType: 'Bonsai',
        careTips: 'Likes warm room temperatures and high humidity. Bears tiny star-shaped white blossoms.',
        imageUrls: ['https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'],
        description: 'Refined oriental bonsai with textured grey bark, miniature dark green foliage, and dainty white flowers.'
      },
      {
        title: 'Golden Barrel Cactus (Echinocactus grusonii)',
        basePrice: 299,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '5 - 8 inches',
        potSize: '5 inch terracotta bowl',
        soilType: 'Pure coarse sand and gravel mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Desert Cactus',
        careTips: 'Water once every 3-4 weeks. Keep on the sunniest outdoor ledge.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Spherical globe cactus covered in shimmering golden-yellow spines. Extremely architectural and long-lived.'
      },
      {
        title: 'Sedum Morganianum (Burro’s Tail Succulent)',
        basePrice: 279,
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '8 - 14 inches trailing',
        potSize: '6 inch hanging basket',
        soilType: 'Well-draining gritty compost',
        difficulty: 'Beginner Friendly',
        plantType: 'Trailing Succulent',
        careTips: 'Hang in bright filtered light. Handle gently as plump leaves drop easily on rough impact.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Cascading braids of plump, overlapping blue-green fleshy leaves that drape gracefully over pot rims.'
      },
      {
        title: 'Euphorbia Trigona (African Milk Tree Cathedral)',
        basePrice: 399,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '16 - 22 inches',
        potSize: '6 inch nursery pot',
        soilType: 'Cactus soil mix with pumice',
        difficulty: 'Beginner Friendly',
        plantType: 'Sculptural Succulent',
        careTips: 'Virtually pest-proof. Allow soil to thoroughly dry before adding water.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Architectural ridged triangular stems bearing thorns and tiny green drop leaves. Looks like an exotic desert candelabra.'
      },
      {
        title: 'Sansevieria Cylindrica (African Spear Braided)',
        basePrice: 349,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '10 - 14 inches',
        potSize: '5 inch ceramic planter',
        soilType: 'Gritty potting soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Architectural Succulent',
        careTips: 'Water once every 2-3 weeks. Withstands AC rooms and low-light spaces with ease.',
        imageUrls: ['https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&q=80'],
        description: 'Smooth, cylindrical spear-like succulent stems artfully braided into an eye-catching modern centerpiece.'
      },
      {
        title: 'Chinese Elm Bonsai (Ulmus Parvifolia)',
        basePrice: 899,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '10 - 14 inches',
        potSize: '7 inch ceramic bonsai tray',
        soilType: 'Horticultural grit and loam',
        difficulty: 'Intermediate',
        plantType: 'Deciduous Bonsai',
        careTips: 'Trim back new shoots to two leaves once they have developed 6-8 leaves. Keep soil slightly moist.',
        imageUrls: ['https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'],
        description: 'Classic bonsai with miniature serrated leaves, fine ramification, and an ancient curving trunk line.'
      }
    ]
  },

  // 5. Pots & Planters
  {
    name: 'Pots & Planters',
    slug: 'pots-planters',
    description: 'Ceramic, terracotta, and durable UV-treated planters for modern homes.',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80',
    baseTemplates: [
      {
        title: 'Handcrafted Terracotta Ribbed Planter (8 Inch)',
        basePrice: 249,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '8 inch height x 7 inch depth',
        potSize: '8 inch diameter',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Porous Clay Pot',
        careTips: 'Rinse with water before initial potting. Porous clay naturally aerates roots and prevents overwatering rot.',
        imageUrls: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        description: 'Artisanal earthen terracotta planter featuring horizontal ribs and a drainage hole for healthy root respiration.'
      },
      {
        title: 'Nordic Minimalist Matte Ceramic Pot (6 Inch)',
        basePrice: 299,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '6 inch height x 6 inch diameter',
        potSize: '6 inch diameter',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Ceramic Pot',
        careTips: 'Comes with bottom drainage hole and a matching drip saucer to protect wooden tabletops.',
        imageUrls: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        description: 'Sleek cylinder ceramic planter with a luxurious matte glaze finish. Complements modern living rooms.'
      },
      {
        title: 'Self-Watering Desktop Planter (5.5 Inch)',
        basePrice: 199,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '5.5 inch cube',
        potSize: '5.5 inch',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Self-Watering Planter',
        careTips: 'Fill bottom water reservoir; the cotton wick feeds plants evenly for up to 10-14 days during travel.',
        imageUrls: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        description: 'Smart sub-irrigation planter with clear water level indicator. Keeps indoor plants thriving effortlessly while traveling.'
      },
      {
        title: 'Balcony Railing Metal Hook Planter (Set of 2)',
        basePrice: 349,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '12 inch length x 6 inch width',
        potSize: 'Double hook oval',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Metal Railing Planter',
        careTips: 'Heavy powder-coated rust-free galvanized iron. Securely hooks onto standard apartment balcony grilles.',
        imageUrls: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        description: 'Space-saving balcony railing planter boxes engineered with detachable twin hanging brackets.'
      },
      {
        title: 'Macrame Cotton Rope Plant Hanger with Ceramic Pot',
        basePrice: 399,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '36 inch rope length',
        potSize: '6 inch ceramic pot included',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Hanging Decor',
        careTips: 'Hang near bright windows for trailing pothos, spider plants, or string of pearls.',
        imageUrls: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        description: 'Handwoven natural bohemian cotton macrame rope suspension fitted with a smooth white ceramic pot.'
      },
      {
        title: 'Terracotta Shallow Bonsai Dish (10 Inch)',
        basePrice: 329,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '10 inch diameter x 3 inch depth',
        potSize: '10 inch shallow',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Bonsai Dish',
        careTips: 'Dual large drainage holes with mesh wire tie-down points for bonsai anchoring.',
        imageUrls: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        description: 'Traditional heavy-clay unglazed dish specifically crafted for ficus bonsais, desert roses, and succulent gardens.'
      },
      {
        title: 'Geometric Diamond Faceted Ceramic Pot (7 Inch)',
        basePrice: 379,
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '7 inch height x 7 inch width',
        potSize: '7 inch',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Designer Ceramic',
        careTips: 'Wipe exterior with a damp cloth to maintain pristine high-gloss finish.',
        imageUrls: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        description: 'Avant-garde polyhedral faceted planter that reflects indoor room light dynamically.'
      },
      {
        title: 'UV-Stabilized Heavy Duty Nursery Pots (Pack of 5, 8 Inch)',
        basePrice: 249,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '8 inch height x 8 inch mouth',
        potSize: '8 inch grower pots',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Commercial Nursery Pots',
        careTips: 'UV-resistant black virgin plastic; will not crack or become brittle in blistering outdoor heat.',
        imageUrls: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        description: 'Durable nursery grower containers with multi-tier drainage holes for rapid sapling potting.'
      },
      {
        title: 'Hand-Carved Wooden Planter Stand with Ceramic Pot',
        basePrice: 549,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '14 inch total stand height',
        potSize: '7 inch pot with stand',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Planter & Stand Set',
        careTips: 'Made from water-sealed Sheesham hardwood. Elevates plants off cold floors for better air circulation.',
        imageUrls: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        description: 'Mid-century modern elevated wooden tripod stand combined with a heavy white ceramic cylindrical planter.'
      },
      {
        title: 'Decorative Glass Bowl for Lucky Bamboo & Aquatics (6 Inch)',
        basePrice: 199,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '4.5 inch height x 6 inch diameter',
        potSize: '6 inch glass bowl',
        soilType: 'Not applicable (Planter)',
        difficulty: 'Beginner Friendly',
        plantType: 'Glass Vessel',
        careTips: 'Wash with mild vinegar and water monthly to remove algae and mineral water rings.',
        imageUrls: ['/images/products/lucky-bamboo-collage.jpg'],
        description: 'Crystal-clear annealed glass bowl tailored for 2-layer and 3-layer lucky bamboos, polished pebbles, and water plants.'
      }
    ]
  },

  // 6. Soil & Organic Fertilizers
  {
    name: 'Soil & Organic Fertilizers',
    slug: 'soil-fertilizers',
    description: '100% organic vermicompost, neem khali, cocopeat, and nutrient mixes.',
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&q=80',
    baseTemplates: [
      {
        title: '100% Pure Organic Neem Vermicompost (5 Kg Bag)',
        basePrice: 199,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '5 Kg hermetic seal bag',
        potSize: '5 Kg',
        soilType: 'Organic Fertilizer',
        difficulty: 'Beginner Friendly',
        plantType: 'Soil Nutrition',
        careTips: 'Mix 2-3 handfuls around plant root zone once every 25-30 days and water immediately.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: 'Earthworm castings enriched with pure cold-pressed neem cake. Enhances soil microbial flora and wards off fungal root rot.'
      },
      {
        title: 'Low-EC Washed Cocopeat Block (5 Kg Expands to 75L)',
        basePrice: 179,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '5 Kg compressed brick',
        potSize: '5 Kg brick',
        soilType: 'Soil Substrate',
        difficulty: 'Beginner Friendly',
        plantType: 'Potting Base',
        careTips: 'Immerse block in 25 liters of fresh water; fluffs up within 15 minutes into ready-to-use fluffy substrate.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: 'Triple-washed premium coconut coir pith with electrical conductivity below 0.5 mS/cm. Retains moisture evenly.'
      },
      {
        title: 'Horticultural Grade Perlite (1 Kg / 5 Liters)',
        basePrice: 149,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '1 Kg bag',
        potSize: '1 Kg',
        soilType: 'Aeration Medium',
        difficulty: 'Beginner Friendly',
        plantType: 'Soil Improver',
        careTips: 'Blend 20-30% perlite with potting soil to maximize drainage for succulents, aroids, and seedlings.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: 'Sterile expanded volcanic glass granules that eliminate soil compaction and guarantee healthy oxygen flow to root tips.'
      },
      {
        title: 'Cold-Pressed Seaweed Liquid Extract Fertilizer (500 ml)',
        basePrice: 229,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '500 ml concentrated bottle',
        potSize: '500 ml',
        soilType: 'Bio-stimulant',
        difficulty: 'Beginner Friendly',
        plantType: 'Foliar Spray & Soil Drench',
        careTips: 'Dilute 3-5 ml per liter of water and spray on foliage every 15 days for vivid blooms and pest resistance.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: 'Rich in 60+ micro-nutrients, natural auxins, and cytokinins extracted sustainably from ocean kelp.'
      },
      {
        title: 'Pure Organic Neem Cake Powder (Neem Khali 2 Kg)',
        basePrice: 169,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '2 Kg bag',
        potSize: '2 Kg',
        soilType: 'Organic Bio-Pesticide & Fertilizer',
        difficulty: 'Beginner Friendly',
        plantType: 'Soil Amendment',
        careTips: 'Work into soil during potting; acts as a natural deterrent against white grubs, nematodes, and termites.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: '100% de-oiled neem seed residue with high azadirachtin content. Shields root systems naturally.'
      },
      {
        title: 'Ready-to-Use Premium Potting Mix for Indoor Plants (5 Kg)',
        basePrice: 249,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '5 Kg pre-mixed bag',
        potSize: '5 Kg',
        soilType: 'Complete Soil Mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Ready Mix',
        careTips: 'Directly pour into pot and plant without needing extra soil or chemical additives.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: 'Master formula combining cocopeat, vermicompost, perlite, river sand, neem cake, and bio-fungicide.'
      },
      {
        title: 'Expanded Clay LECA Balls Hydroton (2 Kg / 5 Liters)',
        basePrice: 229,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '2 Kg bag',
        potSize: '2 Kg',
        soilType: 'Hydroponic Substrate',
        difficulty: 'Beginner Friendly',
        plantType: 'Hydroponics & Drainage',
        careTips: 'Use as a 1-inch bottom drainage layer in pots or as primary growing medium for semi-hydroponics.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: 'Porous kiln-fired clay pebbles that trap moisture and air uniformly. Reusable indefinitely.'
      },
      {
        title: 'Steamed Bone Meal Powder Phosphorus Rich (1 Kg)',
        basePrice: 139,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '1 Kg bag',
        potSize: '1 Kg',
        soilType: 'Slow-Release Phosphorus & Calcium',
        difficulty: 'Beginner Friendly',
        plantType: 'Flowering Booster',
        careTips: 'Add 1 tablespoon per pot for roses, adeniums, and fruit plants twice a year.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: 'Natural slow-release organic source of phosphorus and calcium essential for massive root systems and bud development.'
      },
      {
        title: 'Humic Acid 98% Water Soluble Shiny Flakes (500g)',
        basePrice: 179,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '500g container',
        potSize: '500g',
        soilType: 'Root Hormone Stimulator',
        difficulty: 'Beginner Friendly',
        plantType: 'Soil Conditioner',
        careTips: 'Dissolve 2 grams per liter of water; awakens dormant root growth and increases nutrient bioavailability.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: 'High-potency potassium humate flakes derived from ancient leonardite. Breaks down hard soil compacts.'
      },
      {
        title: 'Specialized Succulent & Cactus Gritty Mix (3 Kg)',
        basePrice: 229,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '3 Kg bag',
        potSize: '3 Kg',
        soilType: 'Inorganic Gritty Mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Succulent Substrate',
        careTips: 'Zero risk of overwatering; water passes straight through in seconds leaving roots perfectly aerated.',
        imageUrls: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'],
        description: 'Formulated with pumice, zeolite, crushed lava gravel, coarse river sand, and a touch of leaf mold.'
      }
    ]
  },

  // 7. Seeds & Flower Bulbs
  {
    name: 'Seeds & Flower Bulbs',
    slug: 'seeds-bulbs',
    description: 'Exotic vegetable seeds, herb seed kits, winter flower bulbs, microgreen seeds, and fruit seeds.',
    imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&q=80',
    baseTemplates: [
      {
        title: 'Cherry Tomato Red Heirloom Seeds (Pack of 50 Seeds)',
        basePrice: 99,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: 'Seed Packet (Germinates in 5-8 days)',
        potSize: 'Suitable for 10-12 inch pots',
        soilType: 'Seed starting cocopeat mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Vegetable Seeds',
        careTips: 'Sow 0.5 cm deep in moist cocopeat. Provide 6+ hours of sun once true leaves emerge.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'High-germination rate sweet cherry tomatoes that yield prolific clusters in home terrace gardens.'
      },
      {
        title: 'Asiatic Hybrid Lily Bulbs Mix (Pack of 3 Bulbs)',
        basePrice: 249,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: 'Bulbs (Grows to 24-30 inches)',
        potSize: '6-8 inch pot per bulb',
        soilType: 'Well-draining porous sandy loam',
        difficulty: 'Beginner Friendly',
        plantType: 'Flowering Bulbs',
        careTips: 'Plant pointed end facing up, 4 inches deep. Blooms with magnificent star-shaped flowers within 60 days.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Imported disease-free Asiatic lily bulbs in a vibrant palette of sunset orange, yellow, and red.'
      },
      {
        title: 'Kitchen Herb Seed Kit 5-in-1 (Basil, Oregano, Thyme, Rosemary, Mint)',
        basePrice: 199,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '5 Individual Seed Packets',
        potSize: 'Window box or 6 inch pots',
        soilType: 'Lightweight potting soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Culinary Herbs',
        careTips: 'Harvest top leaves frequently to encourage bushy branching and fresh aromatic kitchen clippings.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Grow your own fresh, organic culinary seasoning herbs right on your apartment kitchen windowsill.'
      },
      {
        title: 'Dutch Imported Tulip Bulbs (Pack of 5 Mixed Colors)',
        basePrice: 349,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: 'Bulbs (Grows to 14-18 inches)',
        potSize: '8-10 inch wide planter',
        soilType: 'Cool gritty potting soil',
        difficulty: 'Intermediate',
        plantType: 'Winter Bulbs',
        careTips: 'Chill in crisper compartment for 4 weeks before winter planting for reliable cup blooms.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Authentic Dutch tulip bulbs producing elegant classic chalice flowers in red, gold, and purple.'
      },
      {
        title: 'Microgreen Superfood Seed Kit (Radish, Mustard, Fenugreek, Spinach)',
        basePrice: 149,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (Daily misting)',
        plantHeight: 'Harvest in 7 to 10 days (2-3 inches)',
        potSize: 'Shallow nursery germination tray',
        soilType: 'Thin layer of cocopeat or hemp mat',
        difficulty: 'Beginner Friendly',
        plantType: 'Microgreens',
        careTips: 'Mist twice daily; snip tender green shoots above soil line for nutrient-packed salads and smoothies.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Fastest home harvest possible. Packed with 40x higher vitamin concentration than mature plants.'
      },
      {
        title: 'Gladiolus Flowering Spike Bulbs (Pack of 10 Assorted Colors)',
        basePrice: 229,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: 'Bulbs (Grows to 36-48 inches)',
        potSize: '10 inch deep container',
        soilType: 'Rich sandy garden loam',
        difficulty: 'Beginner Friendly',
        plantType: 'Cut Flower Bulbs',
        careTips: 'Stake tall stems as sword-like spikes fill with ruffled blossoms.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Magnificent towering flower spikes ideal for fresh cut floral vases and cheerful garden backdrops.'
      },
      {
        title: 'French Marigold Golden Genda Seeds (Pack of 100 Seeds)',
        basePrice: 89,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: 'Grows 10-14 inches',
        potSize: '6-8 inch pot',
        soilType: 'Standard potting soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Traditional Bloomer',
        careTips: 'Acts as a natural companion plant to repel pests and whiteflies from vegetable gardens.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Resilient golden-orange pompom blossoms essential for festive home decorations and pest repelling.'
      },
      {
        title: 'Caladium Elephant Ear Bulb (Pink Symphony)',
        basePrice: 279,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: 'Bulb (Grows 14-18 inches)',
        potSize: '6 inch pot',
        soilType: 'Humus rich, moist, warm soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Foliage Bulb',
        careTips: 'Loves warm shaded spots; produces translucent neon-pink leaves with green wire borders.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Luminous heart-shaped paper leaves in translucent shocking pink that look like living stained glass.'
      },
      {
        title: 'Exotic Bell Pepper Tricolor Seeds (Red, Yellow, Green 60 Seeds)',
        basePrice: 119,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: 'Grows 18-24 inches',
        potSize: '10 inch container',
        soilType: 'Rich potting soil with compost',
        difficulty: 'Beginner Friendly',
        plantType: 'Capsicum Vegetable',
        careTips: 'Needs regular feeding with organic compost for thick, crunchy, sweet bell peppers.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Crisp, sweet thick-walled capsicums perfect for container cultivation on sunny apartment balconies.'
      },
      {
        title: 'Zinnia Elegans Giant Dahlia Flowered Seeds (Pack of 75 Seeds)',
        basePrice: 99,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: 'Grows 24-30 inches',
        potSize: '8 inch pot or flower bed',
        soilType: 'Well-draining garden soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Cut Flower',
        careTips: 'Heat-loving annual that flowers tirelessly throughout scorching Indian summers.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Vivid rainbow blooms up to 4 inches wide that attract honeybees and butterflies to gardens.'
      }
    ]
  },

  // 8. Gardening Tools & Accessories
  {
    name: 'Gardening Tools & Accessories',
    slug: 'gardening-tools',
    description: 'Heavy-duty pruning shears, brass sprayers, trowel & cultivator set, bonsai tools, and watering cans.',
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&q=80',
    baseTemplates: [
      {
        title: 'Heavy-Duty Bypass Pruning Shears (SK5 Japanese High Carbon Steel)',
        basePrice: 299,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '8.5 inch professional length',
        potSize: 'Cuts branches up to 20mm',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Beginner Friendly',
        plantType: 'Cutting Tool',
        careTips: 'Wipe sap off blades after use and apply a drop of machine oil for lifetime razor-sharp precision.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Ultra-sharp forged bypass secateurs with non-slip ergonomic handles and wire-cutting notch.'
      },
      {
        title: 'Continuous Pressure Pump Sprayer with Brass Nozzle (2 Liters)',
        basePrice: 249,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '2 Liter capacity',
        potSize: 'Handheld pump sprayer',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Beginner Friendly',
        plantType: 'Watering & Misting',
        careTips: 'Adjust front brass nozzle from ultra-fine mist to high-pressure 15-foot stream; release pressure after use.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Effortless continuous pressurized misting for indoor plants, neem oil spray, and foliar feeding.'
      },
      {
        title: 'Ergonomic Cast Aluminum Garden Tool Set (Trowel, Cultivator, Weeder)',
        basePrice: 349,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '3-Piece Heavy-Duty Set',
        potSize: 'Set of 3 hand tools',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Beginner Friendly',
        plantType: 'Soil Hand Tools',
        careTips: 'Rust-proof cast aluminum heads will not bend or snap in tough clay soil.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Premium rust-proof aluminum hand tools featuring soft rubberized grips and engraved depth markers.'
      },
      {
        title: 'Long Spout Indoor Plant Watering Can (1.8 Liters Stainless Accent)',
        basePrice: 279,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '1.8 Liter ergonomic can',
        potSize: 'Slender goose-neck spout',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Beginner Friendly',
        plantType: 'Watering Can',
        careTips: 'Slender 10-inch spout delivers water directly to soil base without wetting foliage or splashing messy soil.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Aesthetic minimalist indoor watering can engineered for precision targeting in tight planter corners.'
      },
      {
        title: 'Precision Bonsai Tool Kit (5-Piece Stainless Steel with Leather Case)',
        basePrice: 599,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '5 Specialized tools + storage roll',
        potSize: 'Full bonsai toolkit',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Intermediate',
        plantType: 'Bonsai Specialty Tools',
        careTips: 'Includes concave branch cutter, spherical knob cutter, trimming shears, root hook, and tweezers.',
        imageUrls: ['https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'],
        description: 'Complete master bonsai styling kit designed for clean flush branch wounds that heal without scarring.'
      },
      {
        title: 'Automatic Drip Irrigation DIY Balcony Kit (10-Pot System)',
        basePrice: 449,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '10-meter main pipe + 10 adjustable drippers',
        potSize: 'Covers 10 to 15 potted plants',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Beginner Friendly',
        plantType: 'Irrigation Automation',
        careTips: 'Connects to any standard outdoor tap; each dripper adjusts from slow droplet to miniature fountain.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Saves 70% water and keeps your plants lushly hydrated automatically while you are away on vacation.'
      },
      {
        title: 'Claw Gardening Gloves (Heavy-Duty Puncture Proof)',
        basePrice: 149,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: 'Standard adult fit (Pair)',
        potSize: 'Pair of protective gloves',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Beginner Friendly',
        plantType: 'Protective Gear',
        careTips: 'Built-in rigid ABS resin fingertips let you dig, rake, and scoop soil without dirtying fingernails.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Waterproof breathable latex gloves fitted with 4 clawed fingertips for effortless digging and weed pulling.'
      },
      {
        title: 'Heavy-Duty Extendable Anvil Hedge Shears (24-32 Inch)',
        basePrice: 499,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: 'Extendable telescopic arms',
        potSize: '10 inch wavy carbon blade',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Beginner Friendly',
        plantType: 'Hedge Trimmer',
        careTips: 'Wavy blade grips slippery twigs firmly preventing branch slip during manicuring.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'Telescopic hedge clippers that effortlessly shape outdoor bushes, ficus topiary, and garden hedges.'
      },
      {
        title: '3-in-1 Soil Moisture, pH, and Sunlight Meter',
        basePrice: 279,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '10 inch dual probe sensor',
        potSize: 'Battery-free analog meter',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Beginner Friendly',
        plantType: 'Soil Diagnostic Sensor',
        careTips: 'Insert probes 3-4 inches into soil; instant needle readout tells you if plant needs water, light, or acidity adjustment.',
        imageUrls: ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'],
        description: 'No batteries required. Takes the guesswork out of plant care by measuring root moisture and pH accurately.'
      },
      {
        title: 'Moss Pole Coco Coir Climbing Support Sticks (Set of 2, 24 Inch)',
        basePrice: 229,
        sunlight: 'Not applicable',
        waterRequirement: 'Not applicable',
        plantHeight: '24 inch stackable poles (Pack of 2)',
        potSize: 'Suitable for 6 to 12 inch pots',
        soilType: 'Not applicable (Tool)',
        difficulty: 'Beginner Friendly',
        plantType: 'Plant Climbing Support',
        careTips: 'Mist the natural coco fiber pole with water so monstera and philodendron aerial roots anchor securely.',
        imageUrls: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80'],
        description: 'Biodegradable coconut coir totems designed to train climbing vines and monsteras into lush vertical pillars.'
      }
    ]
  },

  // 9. Medicinal & Herb Plants
  {
    name: 'Medicinal & Herb Plants',
    slug: 'medicinal-herbs',
    description: 'Sacred Tulsi varieties, healing herbs, and therapeutic botanical flora.',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
    baseTemplates: [
      {
        title: 'Krishna Tulsi (Shyam Holy Basil Sacred Plant)',
        basePrice: 149,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '10 - 14 inches',
        potSize: '6 inch terracotta pooja pot',
        soilType: 'Sacred garden loam with vermicompost',
        difficulty: 'Beginner Friendly',
        plantType: 'Sacred Ayurvedic Herb',
        careTips: 'Place in east-facing sunny spot. Pinch off flower seed heads (manjari) to keep foliage bushy and lush.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Auspicious dark purple-leaved sacred basil revered in Indian households. Renowned immunity booster in herbal kadha.'
      },
      {
        title: 'Aloe Vera Barbadensis Miller (Medicinal Grade)',
        basePrice: 199,
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '10 - 15 inches',
        potSize: '6 inch clay pot',
        soilType: 'Sandy well-draining cactus mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Medicinal Succulent',
        careTips: 'Harvest outer thick spears for fresh skin-soothing gel. Never let root ball stay waterlogged.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Thick, fleshy succulent spears packed with bioactive soothing gel for skincare, burns, and detox smoothies.'
      },
      {
        title: 'Lemongrass (Cymbopogon Citratus Tea Plant)',
        basePrice: 169,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '18 - 24 inches',
        potSize: '7 inch nursery pot',
        soilType: 'Moist organic garden soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Aromatic Grass',
        careTips: 'Snip aromatic stalks at base for brewing refreshing immune-boosting citrus herbal tea.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Vigorous clumping citrus-scented perennial grass that naturally repels mosquitoes while flavoring culinary teas.'
      },
      {
        title: 'Brahmi (Bacopa Monnieri Memory Herb)',
        basePrice: 179,
        sunlight: 'Moderate',
        waterRequirement: 'High (Daily Watering)',
        plantHeight: '6 - 10 inches trailing',
        potSize: '6 inch shallow bowl pot',
        soilType: 'Moisture-rich boggy soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Cognitive Herb',
        careTips: 'Loves constant moisture; keep soil wet like a natural marshland. Tolerates partial shade.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Ancient Ayurvedic brain tonic and memory booster featuring succulent bright green rounded leaves.'
      },
      {
        title: 'Rosemary Fragrant Culinary Herb Bush',
        basePrice: 249,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '10 - 14 inches',
        potSize: '6 inch terracotta planter',
        soilType: 'Gritty, alkaline, free-draining mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Woody Herb',
        careTips: 'Loves Mediterranean direct sunlight. Sensitive to overwatering; let soil dry completely.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Needle-like evergreen leaves infused with pinewood camphor aroma. Essential for gourmet kitchen cooking.'
      },
      {
        title: 'Ashwagandha (Withania Somnifera Indian Ginseng)',
        basePrice: 229,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '14 - 20 inches',
        potSize: '8 inch grower pot',
        soilType: 'Dry sandy soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Adaptogen Shrub',
        careTips: 'Drought-tolerant. Thrives in warm dry climates and produces orange berries.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Revered adaptogenic super-herb proven to lower cortisol stress, increase vitality, and restore bodily stamina.'
      },
      {
        title: 'Insulin Plant (Costus Igneus Blood Sugar Balancer)',
        basePrice: 249,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '14 - 18 inches',
        potSize: '7 inch nursery pot',
        soilType: 'Rich organic loam',
        difficulty: 'Beginner Friendly',
        plantType: 'Therapeutic Herb',
        careTips: 'Chewing 1-2 leaves in the morning is traditionally used to aid metabolic blood sugar regulation.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Spiral-stemmed medicinal plant with smooth dark green leaves and occasional fiery orange flowers.'
      },
      {
        title: 'Giloy Guduchi (Tinospora Cordifolia Amrita Vine)',
        basePrice: 199,
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '18 - 26 inches climbing',
        potSize: '8 inch pot with trellis',
        soilType: 'Any garden soil',
        difficulty: 'Beginner Friendly',
        plantType: 'Immunity Vine',
        careTips: 'Extremely vigorous climber that thrives on tree trunks or balcony grilles. Zero maintenance.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'The root of immortality (Amrita). Heart-shaped leaves and stems revered for raising blood platelets and fighting fevers.'
      },
      {
        title: 'Ajwain Plant (Indian Borage / Plectranthus Amboinicus)',
        basePrice: 149,
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '8 - 12 inches',
        potSize: '5 inch pot',
        soilType: 'Fast-draining porous potting mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Digestive Herb',
        careTips: 'Crushed fleshy leaves release delicious ajwain aroma; traditional home remedy for coughs and indigestion.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Plump fuzzy leaves filled with aromatic thymol oils. Grows readily from single stem cuttings.'
      },
      {
        title: 'Patharchatta (Kalanchoe Pinnata Kidney Stone Miracle Leaf)',
        basePrice: 169,
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '10 - 15 inches',
        potSize: '6 inch clay pot',
        soilType: 'Gritty garden mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Therapeutic Succulent',
        careTips: 'Single fallen leaves sprout baby plantlets around their serrated edges. Water sparingly.',
        imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'],
        description: 'Renowned Ayurvedic home healer known for kidney stone comfort and skin wound soothing properties.'
      }
    ]
  },

  // 10. Air Purifying Plants
  {
    name: 'Air Purifying Plants',
    slug: 'air-purifying-plants',
    description: 'Top NASA-recommended natural air cleaners that detoxify indoor pollutants.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
    baseTemplates: [
      {
        title: 'Areca Palm Air Purifier (Chrysalidocarpus lutescens)',
        basePrice: 449,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '24 - 30 inches',
        potSize: '8 inch nursery planter',
        soilType: 'Rich loam with vermicompost and cocopeat',
        difficulty: 'Beginner Friendly',
        plantType: 'Foliage / Tropical',
        careTips: 'Keep near a bright window. Mist foliage in hot summers and keep soil evenly moist.',
        imageUrls: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80'],
        description: 'Ranked among the very best air-humidifying and toxin-filtering palms by NASA scientists. Adds resort-like luxury.'
      },
      {
        title: 'Boston Fern (Nephrolepis exaltata Lush Hanging)',
        basePrice: 299,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 16 inches cascading',
        potSize: '7 inch hanging basket',
        soilType: 'Peaty moisture-retentive potting mix',
        difficulty: 'Intermediate',
        plantType: 'Lush Fern',
        careTips: 'Mist regularly; thrives in humid environments like bathrooms or near water features.',
        imageUrls: ['https://images.unsplash.com/photo-1599685315640-9ceab2f58944?w=800&q=80'],
        description: 'Feathery sword-like fronds that arch gracefully while vacuuming formaldehyde from indoor air.'
      },
      {
        title: 'English Ivy (Hedera Helix Trailing Air Cleaner)',
        basePrice: 249,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '14 - 20 inches trailing',
        potSize: '6 inch hanging pot',
        soilType: 'Well-draining indoor potting mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Climbing & Trailing Vine',
        careTips: 'Proven to filter airborne mold particles. Keep in cool, shaded room.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Classic evergreen vine with star-shaped leaves proven to eliminate up to 78% of airborne fungal mold within 12 hours.'
      },
      {
        title: 'Spider Plant Variegated (Chlorophytum comosum)',
        basePrice: 179,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '8 - 12 inches',
        potSize: '5 inch hanging or desktop pot',
        soilType: 'Lightweight cocopeat potting mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Pet Safe / Air Purifying',
        careTips: 'Great for hanging baskets. Water when top layer of soil dries.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Playful cascading arching foliage with cream and green stripes. 100% pet-friendly and prolific producer of baby plantlets.'
      },
      {
        title: 'Bamboo Palm (Chamaedorea seifrizii)',
        basePrice: 499,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '26 - 34 inches',
        potSize: '9 inch planter',
        soilType: 'Rich aerated compost blend',
        difficulty: 'Beginner Friendly',
        plantType: 'Tropical Air Purifier',
        careTips: 'Tolerates low light exceptionally well. Wipe fronds occasionally to prevent spider mites.',
        imageUrls: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80'],
        description: 'Dense cluster of bamboo-like ringed canes supporting delicate dark green fronds that neutralize trichloroethylene and benzene.'
      },
      {
        title: 'Dracaena Marginata (Dragon Tree Tricolor)',
        basePrice: 349,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '18 - 26 inches',
        potSize: '7 inch nursery pot',
        soilType: 'Well-draining loam',
        difficulty: 'Beginner Friendly',
        plantType: 'Sculptural Tree',
        careTips: 'Water only when soil is 75% dry. Avoid fluoridated tap water.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Slender grey woody trunks topped with tufts of arching sword-like leaves edged in vivid crimson-red.'
      },
      {
        title: 'Weeping Fig (Ficus Benjamina Golden King)',
        basePrice: 399,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '20 - 28 inches',
        potSize: '8 inch ceramic pot',
        soilType: 'Rich humus potting soil',
        difficulty: 'Intermediate',
        plantType: 'Indoor Tree',
        careTips: 'Dislikes being moved around frequently; choose a bright spot and keep watering consistent.',
        imageUrls: ['https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'],
        description: 'Graceful weeping branches dressed in glossy variegated emerald leaves edged with buttercream.'
      },
      {
        title: 'Syngonium Podophyllum (Pixie Dwarf Arrowhead)',
        basePrice: 179,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '6 - 10 inches',
        potSize: '4.5 inch desktop pot',
        soilType: 'Organic cocopeat mix',
        difficulty: 'Beginner Friendly',
        plantType: 'Desktop Air Purifier',
        careTips: 'Compact dwarf habit; ideal for bedside tables and office workstations.',
        imageUrls: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'],
        description: 'Miniature arrowhead leaves in shades of pale mint and lime green that absorb household VOC odors.'
      },
      {
        title: 'Cast Iron Plant (Aspidistra Elatior)',
        basePrice: 449,
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '16 - 22 inches',
        potSize: '7 inch pot',
        soilType: 'Tolerant of all potting mixes',
        difficulty: 'Beginner Friendly',
        plantType: 'Indestructible Foliage',
        careTips: 'Lives up to its name; survives extreme neglect, deep shade, and temperature swings.',
        imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'],
        description: 'Broad leathery dark green paddle leaves that refuse to die even under the lowest apartment light.'
      },
      {
        title: 'Ficus Lyrata (Fiddle Leaf Fig Compacta)',
        basePrice: 599,
        sunlight: 'Moderate',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '20 - 26 inches',
        potSize: '8 inch designer planter',
        soilType: 'Rich porous soil with perlite',
        difficulty: 'Intermediate',
        plantType: 'Architectural Foliage',
        careTips: 'Requires bright indirect light. Water when top 2 inches dry; wipe violin leaves to keep glossy.',
        imageUrls: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80'],
        description: 'Dramatic violin-shaped sculptural leaves with prominent veins. The ultimate architectural statement plant.'
      }
    ]
  }
]

// Variation generators to create 100 distinct items per category (100 x 10 = 1000 items)
const POT_VARIATIONS = [
  'in Ceramic Diamond Pot',
  'in Self-Watering Planter',
  'in Terracotta Mud Pot',
  'with Moss Pole Support',
  'in Minimalist Nordic Dish',
  'in Balcony Rail Planter',
  'in Hanging Macrame Basket',
  'in Nursery Grower Pot',
  'Desktop Edition (Ceramic)',
  'Premium Gift Pack'
]

const SIZE_VARIATIONS = [
  { prefix: 'Compact Baby', sizeDelta: '6 - 9 inches', priceMod: -30 },
  { prefix: 'Standard Nursery', sizeDelta: '12 - 16 inches', priceMod: 0 },
  { prefix: 'Lush Multi-Stem', sizeDelta: '16 - 22 inches', priceMod: 50 },
  { prefix: 'Specimen Large', sizeDelta: '24 - 30 inches', priceMod: 100 },
  { prefix: 'Extra Bushy', sizeDelta: '14 - 18 inches', priceMod: 40 },
  { prefix: 'Tabletop Mini', sizeDelta: '5 - 8 inches', priceMod: -20 },
  { prefix: 'Architectural Grade', sizeDelta: '20 - 26 inches', priceMod: 80 },
  { prefix: 'Jumbo Mother Plant', sizeDelta: '28 - 36 inches', priceMod: 150 },
  { prefix: 'Dual-Plant Combo', sizeDelta: '12 - 16 inches', priceMod: 70 },
  { prefix: 'Festive Deluxe', sizeDelta: '15 - 20 inches', priceMod: 60 }
]

export async function seed1000Plants(prismaClient: PrismaClient = prisma) {
  console.log('================================================================');
  console.log('🌿 GAURAV NURSERY — 1,000 PRODUCT BULK INGESTION ENGINE');
  console.log('Target Seller: gaurav@greennursery.com (Gaurav Greenery Hub)');
  console.log('Pricing Formula: Base Price + ₹149 markup');
  console.log('Scope: 10 Categories × 100 Products = 1,000 Total Products');
  console.log('================================================================\n');

  // 1. Authenticate / Retrieve Seller Profile for gaurav@greennursery.com
  const sellerUser = await prismaClient.user.findUnique({
    where: { email: 'gaurav@greennursery.com' },
    include: { sellerProfile: true }
  })

  if (!sellerUser || !sellerUser.sellerProfile) {
    console.warn('Seller user gaurav@greennursery.com not found during seed! Skipping 1000 items.');
    return
  }

  const sellerProfileId = sellerUser.sellerProfile.id
  console.log(`[AUTH] Linked Seller Profile: ${sellerUser.sellerProfile.businessName} (ID: ${sellerProfileId})`)

  let grandTotalCreated = 0

  // 2. Loop each category
  for (let catIdx = 0; catIdx < CATEGORY_SPECS.length; catIdx++) {
    const spec = CATEGORY_SPECS[catIdx]
    const categoryNumber = (catIdx + 1).toString().padStart(2, '0')
    console.log(`\n[CAT ${categoryNumber}/10] Processing ${spec.name} (${spec.slug})...`)

    // Ensure category exists
    let category = await prismaClient.category.findUnique({ where: { slug: spec.slug } })
    if (!category) {
      category = await prismaClient.category.create({
        data: {
          name: spec.name,
          slug: spec.slug,
          description: spec.description,
          imageUrl: spec.imageUrl
        }
      })
      console.log(`  -> Created Category: ${spec.name}`)
    }

    // Generate 100 distinct products (10 base templates × 10 size/pot combinations = 100 distinct items)
    const categoryProducts = []
    let skuCounter = 1

    for (let tIdx = 0; tIdx < spec.baseTemplates.length; tIdx++) {
      const template = spec.baseTemplates[tIdx]

      for (let vIdx = 0; vIdx < 10; vIdx++) {
        const sizeVar = SIZE_VARIATIONS[vIdx]
        const potVar = POT_VARIATIONS[vIdx]

        // Rule: Base Price + ₹149 markup!
        const calculatedBase = Math.max(99, template.basePrice + sizeVar.priceMod)
        const finalSellingPrice = calculatedBase + 149
        const mrp = Math.round(finalSellingPrice * 1.35)

        const title = vIdx === 0 
          ? template.title 
          : `${sizeVar.prefix} ${template.title} ${potVar}`

        const skuCode = `GN-${spec.slug.slice(0, 3).toUpperCase()}-${(catIdx + 1) * 1000 + skuCounter}`
        const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}-${skuCounter}`
        skuCounter++

        categoryProducts.push({
          sellerId: sellerProfileId,
          categoryId: category.id,
          title,
          slug,
          sku: skuCode,
          description: `${template.description} Carefully selected from Gaurav Nursery's prime stock. Shipped in safe botanical transit packaging with live plant arrival guarantee.`,
          price: finalSellingPrice,
          mrp,
          stock: Math.floor(25 + Math.random() * 60), // 25 to 85 stock units
          images: JSON.stringify(template.imageUrls),
          sunlight: template.sunlight,
          waterRequirement: template.waterRequirement,
          plantHeight: sizeVar.sizeDelta || template.plantHeight,
          potSize: potVar.includes('in ') ? potVar.replace('in ', '') : template.potSize,
          soilType: template.soilType,
          difficulty: template.difficulty,
          plantType: template.plantType,
          careTips: template.careTips,
          status: 'LIVE',
          featured: skuCounter % 15 === 0
        })
      }
    }

    // Insert batch of 100 into Prisma
    console.log(`  -> Ingesting 100 products for ${spec.name} into database...`)
    
    // Batch in chunks of 50
    for (let i = 0; i < categoryProducts.length; i += 50) {
      const chunk = categoryProducts.slice(i, i + 50)
      await prismaClient.product.createMany({
        data: chunk
      })
    }

    grandTotalCreated += categoryProducts.length
    console.log(`  ✅ Ingested ${categoryProducts.length} items (Prices ranging ₹${categoryProducts[0].price} to ₹${categoryProducts[categoryProducts.length - 1].price})`)
  }

  const finalCount = await prismaClient.product.count()
  console.log('\n================================================================');
  console.log(`🎉 COMPLETED! Created ${grandTotalCreated} products.`);
  console.log(`📊 Total Products in Database: ${finalCount}`);
  console.log('All 1,000 products linked to seller: gaurav@greennursery.com with +₹149 pricing rule!');
  console.log('================================================================\n');
}

if (process.argv[1]?.includes('generate_1000_plants')) {
  seed1000Plants()
    .catch((e) => {
      console.error('Fatal error during 1000 products ingestion:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
