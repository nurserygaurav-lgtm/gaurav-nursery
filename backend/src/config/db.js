import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import config from './env.js';

let memoryServer;

export default async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri || 'mongodb://127.0.0.1:27017/gaurav_nursery', {
      autoIndex: !config.isProduction
    });
    console.log('MongoDB Connected');
    return;
  } catch (error) {
    const isLocalMongoUri = /127\.0\.0\.1|localhost/.test(String(config.mongoUri || ''));
    const canUseLocalFallback = !config.isProduction && (error?.code === 'ECONNREFUSED' || isLocalMongoUri || !config.mongoUri);

    if (!canUseLocalFallback) {
      console.error(`MongoDB connection failed: ${error.message}`);
      process.exit(1);
    }

    memoryServer = await MongoMemoryServer.create();
    const fallbackUri = memoryServer.getUri();
    await mongoose.connect(fallbackUri, { autoIndex: true });
    console.log(`MongoDB Connected (in-memory fallback): ${fallbackUri}`);
  }
}

export async function stopMemoryServer() {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
