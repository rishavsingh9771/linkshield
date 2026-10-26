import { Router } from 'express';
import { handleScanUrl, getScanById, getScanHistory } from '../controllers/scanController.js';
import { scanLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Scan a URL
router.post('/', scanLimiter, handleScanUrl);

// Get scan history from server cache
router.get('/history', getScanHistory);

// Get scan by ID
router.get('/:id', getScanById);

export default router;
