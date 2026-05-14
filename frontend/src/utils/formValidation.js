const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(values) {
  const errors = {};

  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!emailPattern.test(values.email)) errors.email = 'Enter a valid email';

  if (!values.password) errors.password = 'Password is required';

  return errors;
}

export function validateRegisterForm(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Full name is required';
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!emailPattern.test(values.email)) errors.email = 'Enter a valid email';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Use at least 6 characters';
  if (values.phone && !/^[0-9+\-\s]{7,15}$/.test(values.phone)) errors.phone = 'Enter a valid phone number';
  if (!['customer', 'seller'].includes(values.role)) errors.role = 'Choose a valid role';
  if (values.role === 'seller' && !values.shopName.trim()) errors.shopName = 'Shop name is required for sellers';

  return errors;
}
