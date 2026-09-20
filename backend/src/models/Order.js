import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    image: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const subOrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productId: String,
    productTitle: String,
    productImage: String,
    unitPrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    lineTotal: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0.10 },
    commissionAmount: { type: Number, default: 0 },
    sellerEarning: { type: Number, default: 0 }
  },
  { _id: true }
);

const subOrderSchema = new mongoose.Schema(
  {
    subOrderNumber: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerBusinessName: String,
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    grossAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    sellerNet: { type: Number, required: true },
    fulfillmentStatus: {
      type: String,
      enum: ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED'
    },
    trackingNumber: String,
    deliveryNotes: String,
    items: [subOrderItemSchema]
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, sparse: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerId: String,
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    items: [orderItemSchema],
    subOrders: [subOrderSchema],
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      address: String,
      city: String,
      state: String,
      pincode: String
    },
    payment: {
      method: {
        type: String,
        default: 'cod'
      },
      orderId: String,
      paymentId: String,
      signature: String,
      status: {
        type: String,
        default: 'pending'
      }
    },
    paymentMethod: { type: String, default: 'TEST_PAYMENT' },
    paymentStatus: { type: String, default: 'PAID' },
    masterStatus: { type: String, default: 'PLACED' },
    totalAmount: { type: Number, default: 0 },
    totalGrossAmount: { type: Number, default: 0 },
    totalPlatformFee: { type: Number, default: 0 },
    totalSellerNet: { type: Number, default: 0 },
    status: {
      type: String,
      default: 'pending'
    }
  },
  { timestamps: true }
);

// Indexes for seller orders listing (GET /orders/seller)
// NOTE: nested items.seller is used in queries.
orderSchema.index({ 'items.seller': 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1, status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customer: 1 });

export default mongoose.model('Order', orderSchema);

