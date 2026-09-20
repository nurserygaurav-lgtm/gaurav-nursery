import jwt from 'jsonwebtoken';

export function generateToken(userOrId) {
  let payload;
  if (typeof userOrId === 'object' && userOrId !== null) {
    const rawRole = (userOrId.role || 'customer').toUpperCase();
    const role = (rawRole === 'ADMIN' || rawRole === 'SUPER_ADMIN') ? 'SUPER_ADMIN' : rawRole;
    payload = {
      userId: (userOrId._id || userOrId.id || userOrId.userId).toString(),
      email: userOrId.email,
      name: userOrId.name,
      role
    };
  } else {
    payload = { userId: userOrId.toString() };
  }

  const secret = process.env.JWT_SECRET || 'gaurav-nursery-secret-key-super-secure-2026';
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}
