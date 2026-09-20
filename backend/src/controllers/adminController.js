import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import CommissionLedger from '../models/CommissionLedger.js';
import Coupon from '../models/Coupon.js';
import Banner from '../models/Banner.js';
import AuditLog from '../models/AuditLog.js';

export const getAdminMetrics = asyncHandler(async (_req, res) => {
  const [
    ordersCount,
    activeSellersCount,
    pendingSellersCount,
    totalProductsCount,
    pendingProductsCount,
    allOrders,
    commissionLedgers,
    recentOrders
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({
      role: { $in: ['seller', 'SELLER'] },
      $or: [{ 'sellerProfile.status': 'ACTIVE' }, { 'sellerProfile.isApproved': true }]
    }),
    User.countDocuments({
      role: { $in: ['seller', 'SELLER'] },
      'sellerProfile.status': 'KYC_PENDING'
    }),
    Product.countDocuments({ status: { $ne: 'archived' } }),
    Product.countDocuments({ status: { $in: ['pending_review', 'PENDING_REVIEW'] } }),
    Order.find().select('totalAmount totalGrossAmount totalPlatformFee totalSellerNet status').lean(),
    CommissionLedger.find().lean(),
    Order.find()
      .populate('customer', 'name email phone')
      .populate('items.product', 'title images price')
      .populate('items.seller', 'name sellerProfile.shopName')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean()
  ]);

  const totalGrossSales = allOrders.reduce(
    (sum, o) => sum + (o.totalGrossAmount || o.totalAmount || 0),
    0
  );
  const totalPlatformCommission = allOrders.reduce(
    (sum, o) => sum + (o.totalPlatformFee || (o.totalGrossAmount || o.totalAmount || 0) * 0.10),
    0
  );
  const totalSellerPayouts = allOrders.reduce(
    (sum, o) => sum + (o.totalSellerNet || (o.totalGrossAmount || o.totalAmount || 0) * 0.90),
    0
  );

  const pendingPayoutAmount = commissionLedgers
    .filter((l) => l.settlementStatus === 'ELIGIBLE_FOR_PAYOUT')
    .reduce((sum, l) => sum + (l.sellerPayable || 0), 0);

  res.json({
    metrics: {
      totalGrossSales: Math.round(totalGrossSales * 100) / 100,
      totalPlatformCommission: Math.round(totalPlatformCommission * 100) / 100,
      totalSellerPayouts: Math.round(totalSellerPayouts * 100) / 100,
      ordersCount,
      activeSellersCount,
      pendingSellersCount,
      totalProductsCount,
      pendingProductsCount,
      pendingPayoutAmount: Math.round(pendingPayoutAmount * 100) / 100
    },
    recentOrders
  });
});

export const getAdminProducts = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { status: { $ne: 'archived' } };

  if (status) {
    if (status === 'PENDING_REVIEW' || status === 'pending_review') {
      filter.status = { $in: ['PENDING_REVIEW', 'pending_review'] };
    } else if (status === 'LIVE' || status === 'live' || status === 'active') {
      filter.status = { $in: ['LIVE', 'live', 'active'] };
    } else {
      filter.status = status;
    }
  }

  const products = await Product.find(filter)
    .populate('seller', 'name email phone sellerProfile')
    .sort({ createdAt: -1 })
    .lean();

  const formatted = products.map((p) => {
    let images = [];
    if (Array.isArray(p.images)) {
      images = p.images.map((img) => (typeof img === 'string' ? img : img.url));
    } else if (typeof p.images === 'string') {
      try {
        images = JSON.parse(p.images);
      } catch {
        images = [p.images];
      }
    }

    const sellerObj = p.seller || {};
    const sellerProfile = sellerObj.sellerProfile || {};

    const normalizedStatus =
      p.status === 'pending_review'
        ? 'PENDING_REVIEW'
        : p.status === 'live' || p.status === 'active'
        ? 'LIVE'
        : p.status === 'rejected'
        ? 'REJECTED'
        : p.status === 'draft'
        ? 'DRAFT'
        : p.status;

    return {
      ...p,
      id: p._id.toString(),
      _id: p._id.toString(),
      title: p.title || p.name,
      status: normalizedStatus,
      images,
      seller: {
        id: sellerObj._id ? sellerObj._id.toString() : '',
        businessName: sellerProfile.businessName || sellerProfile.shopName || sellerObj.name || 'Local Nursery',
        city: sellerProfile.city || sellerObj.address?.city || 'Gujarat'
      },
      category: {
        name: p.category || 'Plants'
      }
    };
  });

  res.json({ products: formatted });
});

