import { Router } from 'express';
import { config } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'LinkShield Security API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: config.isApiKeyConfigured(),
  });
});

export default router;
