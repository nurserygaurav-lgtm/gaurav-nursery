import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import CommissionLedger from '../models/CommissionLedger.js';
import AuditLog from '../models/AuditLog.js';

export const getDeliveryOrders = asyncHandler(async (req, res) => {
  const isSuperAdmin = ['admin', 'super_admin', 'SUPER_ADMIN'].includes(req.user.role);

  const filter = {};
  if (!isSuperAdmin) {
    // Delivery rider can only see sub-orders assigned to them, or unassigned sub-orders in transit queue
    filter.$or = [
      { 'subOrders.deliveryPartner': req.user._id },
      { 'subOrders.fulfillmentStatus': { $in: ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'] } }
    ];
  }

  const orders = await Order.find(filter)
    .populate('customer', 'name phone address')
    .sort({ createdAt: -1 })
    .lean();

  const dispatches = [];
  orders.forEach((o) => {
    (o.subOrders || []).forEach((sub) => {
      dispatches.push({
        id: sub._id ? sub._id.toString() : o._id.toString(),
        orderId: o._id.toString(),
        masterOrderNumber: o.orderNumber || `GN-${o._id.toString().slice(-4)}`,
        subOrderNumber: sub.subOrderNumber || 'GN-SUB-1',
        sellerBusinessName: sub.sellerBusinessName || 'Partner Nursery',
        customerName: o.customerName || o.customer?.name || 'Customer',
        customerPhone: o.customerPhone || o.customer?.phone || '+91 99999 99999',
        shippingAddress: `${o.shippingAddress?.address || o.shippingAddress?.street || ''}, ${o.shippingAddress?.city || ''}, ${o.shippingAddress?.pincode || ''}`,
        fulfillmentStatus: sub.fulfillmentStatus || 'PLACED',
        trackingNumber: sub.trackingNumber || 'TRK-000000',
        itemsCount: (sub.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0),
        items: sub.items || [],
        totalAmount: sub.grossAmount || 0,
        createdAt: o.createdAt
      });
    });
  });

  res.json({ dispatches, orders: dispatches });
});

export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { subOrderNumber, status, deliveryNotes } = req.body;

  if (!subOrderNumber || !status) {
    res.status(400);
    throw new Error('subOrderNumber and status are required');
  }

  const allowed = ['CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  if (!allowed.includes(status.toUpperCase())) {
    res.status(400);
    throw new Error(`Invalid status. Allowed: ${allowed.join(', ')}`);
  }

  const order = await Order.findOne({ 'subOrders.subOrderNumber': subOrderNumber });
  if (!order) {
    res.status(404);
    throw new Error('Sub-order not found');
  }

  const sub = order.subOrders.find((s) => s.subOrderNumber === subOrderNumber);
  if (!sub) {
    res.status(404);
    throw new Error('Sub-order item not found');
  }

  const newStatus = status.toUpperCase();
  sub.fulfillmentStatus = newStatus;
  sub.deliveryPartner = req.user._id;
  if (deliveryNotes) sub.deliveryNotes = deliveryNotes;

  await order.save();

  // If marked DELIVERED, unlock seller payout by marking CommissionLedger ELIGIBLE_FOR_PAYOUT
  if (newStatus === 'DELIVERED') {
    await CommissionLedger.updateMany(
      { subOrderNumber },
      { $set: { settlementStatus: 'ELIGIBLE_FOR_PAYOUT' } }
    );
  }

  await AuditLog.create({
    actorId: req.user._id.toString(),
    actorRole: req.user.role,
    action: `DELIVERY_STATUS_${newStatus}`,
    entityType: 'SUB_ORDER',
    entityId: subOrderNumber,
    metadata: {
      subOrderNumber,
      status: newStatus
    }
  });

  res.json({
    success: true,
    message: `Sub-order ${subOrderNumber} updated to ${newStatus}`,
    fulfillmentStatus: newStatus
  });
});
