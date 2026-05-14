import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const cartPopulate = {
  path: 'items.product',
  select: 'title name price stock images category seller status',
  populate: { path: 'seller', select: 'name sellerProfile.shopName' }
};

export function validateShippingAddress(address = {}) {
  const requiredFields = ['name', 'phone', 'street', 'city', 'state', 'pincode'];
  const missingField = requiredFields.find((field) => !address[field]?.trim());

  if (missingField) return `${missingField} is required`;
  if (!/^[0-9+\-\s]{7,15}$/.test(address.phone)) return 'Enter a valid phone number';
  return '';
}

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function getCartForCheckout(customerId) {
  return Cart.findOne({ customer: customerId }).populate(cartPopulate);
}

export function calculateCartTotal(cart) {
  return cart.items.reduce((total, item) => total + Number(item.product.price) * Number(item.quantity), 0);
}

function buildOrderItems(cart) {
  return cart.items.map((item) => ({
    product: item.product._id,
    seller: item.product.seller._id || item.product.seller,
    name: item.product.title || item.product.name,
    image: item.product.images?.[0]?.url,
    quantity: item.quantity,
    price: item.product.price
  }));
}

export async function createOrderFromCart({ customerId, expectedAmountPaise, shippingAddress, payment, status }) {
  const session = await mongoose.startSession();
  let orderId;

  try {
    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ customer: customerId }).session(session).populate(cartPopulate);

      if (!cart || !cart.items.length) {
        throw createHttpError('Cart is empty');
      }

      for (const item of cart.items) {
        if (!item.product || item.product.status !== 'active') {
          throw createHttpError('One or more products are no longer available');
        }

        if (item.product.stock < item.quantity) {
          throw createHttpError(`${item.product.title || item.product.name} does not have enough stock`);
        }
      }

      const totalAmount = calculateCartTotal(cart);

      if (expectedAmountPaise !== undefined && Math.round(totalAmount * 100) !== Number(expectedAmountPaise)) {
        throw createHttpError('Cart total changed. Please refresh checkout and try again');
      }

      const [order] = await Order.create(
        [
          {
            customer: customerId,
            items: buildOrderItems(cart),
            shippingAddress,
            payment,
            totalAmount,
            status
          }
        ],
        { session }
      );

      for (const item of cart.items) {
        const stockUpdate = await Product.updateOne(
          { _id: item.product._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw createHttpError(`${item.product.title || item.product.name} does not have enough stock`);
        }
      }

      cart.items = [];
      await cart.save({ session });
      orderId = order._id;
    });
  } finally {
    await session.endSession();
  }

  return Order.findById(orderId).populate([
    { path: 'customer', select: 'name email phone' },
    { path: 'items.product', select: 'title name images category' },
    { path: 'items.seller', select: 'name sellerProfile.shopName' }
  ]);
}
