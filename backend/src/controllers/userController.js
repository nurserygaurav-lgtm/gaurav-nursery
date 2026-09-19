import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
});

export const getSellers = asyncHandler(async (_req, res) => {
  const sellers = await User.find({ role: 'seller' }).select('-password').sort({ createdAt: -1 });
  res.json({ sellers });
});

export const approveSeller = asyncHandler(async (req, res) => {
  const seller = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'seller' },
    { 'sellerProfile.isApproved': true },
    { new: true }
  ).select('-password');

  if (!seller) {
    res.status(404);
    throw new Error('Seller not found');
  }

  res.json({ seller });
});
