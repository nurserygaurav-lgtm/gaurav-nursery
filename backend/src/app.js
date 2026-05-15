import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();
const allowedOrigins = [
  'https://gaurav-nursery.vercel.app',
  'https://www.gauravnursery.online',
  'https://gauravnursery.online',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(compression());
app.use(morgan(config.isProduction ? 'combined' : 'dev'));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  rateLimit({
    windowMs: config.rateLimitWindowMs,
    limit: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'gaurav-nursery-api',
    environment: config.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
