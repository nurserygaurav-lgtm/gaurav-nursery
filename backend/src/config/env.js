import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env');
dotenv.config({ path: envPath });

const requiredInProduction = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLIENT_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET'
];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required production env vars: ${missing.join(', ')}`);
  }
}

function parseOrigins(value) {
  return value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const config = {
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS || process.env.CLIENT_URL) || ['http://localhost:5173'],
  isProduction: process.env.NODE_ENV === 'production',
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 200),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000)
};

export default config;
