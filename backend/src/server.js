import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`  LINKSHIELD API SERVER INITIALIZED (v1.0.0)`);
  logger.info(`  Tagline: "Scan Smart. Click Safe."`);
  logger.info(`  Listening on port: ${PORT}`);
  logger.info(`  Environment: ${config.nodeEnv}`);
  logger.info(`  VirusTotal API Key Configured: ${config.isApiKeyConfigured() ? 'YES (Active)' : 'NO (Add in .env)'}`);
  logger.info(`=======================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down HTTP server cleanly.');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Terminating LinkShield server.');
  server.close(() => {
    process.exit(0);
  });
});