export const moderateProduct = asyncHandler(async (req, res) => {
  const { productId, action, rejectionReason } = req.body;

  if (!productId || !action) {
    res.status(400);
    throw new Error('productId and action are required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const isApprove = action === 'APPROVE';
  const newStatus = isApprove ? 'live' : 'rejected';

  product.status = newStatus;
  product.rejectionReason = isApprove ? null : rejectionReason || 'Product specs do not meet quality guidelines';
  await product.save();

  await AuditLog.create({
    actorId: req.user._id.toString(),
    actorRole: req.user.role,
    action: `PRODUCT_STATUS_${newStatus.toUpperCase()}`,
    entityType: 'PRODUCT',
    entityId: productId,
    metadata: {
      title: product.title || product.name,
      action,
      newStatus
    }
  });

  res.json({
    success: true,
    message: `Product is now ${newStatus.toUpperCase()}`,
    product: {
      ...product.toObject(),
      id: product._id.toString(),
      status: newStatus.toUpperCase()
    }
  });
});

export const bulkModerateProducts = asyncHandler(async (req, res) => {
  const { productIds, action, rejectionReason } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0 || !action) {
    res.status(400);
    throw new Error('productIds array and action are required');
  }

  const isApprove = action === 'APPROVE_ALL';
  const newStatus = isApprove ? 'live' : 'rejected';

  const updateData = {
    status: newStatus,
    rejectionReason: isApprove ? null : rejectionReason || 'Bulk rejection by admin'
  };

  await Product.updateMany({ _id: { $in: productIds } }, { $set: updateData });

  await AuditLog.create({
    actorId: req.user._id.toString(),
    actorRole: req.user.role,
    action: `BULK_PRODUCTS_${newStatus.toUpperCase()}`,
    entityType: 'PRODUCT',
    metadata: {
      count: productIds.length,
      productIds,
      action
    }
  });

  res.json({
    success: true,
    message: `Successfully ${isApprove ? 'approved' : 'rejected'} ${productIds.length} products`
  });
});

export const getAdminSellers = asyncHandler(async (_req, res) => {
  const sellers = await User.find({ role: { $in: ['seller', 'SELLER'] } })
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();

  const formatted = sellers.map((s) => {
    const prof = s.sellerProfile || {};
    return {
      id: s._id.toString(),
      userId: s._id.toString(),
      businessName: prof.businessName || prof.shopName || s.name,
      email: s.email,
      phone: s.phone,
      user: {
        id: s._id.toString(),
        name: s.name || prof.businessName || 'Verified Partner',
        email: s.email,
        phone: s.phone || ''
      },
      nurseryAddress: prof.nurseryAddress || prof.businessAddress || s.address?.street || '',
      city: prof.city || s.address?.city || 'Surat',
      state: prof.state || s.address?.state || 'Gujarat',
      pincode: prof.pincode || s.address?.pincode || '',
      panNumber: prof.panNumber || '',
      gstNumber: prof.gstNumber || '',
      bankName: prof.bankName || '',
      accountNumber: prof.accountNumber || '',
      ifscCode: prof.ifscCode || '',
      status: prof.status || (prof.isApproved ? 'ACTIVE' : 'KYC_PENDING'),
      rejectionReason: prof.rejectionReason,
      commissionRate: prof.commissionRate || 0.10,
      rating: prof.rating || 4.8,
      totalSalesCount: prof.totalSalesCount || 0,
      availableBalance: prof.availableBalance || 0,
      totalEarned: prof.totalEarned || 0,
      createdAt: s.createdAt
    };
  });

  res.json({ sellers: formatted });
});

export const moderateSeller = asyncHandler(async (req, res) => {
  const { sellerId, action, rejectionReason } = req.body;

  if (!sellerId || !action) {
    res.status(400);
    throw new Error('sellerId and action are required');
  }

  const seller = await User.findById(sellerId);
  if (!seller) {
    res.status(404);
    throw new Error('Seller not found');
  }

  let newStatus = 'ACTIVE';
  let isApproved = true;

  if (action === 'APPROVE' || action === 'ACTIVATE') {
    newStatus = 'ACTIVE';
    isApproved = true;
  } else if (action === 'REJECT') {
    newStatus = 'REJECTED';
    isApproved = false;
  } else if (action === 'SUSPEND') {
    newStatus = 'SUSPENDED';
    isApproved = false;
  }

  seller.sellerProfile = {
    ...seller.sellerProfile?.toObject?.(),
    status: newStatus,
    isApproved,
    rejectionReason: action === 'REJECT' ? rejectionReason || 'KYC verification documents invalid' : null
  };

  await seller.save();

  await AuditLog.create({
    actorId: req.user._id.toString(),
    actorRole: req.user.role,
    action: `SELLER_${action}`,
    entityType: 'SELLER',
    entityId: sellerId,
    metadata: {
      action,
      newStatus,
      email: seller.email
    }
  });

  res.json({
    success: true,
    message: `Seller status updated to ${newStatus}`,
    seller: {
      id: seller._id.toString(),
      status: newStatus,
      isApproved
    }
  });
});

export const getAdminCommissionLedgers = asyncHandler(async (_req, res) => {
  const ledgers = await CommissionLedger.find()
    .populate('sellerId', 'name email sellerProfile')
    .sort({ createdAt: -1 })
    .lean();

  const formatted = ledgers.map((l) => ({
    ...l,
    id: l._id.toString(),
    seller: {
      businessName: l.sellerId?.sellerProfile?.businessName || l.sellerId?.sellerProfile?.shopName || l.sellerId?.name || 'Nursery'
    }
  }));

  res.json({ ledgers: formatted });
});

export const getCoupons = asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  res.json({ coupons: coupons.map((c) => ({ ...c, id: c._id.toString() })) });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType = 'PERCENTAGE', discountValue, minOrderAmount = 0, maxDiscount, validUntil } = req.body;

  if (!code || !discountValue) {
    res.status(400);
    throw new Error('Code and discountValue are required');
  }

  const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
  if (existing) {
    res.status(409);
    throw new Error('Coupon code already exists');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase().trim(),
    discountType,
    discountValue: Number(discountValue),
    minOrderAmount: Number(minOrderAmount) || 0,
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    validUntil: validUntil ? new Date(validUntil) : undefined,
    isActive: true
  });

  res.status(201).json({ success: true, coupon: { ...coupon.toObject(), id: coupon._id.toString() } });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  const { isActive, discountValue, minOrderAmount } = req.body;
  if (isActive !== undefined) coupon.isActive = Boolean(isActive);
  if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
  if (minOrderAmount !== undefined) coupon.minOrderAmount = Number(minOrderAmount);

  await coupon.save();
  res.json({ success: true, coupon: { ...coupon.toObject(), id: coupon._id.toString() } });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await Coupon.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Coupon deleted' });
});

