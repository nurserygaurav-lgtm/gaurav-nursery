import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import authRoutes from './modules/auth/routes.js';
import healthRoutes from './modules/health/routes.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: [env.CUSTOMER_WEB_URL, env.SELLER_PANEL_URL, env.ADMIN_PANEL_URL], credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } }));
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details: error.flatten() } });
  console.error(error);
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error' } });
});
export default app;
