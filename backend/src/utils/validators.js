const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterInput({ name, email, password, role, phone }) {
  const errors = [];

  if (!name?.trim()) errors.push('Name is required');
  if (!email?.trim()) errors.push('Email is required');
  if (email && !emailPattern.test(email)) errors.push('Enter a valid email address');
  if (!password) errors.push('Password is required');
  if (password && password.length < 6) errors.push('Password must be at least 6 characters');
  if (role && !['customer', 'seller'].includes(role)) errors.push('Invalid account role');
  if (phone && !/^[0-9+\-\s]{7,15}$/.test(phone)) errors.push('Enter a valid phone number');

  return errors;
}

export function validateLoginInput({ email, password }) {
  const errors = [];

  if (!email?.trim()) errors.push('Email is required');
  if (email && !emailPattern.test(email)) errors.push('Enter a valid email address');
  if (!password) errors.push('Password is required');

  return errors;
}
