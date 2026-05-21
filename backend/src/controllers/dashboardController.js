import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import Payout from '../models/Payout.js';
import Product from '../models/Product.js';
import Restock from '../models/Restock.js';

const LOW_STOCK_THRESHOLD = 5;
const PLATFORM_COMMISSION_RATE = 0.12;
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const completedOrderMatch = { status: 'delivered' };
const paidOrderMatch = {
  $or: [{ 'payment.status': 'paid' }, { status: { $in: ['paid', 'delivered'] } }]
};

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatPayoutDate(date) {
  if (!date) return 'Pending';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

function buildMonthlyRows(rows, keys, months = 12) {
  const now = new Date();
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const byMonth = new Map(rows.map((row) => [row._id, row]));

  return Array.from({ length: months }, (_, index) => {
    const date = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1);
    const month = getMonthKey(date);
    const row = byMonth.get(month) || {};

    return keys.reduce(
      (result, key) => ({ ...result, [key]: Number(row[key] || 0) }),
      { name: monthNames[date.getMonth()], month }
    );
  });
}

function buildWeeklyRows(rows) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const byDate = new Map(rows.map((row) => [row._id, row]));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = getDateKey(date);
    const row = byDate.get(key) || {};

    return {
      name: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: key,
      orders: Number(row.orders || 0),
      revenue: Number(row.revenue || 0),
      productsSold: Number(row.productsSold || 0)
    };
  });
}

function calculateGrowth(currentValue, previousValue) {
  const current = Number(currentValue || 0);
  const previous = Number(previousValue || 0);
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return ((current - previous) / previous) * 100;
}

function getSellerItemStages(sellerId) {
  return [{ $unwind: '$items' }, { $match: { 'items.seller': sellerId } }];
}

function getSellerRevenueExpression() {
  return { $multiply: ['$items.quantity', '$items.price'] };
}

