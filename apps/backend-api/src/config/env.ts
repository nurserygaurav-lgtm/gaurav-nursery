import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  CUSTOMER_WEB_URL: z.string().url(),
  SELLER_PANEL_URL: z.string().url(),
  ADMIN_PANEL_URL: z.string().url()
});

export const env = schema.parse(process.env);
