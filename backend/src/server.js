import app from './app.js';
import config from './config/env.js';
import connectDB from './config/db.js';

import { ensureMarketplaceBaseline } from './scripts/seedMarketplace.js';

let server;

connectDB()
  .then(async () => {
    await ensureMarketplaceBaseline();
    server = app.listen(config.port, () => {
      server.timeout = 120000;
      server.keepAliveTimeout = 120000;
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);
  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

