import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import { createOrderFromCart, validateShippingAddress } from '../utils/orderHelpers.js';

const orderPopulate = [
  { path: 'customer', select: 'name email phone' },
  { path: 'items.product', select: 'title name images category' },
  { path: 'items.seller', select: 'name sellerProfile.shopName' }
];

const allowedStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

function canViewOrder(order, user) {
  if (user.role === 'admin') return true;
  if (order.customer._id?.toString() === user._id.toString() || order.customer.toString() === user._id.toString()) return true;
  return order.items.some((item) => item.seller._id?.toString() === user._id.toString() || item.seller.toString() === user._id.toString());
}

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'cod' } = req.body;
  const addressError = validateShippingAddress(shippingAddress);

  if (addressError) {
    res.status(400);
    throw new Error(addressError);
  }

  if (paymentMethod !== 'cod') {
    res.status(400);
    throw new Error('Use payment verification for online payments');
  }

  const order = await createOrderFromCart({
    customerId: req.user._id,
    shippingAddress,
    payment: { method: 'cod', status: 'pending' },
    status: 'pending'
  });

  res.status(201).json({ order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).populate(orderPopulate).sort({ createdAt: -1 });
  res.json({ orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(orderPopulate);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!canViewOrder(order, req.user)) {
    res.status(403);
    throw new Error('Forbidden');
  }

  res.json({ order });
});

export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id }).populate(orderPopulate).sort({ createdAt: -1 });
  res.json({ orders });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate(orderPopulate).sort({ createdAt: -1 });
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  const order = await Order.findById(req.params.id).populate(orderPopulate);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.user.role === 'seller') {
    const ownsItem = order.items.some((item) => item.seller._id.toString() === req.user._id.toString());
    if (!ownsItem || !['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      res.status(403);
      throw new Error('Forbidden');
    }
  }

  order.status = status;
  if (status === 'paid') order.payment.status = 'paid';
  await order.save();

  res.json({ order });
});
