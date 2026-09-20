import User from '../models/User.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Banner from '../models/Banner.js';

export async function ensureMarketplaceBaseline() {
  try {
    // 1. Super Admin
    let admin = await User.findOne({ email: 'admin@gauravnursery.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@gauravnursery.com',
        password: 'admin123',
        role: 'super_admin'
      });
      console.log('[SEED] Super Admin created');
    } else if (admin.role !== 'super_admin' && admin.role !== 'admin') {
      admin.role = 'super_admin';
      await admin.save();
    }

    // 2. Approved Seller 1 (Gaurav Greenery Hub)
    let seller1 = await User.findOne({ email: 'gaurav@greennursery.com' });
    if (!seller1) {
      seller1 = await User.create({
        name: 'Gaurav Sharma',
        email: 'gaurav@greennursery.com',
        password: 'seller123',
        role: 'seller',
        phone: '+91 98765 43210',
        sellerProfile: {
          businessName: 'Gaurav Greenery Hub',
          shopName: 'Gaurav Greenery Hub',
          slug: 'gaurav-greenery-hub',
          bio: 'Flagship botanical nursery in Surat specializing in Thai grafted Adeniums, indoor air-purifiers, and organic soil blends.',
          nurseryAddress: 'Plot 45, Green Avenue, Dumas Road',
          city: 'Surat',
          state: 'Gujarat',
          pincode: '395007',
          panNumber: 'AAAPG1234F',
          gstNumber: '24AAAPG1234F1Z1',
          bankName: 'HDFC Bank',
          accountNumber: '50100234981122',
          ifscCode: 'HDFC0001234',
          status: 'ACTIVE',
          isApproved: true,
          commissionRate: 0.10
        }
      });
      console.log('[SEED] Approved Seller 1 created');
    }

    // 3. Approved Seller 2 (Shree Ram Plant Nursery)
    let seller2 = await User.findOne({ email: 'raj@floranursery.com' });
    if (!seller2) {
      seller2 = await User.create({
        name: 'Raj Patel',
        email: 'raj@floranursery.com',
        password: 'seller123',
        role: 'seller',
        phone: '+91 98222 11111',
        sellerProfile: {
          businessName: 'Shree Ram Plant Nursery',
          shopName: 'Shree Ram Plant Nursery',
          slug: 'shree-ram-nursery',
          nurseryAddress: 'Sardar Patel Ring Road',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380058',
          status: 'ACTIVE',
          isApproved: true,
          commissionRate: 0.10
        }
      });
      console.log('[SEED] Approved Seller 2 created');
    }

    // 4. Pending Seller 3 (Fresh Flora Nursery)
    let seller3 = await User.findOne({ email: 'fresh@flora.com' });
    if (!seller3) {
      seller3 = await User.create({
        name: 'Vikram Singh',
        email: 'fresh@flora.com',
        password: 'seller123',
        role: 'seller',
        phone: '+91 97111 22334',
        sellerProfile: {
          businessName: 'Fresh Flora Nursery',
          shopName: 'Fresh Flora Nursery',
          nurseryAddress: 'Alkapuri Main Road',
          city: 'Vadodara',
          state: 'Gujarat',
          pincode: '390007',
          status: 'KYC_PENDING',
          isApproved: false,
          commissionRate: 0.10
        }
      });
      console.log('[SEED] Pending Seller 3 created');
    }

    // 5. Delivery Partner
    let delivery = await User.findOne({ email: 'delivery@gauravnursery.com' });
    if (!delivery) {
      delivery = await User.create({
        name: 'Ramesh Rider',
        email: 'delivery@gauravnursery.com',
        password: 'delivery123',
        role: 'delivery_partner',
        phone: '+91 99887 76655'
      });
      console.log('[SEED] Delivery Partner created');
    }

    // 6. Customer User
    let customer = await User.findOne({ email: 'customer@gmail.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Anjali Mehta',
        email: 'customer@gmail.com',
        password: 'customer123',
        role: 'customer',
        phone: '+91 99887 66554'
      });
      console.log('[SEED] Customer created');
    }

    // 7. Seed "Bougainvillea Royal Magenta Bonsai" in PENDING_REVIEW if not present
    let boug = await Product.findOne({ sku: 'GN-BOU-007' });
    if (!boug) {
      boug = await Product.create({
        title: 'Bougainvillea Royal Magenta Bonsai',
        name: 'Bougainvillea Royal Magenta Bonsai',
        slug: 'bougainvillea-royal-magenta',
        sku: 'GN-BOU-007',
        description: 'Spectacular trailing bougainvillea with paper-thin fuchsia blooms. Heat tolerant and vibrant.',
        category: 'Outdoor Plants',
        price: 550.0,
        mrp: 750.0,
        stock: 15,
        status: 'pending_review',
        sunlight: 'Full Sun (Outdoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '14 - 18 inches',
        potSize: '8 inch mud pot',
        difficulty: 'Intermediate',
        plantType: 'Flowering Shrub',
        seller: seller1._id,
        images: [{ url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80' }]
      });
      console.log('[SEED] Bougainvillea Royal Magenta Bonsai seeded in pending_review');
    }

    // 7B. Seed Curated Ugaoo Bestsellers in LIVE status
    const ugaooCatalog = [
      {
        sku: 'GN-UGA-1001',
        title: 'Lucky Bamboo Plant - 2 Layer (with Decorative Bowl)',
        slug: 'lucky-bamboo-2-layer-bowl',
        description: 'Specialized 2-tier Lucky Bamboo (Dracaena sanderiana) cultivated in pristine nursery conditions with a decorative glass bowl. Purifies indoor air, attracts prosperity and vitality. Perfect for office desks, living spaces, and auspicious gifting.',
        category: 'Indoor Plants',
        price: 399.0,
        mrp: 499.0,
        stock: 50,
        status: 'live',
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '15 - 20 cm',
        potSize: '8 - 10 cm Glass Bowl',
        difficulty: 'Beginner Friendly',
        plantType: 'Good Luck / Air Purifying',
        images: [
          { url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80' }
        ]
      },
      {
        sku: 'GN-UGA-1002',
        title: 'Golden Money Plant (Epipremnum aureum)',
        slug: 'golden-money-plant-epipremnum',
        description: 'Classic Indian home favorite with glossy heart-shaped foliage splashed with golden yellow hues. NASA air purifier that thrives with minimal fuss and brings positive Vastu energy.',
        category: 'Indoor Plants',
        price: 299.0,
        mrp: 399.0,
        stock: 60,
        status: 'live',
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 15 inches',
        potSize: '5 inch self-watering pot',
        difficulty: 'Beginner Friendly',
        plantType: 'Air Purifying / Vastu',
        images: [{ url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80' }]
      },
      {
        sku: 'GN-UGA-1003',
        title: 'ZZ Plant (Zamioculcas zamiifolia)',
        slug: 'zz-plant-zamioculcas',
        description: 'Virtually indestructible plant featuring architectural stems and naturally shiny, deep green waxy leaves. Perfect for modern living rooms and low-light apartment corners.',
        category: 'Indoor Plants',
        price: 499.0,
        mrp: 699.0,
        stock: 40,
        status: 'live',
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '14 - 18 inches',
        potSize: '6 inch nursery pot',
        difficulty: 'Beginner Friendly',
        plantType: 'Air Purifying / Low Maintenance',
        images: [{ url: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800&q=80' }]
      },
      {
        sku: 'GN-UGA-1004',
        title: 'Sansevieria Snake Plant (Futura Superba)',
        slug: 'snake-plant-futura-superba',
        description: 'Heavy-duty air purifier that releases oxygen during nighttime. Broad upright variegated leaves bordered with striking golden-yellow margins.',
        category: 'Indoor Plants',
        price: 349.0,
        mrp: 499.0,
        stock: 75,
        status: 'live',
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '12 - 16 inches',
        potSize: '5 inch ceramic planter',
        difficulty: 'Beginner Friendly',
        plantType: 'Air Purifying',
        images: [{ url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&q=80' }]
      },
      {
        sku: 'GN-UGA-1005',
        title: 'Jade Plant Mini (Crassula ovata)',
        slug: 'jade-plant-mini-crassula',
        description: 'Vastu and Feng Shui favorite with plump, jade-green teardrop succulent leaves. Associated with financial growth, luck, and positive energy.',
        category: 'Bonsai & Succulents',
        price: 299.0,
        mrp: 399.0,
        stock: 55,
        status: 'live',
        sunlight: 'Moderate',
        waterRequirement: 'Low (Once a week)',
        plantHeight: '6 - 9 inches',
        potSize: '4 inch ceramic planter',
        difficulty: 'Beginner Friendly',
        plantType: 'Good Luck / Succulent',
        images: [{ url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80' }]
      },
      {
        sku: 'GN-UGA-1006',
        title: 'Peace Lily (Spathiphyllum) Flowering',
        slug: 'peace-lily-spathiphyllum-flowering',
        description: 'Lush emerald foliage paired with elegant white blooms. Renowned for filtering airborne toxins like benzene, carbon monoxide, and formaldehyde.',
        category: 'Indoor Plants',
        price: 399.0,
        mrp: 549.0,
        stock: 35,
        status: 'live',
        sunlight: 'Low Light (Indoor)',
        waterRequirement: 'Moderate (2-3 days)',
        plantHeight: '12 - 15 inches',
        potSize: '6 inch self-watering pot',
        difficulty: 'Beginner Friendly',
        plantType: 'Flowering / Air Purifying',
        images: [{ url: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80' }]
      }
    ];

    for (const p of ugaooCatalog) {
      const exists = await Product.findOne({ sku: p.sku });
      if (!exists) {
        await Product.create({
          ...p,
          name: p.title,
          seller: seller1._id
        });
      }
    }
    console.log('[SEED] Curated Ugaoo bestsellers verified in MongoDB');

    // 8. Default Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.create({
        code: 'MONSOON10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 500,
        isActive: true
      });
      console.log('[SEED] Default coupon created');
    }

    // 9. Default Banners
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      await Banner.create({
        title: 'Monsoon Plant Festival',
        subtitle: 'Up to 30% off on outdoor flowering varieties',
        imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1200&q=80',
        linkUrl: '/shop',
        badgeText: 'SEASONAL SPECIAL',
        displayOrder: 1,
        isActive: true
      });
      console.log('[SEED] Default banner created');
    }

    console.log('[SEED] Marketplace baseline verified successfully');
  } catch (err) {
    console.error('[SEED] Error verifying marketplace baseline:', err);
  }
}
