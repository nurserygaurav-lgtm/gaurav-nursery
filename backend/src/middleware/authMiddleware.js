import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/User.js';

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  if (req.headers['x-auth-token']) {
    return req.headers['x-auth-token'];
  }

  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const gnTokenMatch = cookieHeader.match(/(?:^|;\s*)gn_auth_token=([^;]*)/);
    if (gnTokenMatch) return decodeURIComponent(gnTokenMatch[1]);

    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
    if (tokenMatch) return decodeURIComponent(tokenMatch[1]);
  }

  return null;
}

export const protect = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }

  const userId = decoded.userId || decoded.id || decoded._id;
  req.user = await User.findById(userId).select('-password');

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
  const normalizedRoles = roles.map((r) => r.toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized'));
    }

    const userRole = (req.user.role || '').toLowerCase();
    const isSuperAdmin = userRole === 'super_admin' || userRole === 'admin';

    if (isSuperAdmin && (normalizedRoles.includes('admin') || normalizedRoles.includes('super_admin'))) {
      return next();
    }

    if (normalizedRoles.includes(userRole)) {
      return next();
    }

    res.status(403);
    return next(new Error('Forbidden: Access denied for your role'));
  };
}
