import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';

export const getOrdersTest = asyncHandler(async (req, res) => {
  const limit = 5;

  const start = Date.now();
  const total = await Order.countDocuments({ 'items.seller': req.user._id });

  const queryStart = Date.now();
  const orders = await Order.find({ 'items.seller': req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  const queryMs = Date.now() - queryStart;

  const totalMs = Date.now() - start;

  res.json({
    total,
    limit,
    queryMs,
    totalMs,
    orders
  });
});

