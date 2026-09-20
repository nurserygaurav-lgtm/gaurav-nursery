import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import CommissionLedger from '../models/CommissionLedger.js';
import AuditLog from '../models/AuditLog.js';

export const processCheckout = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingPincode,
    paymentMethod = 'TEST_PAYMENT',
    items
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  if (!customerName || !customerEmail || !shippingAddress || !shippingCity || !shippingPincode) {
    res.status(400);
    throw new Error('Please provide all shipping address details');
  }

  // 1. Identify or create customer
  let customerUser = req.user;
  if (!customerUser) {
    customerUser = await User.findOne({ email: customerEmail.toLowerCase().trim() });
    if (!customerUser) {
      customerUser = await User.create({
        name: customerName,
        email: customerEmail.toLowerCase().trim(),
        phone: customerPhone,
        password: 'guest-account-placeholder',
        role: 'customer'
      });
    }
  }

  // 2. Fetch live products from MongoDB
  const productIds = items.map((i) => i.productId || i.id).filter(Boolean);
  const liveProducts = await Product.find({
    $or: [{ _id: { $in: productIds } }, { status: { $in: ['live', 'active', 'LIVE'] } }]
  }).populate('seller', 'name sellerProfile');

  const activeSellers = await User.find({
    role: { $in: ['seller', 'SELLER'] },
    $or: [{ 'sellerProfile.status': 'ACTIVE' }, { 'sellerProfile.isApproved': true }]
  });

  const fallbackSeller = activeSellers[0] || customerUser;

  // 3. Map sanitized items and group by seller
  const sellerGroups = new Map();
  let totalGross = 0;

  for (const it of items) {
    let matched = liveProducts.find(
      (p) => p._id.toString() === (it.productId || it.id) || p.title?.toLowerCase() === it.title?.toLowerCase()
    );
    if (!matched && liveProducts.length > 0) {
      matched = liveProducts[0];
    }

    const sellerId = (matched?.seller?._id || matched?.seller || it.sellerId || fallbackSeller._id).toString();
    const sellerBusinessName =
      matched?.seller?.sellerProfile?.businessName ||
      matched?.seller?.sellerProfile?.shopName ||
      it.sellerBusinessName ||
      fallbackSeller.sellerProfile?.businessName ||
      'Partner Nursery';

    const unitPrice = parseFloat(it.price) || matched?.price || 499;
    const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
    const lineTotal = unitPrice * qty;
    const commissionAmount = Math.round(lineTotal * 0.10 * 100) / 100;
    const sellerEarning = Math.round((lineTotal - commissionAmount) * 100) / 100;

    totalGross += lineTotal;

    const sanitizedItem = {
      product: matched?._id || undefined,
      productId: matched?._id?.toString() || it.productId || 'demo-product',
      productTitle: it.title || matched?.title || matched?.name || 'Live Nursery Plant',
      productImage: it.image || matched?.images?.[0]?.url || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
      unitPrice,
      quantity: qty,
      lineTotal,
      commissionRate: 0.10,
      commissionAmount,
      sellerEarning
    };

    if (!sellerGroups.has(sellerId)) {
      sellerGroups.set(sellerId, {
        sellerId,
        sellerBusinessName,
        items: [],
        grossAmount: 0,
        platformFee: 0,
        sellerNet: 0
      });
    }

    const group = sellerGroups.get(sellerId);
    group.items.push(sanitizedItem);
    group.grossAmount += lineTotal;
    group.platformFee += commissionAmount;
    group.sellerNet += sellerEarning;
  }

  const totalPlatformFee = Math.round(totalGross * 0.10 * 100) / 100;
  const totalSellerNet = Math.round((totalGross - totalPlatformFee) * 100) / 100;

  const orderYear = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `GN-${orderYear}-${randomSuffix}`;
  const subLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  // 4. Create SubOrders
  const subOrders = [];
  let subIndex = 0;

  for (const [sellerId, group] of sellerGroups.entries()) {
    const letter = subLetters[subIndex] || `${subIndex + 1}`;
    const subOrderNumber = `${orderNumber}-${letter}`;
    const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    subOrders.push({
      subOrderNumber,
      seller: sellerId,
      sellerBusinessName: group.sellerBusinessName,
      grossAmount: Math.round(group.grossAmount * 100) / 100,
      platformFee: Math.round(group.platformFee * 100) / 100,
      sellerNet: Math.round(group.sellerNet * 100) / 100,
      fulfillmentStatus: 'PLACED',
      trackingNumber,
      items: group.items
    });

    subIndex += 1;
  }

  // 5. Create Master Order
  const order = await Order.create({
    orderNumber,
    customer: customerUser._id,
    customerId: customerUser._id.toString(),
    customerName,
    customerEmail: customerEmail.toLowerCase().trim(),
    customerPhone,
    shippingAddress: {
      name: customerName,
      phone: customerPhone,
      address: shippingAddress,
      street: shippingAddress,
      city: shippingCity,
      state: shippingState || 'Gujarat',
      pincode: shippingPincode
    },
    items: subOrders.flatMap((sub) =>
      sub.items.map((it) => ({
        product: it.product,
        seller: sub.seller,
        name: it.productTitle,
        image: it.productImage,
        quantity: it.quantity,
        price: it.unitPrice
      }))
    ),
    subOrders,
    totalAmount: totalGross,
    totalGrossAmount: totalGross,
    totalPlatformFee,
    totalSellerNet,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
    masterStatus: 'PLACED',
    status: 'paid'
  });

  // 6. Create immutable CommissionLedger entries
  for (const sub of subOrders) {
    await CommissionLedger.create({
      subOrderId: order._id.toString(),
      subOrderNumber: sub.subOrderNumber,
      sellerId: sub.seller,
      orderAmount: sub.grossAmount,
      commissionRate: 0.10,
      platformFee: sub.platformFee,
      sellerGross: sub.sellerNet,
      refundAmount: 0.0,
      sellerPayable: sub.sellerNet,
      settlementStatus: 'PENDING_DELIVERY'
    });

    // Decrement stock for purchased items
    for (const it of sub.items) {
      if (it.product) {
        await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
      }
    }
  }

  // 7. Audit log
  await AuditLog.create({
    actorId: customerUser._id.toString(),
    actorRole: customerUser.role || 'customer',
    action: 'ORDER_PLACED_MULTI_SPLIT',
    entityType: 'ORDER',
    entityId: order._id.toString(),
    metadata: {
      orderNumber,
      totalGross,
      subOrdersCount: subOrders.length
    }
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully! Multi-vendor split and 10% commission ledger created.',
    order: {
      ...order.toObject(),
      id: order._id.toString()
    },
    subOrders,
    splits: {
      totalGrossAmount: totalGross,
      totalPlatformFee,
      totalSellerNet,
      subOrders
    }
  });
});
