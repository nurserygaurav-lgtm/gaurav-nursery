import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';

const activeOrderStatuses = ['paid', 'processing', 'shipped', 'delivered'];

export const getStoreSummary = asyncHandler(async (_req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [soldItems, cities, customers, dailyOrders] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $in: activeOrderStatuses } } },
      { $unwind: '$items' },
      { $count: 'count' }
    ]),
    Order.distinct('shippingAddress.city', {
      status: { $in: activeOrderStatuses },
      'shippingAddress.city': { $exists: true, $ne: '' }
    }),
    Order.distinct('customer', { status: { $in: activeOrderStatuses } }),
    Order.countDocuments({
      createdAt: { $gte: today },
      status: { $in: activeOrderStatuses }
    })
  ]);

  res.json({
    summary: {
      totalPlantsSold: soldItems[0]?.count || 0,
      citiesDelivered: cities.length,
      activeCustomers: customers.length,
      dailyOrders
    }
  });
});
