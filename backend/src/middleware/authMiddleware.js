import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }

  req.user = await User.findById(decoded.userId).select('-password');

  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  if (!req.user.isActive) {
    res.status(403);
    throw new Error('This account is disabled');
  }

  next();
});

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Forbidden');
    }
    next();
  };
}
