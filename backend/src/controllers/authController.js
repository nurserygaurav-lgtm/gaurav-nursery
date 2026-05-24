import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { validateLoginInput, validateRegisterInput } from '../utils/validators.js';

function authResponse(user) {
  return {
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      loginProvider: user.loginProvider,
      role: user.role,
      phone: user.phone,
      address: user.address,
      sellerProfile: user.sellerProfile
    }
  };
}

async function verifyGoogleIdToken(idToken) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!response.ok) {
    return null;
  }
  const payload = await response.json();
  const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
  if (!payload || !validIssuers.includes(payload.iss) || !payload.email_verified || !payload.email) {
    return null;
  }
  if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
    return null;
  }
  return payload;
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'customer', phone, address, shopName, businessAddress } = req.body;
  const errors = validateRegisterInput({ name, email, password, role, phone });

  if (errors.length) {
    res.status(400);
    throw new Error(errors[0]);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role,
    phone,
    address,
    loginProvider: 'email',
    sellerProfile:
      role === 'seller'
        ? {
            shopName,
            businessAddress
          }
        : undefined
  });

  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const errors = validateLoginInput({ email, password });

  if (errors.length) {
    res.status(400);
    throw new Error(errors[0]);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('This account is disabled');
  }

  res.json(authResponse(user));
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400);
    throw new Error('Google credential is required');
  }

  const payload = await verifyGoogleIdToken(credential);
  if (!payload) {
    res.status(401);
    throw new Error('Invalid Google login token');
  }

  const email = payload.email.toLowerCase().trim();
  const name = payload.name || 'Google User';
  const avatar = payload.picture;
  const googleId = payload.sub;

  let user = await User.findOne({ email });

  if (user) {
    if (!user.isActive) {
      res.status(403);
      throw new Error('This account is disabled');
    }
    user.loginProvider = 'google';
    user.avatar = user.avatar || avatar;
    user.googleId = user.googleId || googleId;
    user.name = user.name || name;
    await user.save();
  } else {
    user = await User.create({
      name: name.trim(),
      email,
      avatar,
      loginProvider: 'google',
      googleId,
      role: 'customer'
    });
  }

  res.json(authResponse(user));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
