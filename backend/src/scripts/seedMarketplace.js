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
