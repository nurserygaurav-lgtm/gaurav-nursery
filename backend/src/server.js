import app from './app.js';
import config from './config/env.js';
import connectDB from './config/db.js';

let server;

connectDB()
  .then(() => {
    server = app.listen(config.port, () => {
      console.log(`Gaurav Nursery API running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
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
