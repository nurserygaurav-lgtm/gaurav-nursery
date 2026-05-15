import crypto from 'crypto';
import asyncHandler from '../middleware/asyncHandler.js';
import { getRazorpayClient } from '../config/razorpay.js';
import { calculateCartTotal, createOrderFromCart, getCartForCheckout, validateShippingAddress } from '../utils/orderHelpers.js';

function requireRazorpayClient(res) {
  try {
    return getRazorpayClient();
  } catch (error) {
    res.status(503);
    throw new Error(error.message || 'Razorpay payments are temporarily unavailable');
  }
}

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const razorpay = requireRazorpayClient(res);
  const cart = await getCartForCheckout(req.user._id);

  if (!cart || !cart.items.length) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const amount = calculateCartTotal(cart);
  const paymentOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `order_${Date.now()}`
  });

  res.status(201).json({ paymentOrder, amount });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const razorpay = requireRazorpayClient(res);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;
  const addressError = validateShippingAddress(shippingAddress);

  if (addressError) {
    res.status(400);
    throw new Error(addressError);
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  const [paymentOrder, cart] = await Promise.all([
    razorpay.orders.fetch(razorpay_order_id),
    getCartForCheckout(req.user._id)
  ]);

  if (!cart || !cart.items.length) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const expectedAmountPaise = Math.round(calculateCartTotal(cart) * 100);
  if (Number(paymentOrder.amount) !== expectedAmountPaise || paymentOrder.currency !== 'INR') {
    res.status(400);
    throw new Error('Payment amount does not match cart total');
  }

  const order = await createOrderFromCart({
    customerId: req.user._id,
    expectedAmountPaise,
    shippingAddress,
    payment: {
      method: 'razorpay',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'paid'
    },
    status: 'paid'
  });

  res.json({ verified: true, order });
});

export const createRazorpayOrder = createPaymentOrder;
export const verifyRazorpayPayment = verifyPayment;
