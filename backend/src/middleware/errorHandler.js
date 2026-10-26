import { logger } from '../utils/logger.js';
import { VirusTotalError } from '../services/virustotalService.js';

export function errorHandler(err, req, res, next) {
  logger.error(`Error processing ${req.method} ${req.originalUrl}:`, err);

  // If already sent headers, delegate to default express error handler
  if (res.headersSent) {
    return next(err);
  }

  // VirusTotal custom errors
  if (err instanceof VirusTotalError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message,
      code: err.code || 'VT_ERROR',
    });
  }

  // Syntax errors (e.g. malformed JSON in body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload provided.',
      code: 'BAD_REQUEST',
    });
  }

  // Generic internal server error (never leak stack trace)
  return res.status(500).json({
    success: false,
    error: 'Unable to complete the security analysis.',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