export const getBanners = asyncHandler(async (_req, res) => {
  const banners = await Banner.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
  res.json({ banners: banners.map((b) => ({ ...b, id: b._id.toString() })) });
});

export const createBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, imageUrl, linkUrl = '/shop', badgeText, displayOrder = 0 } = req.body;

  if (!title || !imageUrl) {
    res.status(400);
    throw new Error('Title and imageUrl are required');
  }

  const banner = await Banner.create({
    title: title.trim(),
    subtitle: subtitle?.trim(),
    imageUrl: imageUrl.trim(),
    linkUrl: linkUrl.trim(),
    badgeText: badgeText?.trim(),
    displayOrder: Number(displayOrder) || 0,
    isActive: true
  });

  res.status(201).json({ success: true, banner: { ...banner.toObject(), id: banner._id.toString() } });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  const { title, subtitle, imageUrl, linkUrl, badgeText, displayOrder, isActive } = req.body;
  if (title !== undefined) banner.title = title.trim();
  if (subtitle !== undefined) banner.subtitle = subtitle?.trim();
  if (imageUrl !== undefined) banner.imageUrl = imageUrl.trim();
  if (linkUrl !== undefined) banner.linkUrl = linkUrl.trim();
  if (badgeText !== undefined) banner.badgeText = badgeText?.trim();
  if (displayOrder !== undefined) banner.displayOrder = Number(displayOrder);
  if (isActive !== undefined) banner.isActive = Boolean(isActive);

  await banner.save();
  res.json({ success: true, banner: { ...banner.toObject(), id: banner._id.toString() } });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  await Banner.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Banner deleted' });
});

export const exportReports = asyncHandler(async (req, res) => {
  const { type = 'orders' } = req.query;

  if (type === 'orders') {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    let csv = 'Order ID,Order Number,Customer Name,Total Amount,Platform Fee,Seller Net,Status,Created At\n';
    orders.forEach((o) => {
      csv += `"${o._id}","${o.orderNumber || ''}","${o.customerName || ''}",${o.totalGrossAmount || o.totalAmount || 0},${o.totalPlatformFee || 0},${o.totalSellerNet || 0},"${o.status || o.masterStatus || ''}","${o.createdAt}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="gaurav-nursery-orders.csv"');
    return res.send(csv);
  }

  if (type === 'commission') {
    const ledgers = await CommissionLedger.find().sort({ createdAt: -1 }).lean();
    let csv = 'Ledger ID,SubOrder ID,Order Amount,Commission Rate,Platform Fee,Seller Payable,Status,Created At\n';
    ledgers.forEach((l) => {
      csv += `"${l._id}","${l.subOrderNumber || l.subOrderId || ''}",${l.orderAmount},${l.commissionRate},${l.platformFee},${l.sellerPayable},"${l.settlementStatus}","${l.createdAt}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="gaurav-nursery-commission.csv"');
    return res.send(csv);
  }

  res.status(400);
  throw new Error('Unsupported report type');
});