export const getSellerDashboard = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(req.user._id);
  const now = new Date();
  const currentMonthStart = getMonthStart(now);
  const previousMonthStart = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 1, 1);
  const nextMonthStart = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 1);
  const chartStart = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 11, 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const sellerItemStages = getSellerItemStages(sellerId);
  const sellerRevenueExpression = getSellerRevenueExpression();

  const [
    orderSummary,
    completedSummary,
    paidSummary,
    inventorySummary,
    incomingSummary,
    payoutSummary,
    monthlyAnalyticsRows,
    weeklySalesRows,
    monthlyPaidRows,
    monthlyInventoryRows,
    categoryMixRows,
    topProductsRows,
    recentOrders,
    lowStockProducts,
    payoutHistory
  ] = await Promise.all([
    Order.aggregate([
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          pendingOrders: { $sum: { $cond: [{ $in: ['$status', ['pending', 'paid', 'processing']] }, 1, 0] } }
        }
      }
    ]).then((rows) => rows[0] || {}),
    Order.aggregate([
      { $match: { 'items.seller': sellerId, ...completedOrderMatch } },
      ...sellerItemStages,
      {
        $group: {
          _id: null,
          completedRevenue: { $sum: sellerRevenueExpression },
          productsSold: { $sum: '$items.quantity' },
          soldStock: { $sum: '$items.quantity' },
          completedOrders: { $addToSet: '$_id' }
        }
      },
      { $project: { completedRevenue: 1, productsSold: 1, soldStock: 1, completedOrders: { $size: '$completedOrders' } } }
    ]).then((rows) => rows[0] || {}),
    Order.aggregate([
      { $match: { 'items.seller': sellerId, ...paidOrderMatch } },
      ...sellerItemStages,
      {
        $group: {
          _id: null,
          grossRevenue: { $sum: sellerRevenueExpression },
          monthlyRevenue: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', currentMonthStart] }, sellerRevenueExpression, 0]
            }
          },
          currentMonthRevenue: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', currentMonthStart] }, sellerRevenueExpression, 0]
            }
          },
          previousMonthRevenue: {
            $sum: {
              $cond: [{ $lt: ['$createdAt', currentMonthStart] }, sellerRevenueExpression, 0]
            }
          }
        }
      }
    ]).then((rows) => rows[0] || {}),
    Product.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: null,
          currentStock: { $sum: '$stock' },
          products: { $sum: 1 },
          activeProducts: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          lowStockAlerts: { $sum: { $cond: [{ $lt: ['$stock', LOW_STOCK_THRESHOLD] }, 1, 0] } }
        }
      }
    ]).then((rows) => rows[0] || {}),
    Restock.aggregate([
      { $match: { seller: sellerId, status: { $in: ['pending', 'ordered'] } } },
      { $group: { _id: null, incomingStock: { $sum: '$quantity' }, pendingRestocks: { $sum: 1 } } }
    ]).then((rows) => rows[0] || {}),
    Payout.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: null,
          paidOut: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] } },
          pendingPayouts: { $sum: { $cond: [{ $in: ['$status', ['pending', 'processing']] }, '$amount', 0] } }
        }
      }
    ]).then((rows) => rows[0] || {}),
    Order.aggregate([
      { $match: { 'items.seller': sellerId, createdAt: { $gte: chartStart }, ...completedOrderMatch } },
      ...sellerItemStages,
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          orderIds: { $addToSet: '$_id' },
          revenue: { $sum: sellerRevenueExpression },
          productsSold: { $sum: '$items.quantity' }
        }
      },
      { $project: { revenue: 1, productsSold: 1, orders: { $size: '$orderIds' } } },
      { $sort: { _id: 1 } }
    ]),
    Order.aggregate([
      { $match: { 'items.seller': sellerId, createdAt: { $gte: weekStart }, ...completedOrderMatch } },
      ...sellerItemStages,
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orderIds: { $addToSet: '$_id' },
          revenue: { $sum: sellerRevenueExpression },
          productsSold: { $sum: '$items.quantity' }
        }
      },
      { $project: { revenue: 1, productsSold: 1, orders: { $size: '$orderIds' } } },
      { $sort: { _id: 1 } }
    ]),
    Order.aggregate([
      { $match: { 'items.seller': sellerId, createdAt: { $gte: chartStart }, ...paidOrderMatch } },
      ...sellerItemStages,
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: sellerRevenueExpression },
          commission: { $sum: { $multiply: [sellerRevenueExpression, PLATFORM_COMMISSION_RATE] } },
          netRevenue: { $sum: { $multiply: [sellerRevenueExpression, 1 - PLATFORM_COMMISSION_RATE] } }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Order.aggregate([
      { $match: { 'items.seller': sellerId, createdAt: { $gte: chartStart }, status: { $ne: 'cancelled' } } },
      ...sellerItemStages,
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          soldStock: { $sum: '$items.quantity' }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Order.aggregate([
      { $match: { 'items.seller': sellerId, ...completedOrderMatch } },
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
      { $group: { _id: { $ifNull: ['$product.category', 'Uncategorized'] }, value: { $sum: '$items.quantity' } } },
      { $sort: { value: -1 } }
    ]),
    Order.aggregate([
      { $match: { 'items.seller': sellerId, ...completedOrderMatch } },
      ...sellerItemStages,
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: sellerRevenueExpression }
        }
      },
      { $sort: { quantitySold: -1, revenue: -1 } },
      { $limit: 5 }
    ]),
    Order.find({ 'items.seller': sellerId })
      .populate({ path: 'customer', select: 'name email' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Product.find({ seller: sellerId, stock: { $lt: LOW_STOCK_THRESHOLD } })
      .select('name title stock category price images status')
      .sort({ stock: 1, updatedAt: -1 })
      .limit(8)
      .lean(),
    Payout.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean()
  ]);

  const monthlyAnalytics = buildMonthlyRows(monthlyAnalyticsRows, ['revenue', 'orders', 'productsSold']);
  const monthlyEarnings = buildMonthlyRows(monthlyPaidRows, ['revenue', 'commission', 'netRevenue']);
  const monthlyInventory = buildMonthlyRows(monthlyInventoryRows, ['soldStock']).map((row) => ({
    ...row,
    currentStock: Number(inventorySummary.currentStock || 0),
    incomingStock: Number(incomingSummary.incomingStock || 0)
  }));
  const weeklySales = buildWeeklyRows(weeklySalesRows);
  const currentWeekRevenue = weeklySales.reduce((total, day) => total + day.revenue, 0);
  const currentWeekSales = weeklySales.reduce((total, day) => total + day.productsSold, 0);
  const commission = Number(paidSummary.grossRevenue || 0) * PLATFORM_COMMISSION_RATE;
  const pendingPayouts = Number(payoutSummary.pendingPayouts || 0);
  const paidOut = Number(payoutSummary.paidOut || 0);
  const availableBalance = Math.max(Number(paidSummary.grossRevenue || 0) - commission - pendingPayouts - paidOut, 0);
  const generatedNextPayout = availableBalance > 0 ? availableBalance : pendingPayouts;

  res.json({
    generatedAt: now.toISOString(),
    filters: {
      lowStockThreshold: LOW_STOCK_THRESHOLD,
      commissionRate: PLATFORM_COMMISSION_RATE
    },
    metrics: {
      totalSales: completedSummary.productsSold || 0,
      revenue: completedSummary.completedRevenue || 0,
      orders: orderSummary.orders || 0,
      completedOrders: completedSummary.completedOrders || 0,
      pendingOrders: orderSummary.pendingOrders || 0,
      productsSold: completedSummary.productsSold || 0,
      weeklySales: currentWeekSales,
      monthlyGrowth: calculateGrowth(paidSummary.currentMonthRevenue || 0, paidSummary.previousMonthRevenue || 0)
    },
    analytics: {
      totalRevenue: completedSummary.completedRevenue || 0,
      weeklySales: currentWeekSales,
      weeklyRevenue: currentWeekRevenue,
      productsSold: completedSummary.productsSold || 0,
      orders: completedSummary.completedOrders || 0,
      monthlyGrowth: calculateGrowth(paidSummary.currentMonthRevenue || 0, paidSummary.previousMonthRevenue || 0)
    },
    inventory: {
      currentStock: inventorySummary.currentStock || 0,
      incomingStock: incomingSummary.incomingStock || 0,
      pendingRestocks: incomingSummary.pendingRestocks || 0,
      soldStock: completedSummary.soldStock || 0,
      lowStockAlerts: inventorySummary.lowStockAlerts || 0,
      products: inventorySummary.products || 0,
      activeProducts: inventorySummary.activeProducts || 0,
      lowStockProducts
    },
    earnings: {
      availableBalance,
      monthlyRevenue: paidSummary.monthlyRevenue || 0,
      grossRevenue: paidSummary.grossRevenue || 0,
      commission,
      commissionRate: PLATFORM_COMMISSION_RATE,
      pendingPayouts,
      paidOut,
      nextPayout: generatedNextPayout,
      monthlyGrowth: calculateGrowth(paidSummary.currentMonthRevenue || 0, paidSummary.previousMonthRevenue || 0),
      payoutHistory: payoutHistory.map((payout) => ({
        id: payout.reference || `PAY-${payout._id.toString().slice(-6).toUpperCase()}`,
        date: formatPayoutDate(payout.paidAt || payout.createdAt),
        amount: payout.amount,
        commission: payout.commission || 0,
        status: payout.status
      }))
    },
    charts: {
      revenueAnalytics: monthlyAnalytics,
      ordersAnalytics: monthlyAnalytics,
      weeklySales,
      monthlyRevenue: monthlyAnalytics,
      categoryMix: categoryMixRows.map((row) => ({ name: row._id, value: row.value })),
      salesAnalytics: monthlyAnalytics,
      inventoryTrend: monthlyInventory,
      stockMovement: monthlyInventory,
      earnings: monthlyEarnings
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
    }),
    topProducts: topProductsRows.map((product) => ({
      id: product._id,
      name: product.name,
      image: product.image,
      quantitySold: product.quantitySold,
      revenue: product.revenue
    }))
  });
});
