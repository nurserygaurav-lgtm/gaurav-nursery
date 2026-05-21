import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const revenueOrderMatch = {
  $or: [{ 'payment.status': 'paid' }, { status: { $in: ['paid', 'delivered'] } }]
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildMonthlyRevenue(monthlyRows) {
  const now = new Date();
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const revenueByMonth = new Map(monthlyRows.map((row) => [row._id, row.revenue]));

  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1);
    return {
      name: monthNames[date.getMonth()],
      month: getMonthKey(date),
      revenue: revenueByMonth.get(getMonthKey(date)) || 0
    };
  });
}

function buildMonthlySales(monthlyRows) {
  const now = new Date();
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const salesByMonth = new Map(monthlyRows.map((row) => [row._id, row]));

  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1);
    const month = getMonthKey(date);
    const row = salesByMonth.get(month);

    return {
      name: monthNames[date.getMonth()],
      month,
      orders: row?.orders || 0,
      productsSold: row?.productsSold || 0
    };
  });
}

function calculateGrowth(currentRevenue, previousRevenue) {
  if (!previousRevenue && !currentRevenue) return 0;
  if (!previousRevenue) return 100;
  return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
}

export const getSellerDashboard = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(req.user._id);
  const now = new Date();
  const currentMonthStart = getMonthStart(now);
  const previousMonthStart = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 1, 1);
  const nextMonthStart = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 1);
  const chartStart = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 11, 1);

  const sellerItemStages = [{ $unwind: '$items' }, { $match: { 'items.seller': sellerId } }];
  const sellerRevenueExpression = { $multiply: ['$items.quantity', '$items.price'] };

  const [orderSummary] = await Order.aggregate([
    { $match: { 'items.seller': sellerId } },
    {
      $group: {
        _id: null,
        orders: { $sum: 1 },
        pendingOrders: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
      }
    }
  ]);

  const [salesSummary] = await Order.aggregate([
    ...sellerItemStages,
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$items.quantity' },
        productsSold: { $sum: '$items.quantity' }
      }
    }
  ]);

  const [revenueSummary] = await Order.aggregate([
    { $match: { 'items.seller': sellerId, ...revenueOrderMatch } },
    ...sellerItemStages,
    {
      $group: {
        _id: null,
        revenue: { $sum: sellerRevenueExpression }
      }
    }
  ]);

  const monthlyRevenueRows = await Order.aggregate([
    { $match: { 'items.seller': sellerId, createdAt: { $gte: chartStart }, ...revenueOrderMatch } },
    ...sellerItemStages,
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: sellerRevenueExpression }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const [growthSummary] = await Order.aggregate([
    {
      $match: {
        'items.seller': sellerId,
        createdAt: { $gte: previousMonthStart, $lt: nextMonthStart },
        ...revenueOrderMatch
      }
    },
    ...sellerItemStages,
    {
      $group: {
        _id: null,
        currentRevenue: {
          $sum: {
            $cond: [{ $gte: ['$createdAt', currentMonthStart] }, sellerRevenueExpression, 0]
          }
        },
        previousRevenue: {
          $sum: {
            $cond: [{ $lt: ['$createdAt', currentMonthStart] }, sellerRevenueExpression, 0]
          }
        }
      }
    }
  ]);

  const categoryMixRows = await Order.aggregate([
    ...sellerItemStages,
    {
      $lookup: {
        from: Product.collection.name,
        localField: 'items.product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ['$product.category', 'Uncategorized'] },
        value: { $sum: '$items.quantity' }
      }
    },
    { $sort: { value: -1 } }
  ]);

  const monthlySalesRows = await Order.aggregate([
    { $match: { 'items.seller': sellerId, createdAt: { $gte: chartStart } } },
    ...sellerItemStages,
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        orderIds: { $addToSet: '$_id' },
        productsSold: { $sum: '$items.quantity' }
      }
    },
    {
      $project: {
        orders: { $size: '$orderIds' },
        productsSold: 1
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const recentOrders = await Order.find({ 'items.seller': sellerId })
    .populate({ path: 'customer', select: 'name email' })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  res.json({
    metrics: {
      totalSales: salesSummary?.totalSales || 0,
      revenue: revenueSummary?.revenue || 0,
      orders: orderSummary?.orders || 0,
      pendingOrders: orderSummary?.pendingOrders || 0,
      productsSold: salesSummary?.productsSold || 0,
      monthlyGrowth: calculateGrowth(growthSummary?.currentRevenue || 0, growthSummary?.previousRevenue || 0)
    },
    charts: {
      revenueAnalytics: buildMonthlyRevenue(monthlyRevenueRows),
      categoryMix: categoryMixRows.map((row) => ({ name: row._id, value: row.value })),
      salesAnalytics: buildMonthlySales(monthlySalesRows)
    },
    recentOrders: recentOrders.map((order) => {
      const sellerItems = order.items.filter((item) => item.seller.toString() === sellerId.toString());
      const amount = sellerItems.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.price || 0), 0);

      return {
        id: order._id,
        orderNumber: `#${order._id.toString().slice(-6).toUpperCase()}`,
        customer: order.customer?.name || order.customer?.email || 'Customer',
        amount,
        status: order.status,
        delivery: order.status
      };
    })
  });
});
