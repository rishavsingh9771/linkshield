import axios from 'axios';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const VT_BASE_URL = 'https://www.virustotal.com/api/v3';
const REQUEST_TIMEOUT_MS = 25000;
const MAX_POLL_ATTEMPTS = 20; // 20 * 2000ms = 40s
const POLL_INTERVAL_MS = 2000;

export class VirusTotalError extends Error {
  constructor(message, statusCode = 500, code = 'VT_ERROR') {
    super(message);
    this.name = 'VirusTotalError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Encode URL to base64url string without padding '=' for VirusTotal API v3 URL lookup
 */
export function getUrlIdentifier(url) {
  return Buffer.from(url)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sleep helper for polling
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Build Axios client for VirusTotal API v3
 */
function getVtClient() {
  if (!config.isApiKeyConfigured()) {
    throw new VirusTotalError(
      'VirusTotal API key not configured. Please add your API key in the .env file.',
      400,
      'API_KEY_NOT_CONFIGURED'
    );
  }

  return axios.create({
    baseURL: VT_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
      'x-apikey': config.virusTotalApiKey,
      'Accept': 'application/json',
    },
  });
}

/**
 * Submit URL to VirusTotal for scanning
 */
export async function submitUrlForAnalysis(url) {
  const client = getVtClient();
  try {
    logger.info(`Submitting URL to VirusTotal: ${url}`);
    const params = new URLSearchParams();
    params.append('url', url);

    const response = await client.post('/urls', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const analysisId = response.data?.data?.id;
    if (!analysisId) {
      throw new VirusTotalError('Failed to obtain analysis ID from VirusTotal.', 502);
    }

    return analysisId;
  } catch (error) {
    handleVtAxiosError(error, 'submitUrlForAnalysis');
  }
}

/**
 * Poll analysis status until completed or timeout
 */
export async function pollAnalysisResult(analysisId) {
  const client = getVtClient();
  logger.info(`Polling analysis status for ID: ${analysisId}`);

  let lastAttributes = null;

  for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt++) {
    try {
      const response = await client.get(`/analyses/${analysisId}`);
      const attributes = response.data?.data?.attributes;
      lastAttributes = attributes;
      const status = attributes?.status;

      logger.debug(`Poll attempt ${attempt}/${MAX_POLL_ATTEMPTS}: status = ${status}`);

      if (status === 'completed') {
        return attributes;
      }

      // If at least 10 attempts have passed and engines are already populated, return available results on later attempts
      if (attempt >= 12 && attributes?.results && Object.keys(attributes.results).length >= 10) {
        logger.info(`Returning available vendor findings (${Object.keys(attributes.results).length} vendors) while analysis finalizes.`);
        return attributes;
      }

      // Wait before next poll
      await sleep(POLL_INTERVAL_MS);
    } catch (error) {
      handleVtAxiosError(error, 'pollAnalysisResult');
    }
  }

  if (lastAttributes?.results && Object.keys(lastAttributes.results).length > 0) {
    return lastAttributes;
  }

  throw new VirusTotalError(
    'The security analysis timed out. Please try again.',
    504,
    'ANALYSIS_TIMEOUT'
  );
}

/**
 * Fetch full enriched URL report using base64url ID
 */
export async function getUrlReport(url) {
  const client = getVtClient();
  const urlId = getUrlIdentifier(url);

  try {
    logger.info(`Fetching detailed URL object: ${url} (ID: ${urlId})`);
    const response = await client.get(`/urls/${urlId}`);
    return response.data?.data?.attributes || null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logger.info(`URL not yet indexed in VirusTotal database: ${url}`);
      return null;
    }
    handleVtAxiosError(error, 'getUrlReport');
  }
}

/**
 * Standardized error handling for VirusTotal Axios requests
 */
function handleVtAxiosError(error, operation) {
  if (error instanceof VirusTotalError) {
    throw error;
  }

  logger.error(`VirusTotal error in ${operation}:`, error);

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401 || status === 403) {
      throw new VirusTotalError(
        'Invalid VirusTotal API key. Please verify the API key in your .env file.',
        401,
        'INVALID_API_KEY'
      );
    }

    if (status === 429) {
      throw new VirusTotalError(
        'VirusTotal rate limit reached. Please try again later.',
        429,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    if (status === 400) {
      const message = data?.error?.message || 'Invalid URL or request format provided to VirusTotal.';
      throw new VirusTotalError(message, 400, 'BAD_REQUEST');
    }

    const message = data?.error?.message || 'VirusTotal service returned an error.';
    throw new VirusTotalError(message, status >= 500 ? 502 : status, 'VT_API_ERROR');
  }

  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    throw new VirusTotalError(
      'The security analysis timed out. Please try again.',
      504,
      'ANALYSIS_TIMEOUT'
    );
  }

  throw new VirusTotalError(
    'Unable to complete the security analysis.',
    500,
    'NETWORK_ERROR'
  );
}
