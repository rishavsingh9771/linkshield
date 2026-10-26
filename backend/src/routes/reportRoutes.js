import { Router } from 'express';
import { downloadReportPdf, generatePdfFromPayload } from '../controllers/reportController.js';
import { generalLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Download PDF by cached scan ID
router.get('/:id/pdf', generalLimiter, downloadReportPdf);

// Generate and download PDF from scan object payload
router.post('/pdf', generalLimiter, generatePdfFromPayload);

export default router;
