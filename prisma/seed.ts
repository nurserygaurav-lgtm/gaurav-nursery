import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Gaurav Nursery Database Seeding...')

  // Clean existing data
  await prisma.review.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.commissionLedger.deleteMany()
  await prisma.sellerPayout.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.subOrder.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.sellerProfile.deleteMany()
  await prisma.user.deleteMany()

  const adminPassword = await bcrypt.hash('admin123', 10)
  const sellerPassword = await bcrypt.hash('seller123', 10)
  const customerPassword = await bcrypt.hash('customer123', 10)
  const deliveryPassword = await bcrypt.hash('delivery123', 10)

  // 1. Super Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gauravnursery.com',
      name: 'Super Admin (Gaurav)',
      passwordHash: adminPassword,
      phone: '+91 98765 43210',
      role: 'SUPER_ADMIN',
    },
  })

  // 2. Approved Seller 1 (Flagship Nursery - Gaurav Greenery Hub)
  const sellerUser1 = await prisma.user.create({
    data: {
      email: 'gaurav@greennursery.com',
      name: 'Gaurav Sharma',
      passwordHash: sellerPassword,
      phone: '+91 98220 11223',
      role: 'SELLER',
    },
  })

  const sellerProfile1 = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser1.id,
      businessName: 'Gaurav Greenery Hub',
      slug: 'gaurav-greenery-hub',
      bio: 'Flagship botanical nursery in Surat specializing in Thai grafted Adeniums, indoor air-purifiers, and organic soil blends with live plant transit guarantee.',
      rating: 4.9,
      totalSalesCount: 142,
      nurseryAddress: 'Plot 45, Green Avenue, Dumas Road',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395007',
      panNumber: 'AAAPG1234F',
      gstNumber: '24AAAPG1234F1Z1',
      bankName: 'HDFC Bank',
      accountNumber: '50100234981122',
      ifscCode: 'HDFC0001234',
      accountHolderName: 'Gaurav Greenery Hub',
      upiId: 'gauravgreen@hdfcbank',
      status: 'ACTIVE',
      commissionRate: 0.10,
      availableBalance: 3240.0,
      totalEarned: 14500.0,
      nurseryPhotos: JSON.stringify([
        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
        'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'
      ]),
    },
  })

  // 3. Approved Seller 2 (Shree Ram Plant Nursery)
  const sellerUser2 = await prisma.user.create({
    data: {
      email: 'raj@floranursery.com',
      name: 'Rajesh Patel',
      passwordHash: sellerPassword,
      phone: '+91 98790 99887',
      role: 'SELLER',
    },
  })

  const sellerProfile2 = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser2.id,
      businessName: 'Shree Ram Plant Nursery',
      slug: 'shree-ram-plant-nursery',
      bio: 'Renowned Bonsai masters and rare flowering plant growers in Ahmedabad with over 25 years of horticultural expertise.',
      rating: 4.8,
      totalSalesCount: 95,
      nurseryAddress: 'Near Sarkhej Cross Road, SG Highway',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380054',
      panNumber: 'BBBPG5678R',
      gstNumber: '24BBBPG5678R1Z9',
      bankName: 'ICICI Bank',
      accountNumber: '001205012345',
      ifscCode: 'ICIC0000012',
      accountHolderName: 'Shree Ram Plants',
      upiId: 'shreeramplants@icici',
      status: 'ACTIVE',
      commissionRate: 0.10,
      availableBalance: 1890.0,
      totalEarned: 8900.0,
      nurseryPhotos: JSON.stringify([
        'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=800&q=80'
      ]),
    },
  })

  // 4. Pending KYC Seller 3 (For testing Admin Seller Review flow)
  const sellerUser3 = await prisma.user.create({
    data: {
      email: 'fresh@flora.com',
      name: 'Vikas Verma',
      passwordHash: sellerPassword,
      phone: '+91 97230 44556',
      role: 'SELLER',
    },
  })

  await prisma.sellerProfile.create({
    data: {
      userId: sellerUser3.id,
      businessName: 'Fresh Flora Nursery',
      nurseryAddress: 'Sayajigunj Circle',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390005',
      panNumber: 'CCCPG9988K',
      gstNumber: '24CCCPG9988K1Z3',
      bankName: 'State Bank of India',
      accountNumber: '31298765432',
      ifscCode: 'SBIN0001234',
      accountHolderName: 'Fresh Flora Nursery',
      upiId: 'freshflora@sbi',
      status: 'KYC_PENDING',
      commissionRate: 0.10,
      nurseryPhotos: JSON.stringify([
        'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80'
      ]),
    },
  })

  // 5. Customer User
  const customer = await prisma.user.create({
    data: {
      email: 'customer@gmail.com',
      name: 'Anjali Mehta',
      passwordHash: customerPassword,
      phone: '+91 99887 66554',
      role: 'CUSTOMER',
    },
  })

  // 6. Delivery Partner
  const delivery = await prisma.user.create({
    data: {
      email: 'delivery@gauravnursery.com',
      name: 'Ramesh Rider',
      passwordHash: deliveryPassword,
      phone: '+91 91234 56789',
      role: 'DELIVERY_PARTNER',
    },
  })

  // 7. Categories
  const catIndoor = await prisma.category.create({
    data: {
      name: 'Indoor Plants',
      slug: 'indoor-plants',
      description: 'Low maintenance, air purifying plants suitable for living rooms and offices',
      imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
    },
  })

  const catOutdoor = await prisma.category.create({
    data: {
      name: 'Outdoor Plants',
      slug: 'outdoor-plants',
      description: 'Sun-loving plants, hardy flowering shrubs, and landscape ornamentals',
      imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80',
    },
  })

  const catFlowering = await prisma.category.create({
    data: {
      name: 'Flowering Plants',
      slug: 'flowering-plants',
      description: 'Vibrant blooms, exotic adeniums, fragrant roses, and orchids',
      imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&q=80',
    },
  })

  const catBonsai = await prisma.category.create({
    data: {
      name: 'Bonsai & Succulents',
      slug: 'bonsai-succulents',
      description: 'Artistic miniature trees and drought-tolerant hardy succulents',
      imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&q=80',
    },
  })

  const catPots = await prisma.category.create({
    data: {
      name: 'Pots & Planters',
      slug: 'pots-planters',
      description: 'Ceramic, terracotta, and durable UV-treated planters for modern homes',
      imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80',
    },
  })

  const catFertilizers = await prisma.category.create({
    data: {
      name: 'Soil & Organic Fertilizers',
      slug: 'soil-fertilizers',
      description: '100% organic vermicompost, neem khali, cocopeat, and nutrient mixes',
      imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&q=80',
    },
  })

  // 8. Specialized Plant Products
  const p1 = await prisma.product.create({
    data: {
      sellerId: sellerProfile1.id,
      categoryId: catFlowering.id,
      title: 'Adenium Desert Rose (Grafted Thai Hybrid)',
      slug: 'adenium-desert-rose-thai-hybrid',
      sku: 'GN-ADE-001',
      description: 'Stunning sculpted caudex with brilliant multi-layered magenta blossoms. Thrives in bright Indian sunlight with minimal water.',
      price: 499.0,
      mrp: 699.0,
      stock: 45,
      status: 'LIVE',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80',
        'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80'
      ]),
      sunlight: 'Full Sun (Outdoor)',
      waterRequirement: 'Low (Once a week)',
      plantHeight: '10 - 14 inches',
      potSize: '6 inch nursery pot',
      soilType: 'Well-draining gritty mix (Adenium special)',
      difficulty: 'Beginner Friendly',
      plantType: 'Flowering Succulent',
      careTips: 'Provide 5-6 hours of direct sunlight. Allow soil to completely dry out before watering again. Fertilize during summer growing season.',
    },
  })

  const p2 = await prisma.product.create({
    data: {
      sellerId: sellerProfile1.id,
      categoryId: catIndoor.id,
      title: 'Sansevieria Golden Laurentii (Snake Plant)',
      slug: 'snake-plant-golden-laurentii',
      sku: 'GN-SNK-002',
      description: 'NASA recommended top air purifying plant that converts CO2 to oxygen overnight. Distinct yellow-bordered architectural foliage.',
      price: 299.0,
      mrp: 399.0,
      stock: 80,
      status: 'LIVE',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&q=80'
      ]),
      sunlight: 'Low Light (Indoor)',
      waterRequirement: 'Low (Once a week)',
      plantHeight: '12 - 16 inches',
      potSize: '5 inch self-watering pot',
      soilType: 'Standard potting soil + 20% cocopeat',
      difficulty: 'Beginner Friendly',
      plantType: 'Air Purifying',
      careTips: 'Can survive in dim indoor corners. Water once every 7-10 days. Do not let water sit in the central rosette.',
    },
  })

  const p3 = await prisma.product.create({
    data: {
      sellerId: sellerProfile2.id,
      categoryId: catBonsai.id,
      title: 'Ginseng Ficus Microcarpa Bonsai (S-Curve Trunk)',
      slug: 'ginseng-ficus-microcarpa-bonsai',
      sku: 'GN-FIC-003',
      description: 'Graceful aesthetic tabletop bonsai with aerial banyan roots. Brings Zen peace, prosperity, and natural elegance to your desk or living room.',
      price: 899.0,
      mrp: 1299.0,
      stock: 20,
      status: 'LIVE',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80'
      ]),
      sunlight: 'Moderate',
      waterRequirement: 'Moderate (2-3 days)',
      plantHeight: '8 - 12 inches',
      potSize: '7 inch ceramic shallow dish',
      soilType: 'Akadama & pumice gravel blend',
      difficulty: 'Intermediate',
      plantType: 'Bonsai',
      careTips: 'Keep near bright indirect window. Mist foliage regularly. Prune excess shoots every 2 months to retain silhouette.',
    },
  })

  const p4 = await prisma.product.create({
    data: {
      sellerId: sellerProfile2.id,
      categoryId: catIndoor.id,
      title: 'Peace Lily (Spathiphyllum) - Air Purifier',
      slug: 'peace-lily-spathiphyllum',
      sku: 'GN-PCE-004',
      description: 'Elegant dark green leaves with graceful white porcelain spathes. Absorbs harmful household VOCs and signals thirst clearly by drooping.',
      price: 349.0,
      mrp: 499.0,
      stock: 35,
      status: 'LIVE',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80'
      ]),
      sunlight: 'Low Light (Indoor)',
      waterRequirement: 'Moderate (2-3 days)',
      plantHeight: '12 - 15 inches',
      potSize: '6 inch recycled planter',
      soilType: 'Moisture retentive rich organic loam',
      difficulty: 'Beginner Friendly',
      plantType: 'Air Purifying',
      careTips: 'Keep away from scorching direct afternoon sun. Water whenever top 1 inch of soil feels dry. Wipe leaves occasionally with a damp cloth.',
    },
  })

  const p5 = await prisma.product.create({
    data: {
      sellerId: sellerProfile1.id,
      categoryId: catPots.id,
      title: 'Handcrafted Terracotta Ribbed Planter (8 Inch)',
      slug: 'terracotta-ribbed-planter-8in',
      sku: 'GN-POT-005',
      description: 'Natural porous clay planter that lets roots breathe freely and prevents fungal root rot. Includes built-in drainage hole.',
      price: 399.0,
      mrp: 549.0,
      stock: 50,
      status: 'LIVE',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'
      ]),
      sunlight: 'Full Sun (Outdoor)',
      waterRequirement: 'Low (Once a week)',
      potSize: '8 inch diameter x 7 inch depth',
      difficulty: 'Beginner Friendly',
      plantType: 'Planter',
      careTips: 'Rinse with water before initial planting. Perfect for succulents, adeniums, and herbs.',
    },
  })

  const p6 = await prisma.product.create({
    data: {
      sellerId: sellerProfile2.id,
      categoryId: catFertilizers.id,
      title: 'Premium Organic Neem Vermicompost (5 Kg Bag)',
      slug: 'premium-organic-neem-vermicompost-5kg',
      sku: 'GN-FER-006',
      description: '100% pure organic earthworm manure enriched with natural cold-pressed neem cake. Boosts soil microbial activity and repels root pests.',
      price: 249.0,
      mrp: 350.0,
      stock: 100,
      status: 'LIVE',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80'
      ]),
      difficulty: 'Beginner Friendly',
      careTips: 'Top dress 2-3 handfuls around root drip line once every 20-30 days, followed by thorough watering.',
    },
  })

  // 9. One Product in PENDING_REVIEW status (to test Admin product approval queue!)
  await prisma.product.create({
    data: {
      sellerId: sellerProfile1.id,
      categoryId: catOutdoor.id,
      title: 'Bougainvillea Royal Magenta Bonsai',
      slug: 'bougainvillea-royal-magenta',
      sku: 'GN-BOU-007',
      description: 'Spectacular trailing bougainvillea with paper-thin fuchsia blooms. Heat tolerant and vibrant.',
      price: 550.0,
      mrp: 750.0,
      stock: 15,
      status: 'PENDING_REVIEW', // Awaiting Admin Approval
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'
      ]),
      sunlight: 'Full Sun (Outdoor)',
      waterRequirement: 'Low (Once a week)',
      plantHeight: '14 - 18 inches',
      potSize: '8 inch mud pot',
      difficulty: 'Intermediate',
      plantType: 'Flowering Shrub',
    },
  })

  // 10. Pre-seed a Multi-Vendor Master Order + SubOrders + 10% Commission Ledger
  // Customer bought:
  // - 1x Adenium from Seller 1 (₹499)
  // - 1x Ginseng Bonsai from Seller 2 (₹899)
  // Total: ₹1398.0
  // Seller 1 Subtotal: ₹499 -> 10% Fee: ₹49.9 -> Seller Net: ₹449.1
  // Seller 2 Subtotal: ₹899 -> 10% Fee: ₹89.9 -> Seller Net: ₹809.1
  // Platform Total Commission: ₹139.8
  const masterOrder = await prisma.order.create({
    data: {
      orderNumber: 'GN-2026-1001',
      customerId: customer.id,
      customerName: 'Anjali Mehta',
      customerEmail: 'customer@gmail.com',
      customerPhone: '+91 99887 66554',
      shippingAddress: 'Flat 402, Sunshine Heights, Althan Canal Road',
      shippingCity: 'Surat',
      shippingState: 'Gujarat',
      shippingPincode: '395017',
      totalGrossAmount: 1398.0,
      totalPlatformFee: 139.8,
      totalSellerNet: 1258.2,
      paymentMethod: 'TEST_PAYMENT',
      paymentStatus: 'PAID',
      masterStatus: 'PROCESSING',
    },
  })

  // SubOrder A (Seller 1: Gaurav Greenery Hub)
  const subOrderA = await prisma.subOrder.create({
    data: {
      subOrderNumber: 'GN-2026-1001-A',
      orderId: masterOrder.id,
      sellerId: sellerProfile1.id,
      deliveryPartnerId: delivery.id,
      grossAmount: 499.0,
      platformFee: 49.9,
      sellerNet: 449.1,
      fulfillmentStatus: 'PACKED',
      trackingNumber: 'GN-EXP-90812',
      deliveryNotes: 'Keep upright, live plant packaging',
    },
  })

  await prisma.orderItem.create({
    data: {
      subOrderId: subOrderA.id,
      productId: p1.id,
      productTitle: p1.title,
      productImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
      unitPrice: 499.0,
      quantity: 1,
      lineTotal: 499.0,
      commissionRate: 0.10,
      commissionAmount: 49.9,
      sellerEarning: 449.1,
    },
  })

  // 10% Immutable Commission Ledger Entry for SubOrder A
  await prisma.commissionLedger.create({
    data: {
      subOrderId: subOrderA.id,
      sellerId: sellerProfile1.id,
      orderAmount: 499.0,
      commissionRate: 0.10,
      platformFee: 49.9,
      sellerGross: 449.1,
      refundAmount: 0.0,
      sellerPayable: 449.1,
      settlementStatus: 'PENDING_DELIVERY',
    },
  })

  // SubOrder B (Seller 2: Shree Ram Plant Nursery)
  const subOrderB = await prisma.subOrder.create({
    data: {
      subOrderNumber: 'GN-2026-1001-B',
      orderId: masterOrder.id,
      sellerId: sellerProfile2.id,
      deliveryPartnerId: delivery.id,
      grossAmount: 899.0,
      platformFee: 89.9,
      sellerNet: 809.1,
      fulfillmentStatus: 'SHIPPED',
      trackingNumber: 'GN-EXP-90813',
    },
  })

  await prisma.orderItem.create({
    data: {
      subOrderId: subOrderB.id,
      productId: p3.id,
      productTitle: p3.title,
      productImage: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80',
      unitPrice: 899.0,
      quantity: 1,
      lineTotal: 899.0,
      commissionRate: 0.10,
      commissionAmount: 89.9,
      sellerEarning: 809.1,
    },
  })

  // 10% Immutable Commission Ledger Entry for SubOrder B
  await prisma.commissionLedger.create({
    data: {
      subOrderId: subOrderB.id,
      sellerId: sellerProfile2.id,
      orderAmount: 899.0,
      commissionRate: 0.10,
      platformFee: 89.9,
      sellerGross: 809.1,
      refundAmount: 0.0,
      sellerPayable: 809.1,
      settlementStatus: 'ELIGIBLE_FOR_PAYOUT',
    },
  })

  // 11. Banners (CMS)
  await prisma.banner.create({
    data: {
      title: 'Monsoon Adenium Hybrid Special',
      subtitle: 'Direct from Surat nursery growers • 10% platform guarantee • Live root safe transit',
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1600&q=80',
      linkUrl: '/shop?category=flowering-plants',
      badgeText: 'DIRECT NURSERY HARVEST',
      displayOrder: 1,
      isActive: true,
    },
  })

  await prisma.banner.create({
    data: {
      title: 'NASA Certified Air Purifiers for Low Light',
      subtitle: 'Sansevieria & Peace Lily varieties starting at ₹299 directly from Ahmedabad gardens',
      imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=1600&q=80',
      linkUrl: '/shop?category=indoor-plants',
      badgeText: 'LOW LIGHT SPECIAL',
      displayOrder: 2,
      isActive: true,
    },
  })

  // 12. Coupons
  await prisma.coupon.create({
    data: {
      code: 'GREEN10',
      discountType: 'PERCENTAGE',
      discountValue: 10.0,
      minOrderAmount: 499.0,
      maxDiscount: 150.0,
      isActive: true,
    },
  })

  await prisma.coupon.create({
    data: {
      code: 'FIRSTPLANT',
      discountType: 'FLAT',
      discountValue: 50.0,
      minOrderAmount: 299.0,
      isActive: true,
    },
  })

  // 13. Verified Purchase Reviews
  await prisma.review.create({
    data: {
      productId: p1.id,
      customerId: customer.id,
      rating: 5,
      comment: 'Packaging was unbelievable! Live adenium arrived with intact caudex and three healthy flower buds. Highly recommend Gaurav Greenery Hub!',
      isVerifiedPurchase: true,
    },
  })

  await prisma.review.create({
    data: {
      productId: p2.id,
      customerId: customer.id,
      rating: 5,
      comment: 'Thriving in my low light bedroom for past two weeks. Soil was properly moist and pot was packed securely.',
      isVerifiedPurchase: true,
    },
  })

  console.log('✅ Gaurav Nursery Database Seeding Completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
