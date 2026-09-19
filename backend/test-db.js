import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongo = await MongoMemoryServer.create();
console.log('MONGO_URI', mongo.getUri());

try {
  await mongoose.connect(mongo.getUri());
  console.log('CONNECTED');
} finally {
  await mongoose.disconnect();
  await mongo.stop();
}
