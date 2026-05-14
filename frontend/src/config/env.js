const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  appName: import.meta.env.VITE_APP_NAME || 'Gaurav Nursery',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || ''
};

export default env;
