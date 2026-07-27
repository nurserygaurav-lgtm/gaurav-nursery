import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) throw new Error('REDIS_URL is required for the worker');
const connection = new Redis(redisUrl, { maxRetriesPerRequest: null });

new Worker('notifications', async (job) => {
  // Email and WhatsApp providers are deliberately called only by workers, never by HTTP requests.
  console.log(`Processing notification job ${job.id}`);
}, { connection });

console.log('Gaurav Nursery worker is ready');
