import { scanCache } from '../utils/cache.js';
import { generatePdfReport } from '../services/pdfService.js';
import { logger } from '../utils/logger.js';

export async function downloadReportPdf(req, res, next) {
  try {
    const { id } = req.params;
    const scanData = scanCache.get(id);

    if (!scanData) {
      return res.status(404).json({
        success: false,
        error: 'Scan report not found in cache. Please generate report from scan data.',
        code: 'REPORT_NOT_FOUND',
      });
    }

    const pdfBuffer = await generatePdfReport(
      scanData,
      scanData.intelligence || {},
      scanData.recommendations || []
    );

    const safeDomain = (scanData.domain || 'report').replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `LinkShield-Report-${safeDomain}-${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    logger.error('Failed to generate PDF from scan ID:', error);
    next(error);
  }
}

export async function generatePdfFromPayload(req, res, next) {
  try {
    const scanData = req.body;

    if (!scanData || !scanData.url || !scanData.verdict) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scan report data provided for PDF generation.',
        code: 'INVALID_DATA',
      });
    }

    const pdfBuffer = await generatePdfReport(
      scanData,
      scanData.intelligence || {},
      scanData.recommendations || []
    );

    const safeDomain = (scanData.domain || 'report').replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `LinkShield-Report-${safeDomain}-${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    logger.error('Failed to generate PDF from payload:', error);
    next(error);
  }
}
