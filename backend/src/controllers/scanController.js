import { validateUrl } from '../validators/urlValidator.js';
import {
  submitUrlForAnalysis,
  pollAnalysisResult,
  getUrlReport,
  VirusTotalError,
} from '../services/virustotalService.js';
import { normalizeScanData } from '../services/normalizerService.js';
import {
  generateSecurityIntelligence,
  generateSecurityRecommendations,
} from '../services/intelligenceService.js';
import { scanCache } from '../utils/cache.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

export async function handleScanUrl(req, res, next) {
  try {
    const { url, forceRefresh } = req.body;

    // 1. Validate URL scheme and format
    const validation = validateUrl(url);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
        code: 'INVALID_URL',
      });
    }

    const targetUrl = validation.sanitizedUrl;

    // 2. Check cache first (unless forceRefresh is true)
    if (!forceRefresh) {
      const cached = scanCache.getByUrl(targetUrl);
      if (cached) {
        logger.info(`Cache hit for URL: ${targetUrl}`);
        return res.json({
          success: true,
          fromCache: true,
          data: cached,
        });
      }
    }

    // 3. Verify API key before starting scanning
    if (!config.isApiKeyConfigured()) {
      return res.status(400).json({
        success: false,
        error: 'VirusTotal API key not configured. Please add your API key in the .env file.',
        code: 'API_KEY_NOT_CONFIGURED',
      });
    }

    // 4. Check if VirusTotal already has a recent completed report for this URL
    let urlAttributes = null;
    let analysisAttributes = null;

    if (!forceRefresh) {
      try {
        urlAttributes = await getUrlReport(targetUrl);
        if (urlAttributes && urlAttributes.last_analysis_results && Object.keys(urlAttributes.last_analysis_results).length > 0) {
          logger.info(`Retrieved existing VirusTotal telemetry directly for: ${targetUrl}`);
          analysisAttributes = {
            stats: urlAttributes.last_analysis_stats,
            results: urlAttributes.last_analysis_results,
            date: urlAttributes.last_analysis_date,
            id: urlAttributes.id,
          };
        }
      } catch (err) {
        logger.debug('URL not yet indexed, proceeding to submit new scan');
      }
    }

    // 5. If no existing report was found or forceRefresh was requested, submit and poll
    if (!analysisAttributes) {
      logger.info(`Initiating fresh VirusTotal submission for: ${targetUrl}`);
      const analysisId = await submitUrlForAnalysis(targetUrl);
      analysisAttributes = await pollAnalysisResult(analysisId);
      urlAttributes = await getUrlReport(targetUrl);
    }

    // 7. Normalize raw telemetry
    const normalizedData = normalizeScanData(
      targetUrl,
      validation,
      urlAttributes,
      analysisAttributes
    );

    // 8. Generate rule-based Security Intelligence
    const intelligence = generateSecurityIntelligence(normalizedData);

    // 9. Generate context-aware recommendations
    const recommendations = generateSecurityRecommendations(
      normalizedData.verdict,
      normalizedData.isHttps
    );

    const fullResult = {
      ...normalizedData,
      intelligence,
      recommendations,
    };

    // 10. Store in cache
    scanCache.set(normalizedData.scanId, fullResult);

    return res.json({
      success: true,
      fromCache: false,
      data: fullResult,
    });
  } catch (error) {
    next(error);
  }
}

export async function getScanById(req, res, next) {
  try {
    const { id } = req.params;
    const report = scanCache.get(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Security scan report not found or expired.',
        code: 'REPORT_NOT_FOUND',
      });
    }

    return res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

export async function getScanHistory(req, res, next) {
  try {
    const reports = scanCache.getAllReports();
    return res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
}
