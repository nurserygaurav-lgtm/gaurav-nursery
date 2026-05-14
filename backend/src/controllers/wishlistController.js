import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';

const wishlistPopulate = {
  path: 'products',
  select: 'title name price stock images category seller status',
  populate: { path: 'seller', select: 'name sellerProfile.shopName' }
};

async function getCustomerWishlist(customerId) {
  let wishlist = await Wishlist.findOne({ customer: customerId }).populate(wishlistPopulate);
  if (!wishlist) {
    wishlist = await Wishlist.create({ customer: customerId, products: [] });
    wishlist = await wishlist.populate(wishlistPopulate);
  }
  return wishlist;
}

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getCustomerWishlist(req.user._id);
  res.json({ wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product is required');
  }

  const product = await Product.findOne({ _id: productId, status: 'active' });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const wishlist = await getCustomerWishlist(req.user._id);
  const alreadySaved = wishlist.products.some((item) => item._id.toString() === productId);

  if (!alreadySaved) wishlist.products.push(productId);

  await wishlist.save();
  await wishlist.populate(wishlistPopulate);
  res.status(201).json({ wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getCustomerWishlist(req.user._id);
  wishlist.products = wishlist.products.filter((product) => product._id.toString() !== req.params.id);
  await wishlist.save();
  await wishlist.populate(wishlistPopulate);
  res.json({ wishlist });
});
