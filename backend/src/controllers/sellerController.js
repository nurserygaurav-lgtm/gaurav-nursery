import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getSellerProfile = asyncHandler(async (req, res) => {
  const seller = await User.findById(req.user._id).select('-password');
  res.json({ seller });
});

export const updateSellerProfile = asyncHandler(async (req, res) => {
  const seller = await User.findById(req.user._id);
  if (!seller) { res.status(404); throw new Error('Seller not found'); }
  const { name, phone, shopName, businessAddress } = req.body;
  if (name !== undefined) seller.name = String(name).trim();
  if (phone !== undefined) seller.phone = String(phone).trim();
  seller.sellerProfile = {
    ...seller.sellerProfile?.toObject?.(),
    shopName: shopName ?? seller.sellerProfile?.shopName,
    businessAddress: businessAddress ?? seller.sellerProfile?.businessAddress
  };
  await seller.save();
  res.json({ seller: await seller.populate([]) });
});

export const getSellerInventory = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id, status: { $ne: 'archived' } })
    .select('title name sku stock category price offerPrice status images updatedAt')
    .sort({ stock: 1, updatedAt: -1 })
    .lean();
  const summary = products.reduce((result, product) => ({
    totalProducts: result.totalProducts + 1,
    totalStock: result.totalStock + Number(product.stock || 0),
    lowStock: result.lowStock + (Number(product.stock || 0) < 5 ? 1 : 0)
  }), { totalProducts: 0, totalStock: 0, lowStock: 0 });
  res.json({ inventory: products, summary });
});
