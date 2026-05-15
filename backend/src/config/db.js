import mongoose from 'mongoose';
import config from './env.js';

export default async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: !config.isProduction
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}
