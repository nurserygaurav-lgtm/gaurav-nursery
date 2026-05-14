import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const cartPopulate = {
  path: 'items.product',
  select: 'title name price stock images category seller status',
  populate: { path: 'seller', select: 'name sellerProfile.shopName' }
};

async function getCustomerCart(customerId) {
  let cart = await Cart.findOne({ customer: customerId }).populate(cartPopulate);
  if (!cart) {
    cart = await Cart.create({ customer: customerId, items: [] });
    cart = await cart.populate(cartPopulate);
  }
  return cart;
}

function cartSummary(cart) {
  const subtotal = cart.items.reduce((total, item) => total + Number(item.product?.price || 0) * item.quantity, 0);
  return {
    cart,
    summary: {
      subtotal,
      itemCount: cart.items.reduce((total, item) => total + item.quantity, 0)
    }
  };
}

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCustomerCart(req.user._id);
  res.json(cartSummary(cart));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const nextQuantity = Number(quantity);

  if (!productId || !Number.isInteger(nextQuantity) || nextQuantity < 1) {
    res.status(400);
    throw new Error('Valid product and quantity are required');
  }

  const product = await Product.findOne({ _id: productId, status: 'active' });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < nextQuantity) {
    res.status(400);
    throw new Error('Requested quantity exceeds stock');
  }

  const cart = await getCustomerCart(req.user._id);
  const existingItem = cart.items.find((item) => item.product._id.toString() === productId);

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + nextQuantity, product.stock);
  } else {
    cart.items.push({ product: productId, quantity: nextQuantity });
  }

  await cart.save();
  await cart.populate(cartPopulate);
  res.status(201).json(cartSummary(cart));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const nextQuantity = Number(req.body.quantity);

  if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const cart = await getCustomerCart(req.user._id);
  const item = cart.items.find((cartItem) => cartItem.product._id.toString() === req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  if (item.product.stock < nextQuantity) {
    res.status(400);
    throw new Error('Requested quantity exceeds stock');
  }

  item.quantity = nextQuantity;
  await cart.save();
  await cart.populate(cartPopulate);
  res.json(cartSummary(cart));
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getCustomerCart(req.user._id);
  cart.items = cart.items.filter((item) => item.product._id.toString() !== req.params.id);
  await cart.save();
  await cart.populate(cartPopulate);
  res.json(cartSummary(cart));
});
