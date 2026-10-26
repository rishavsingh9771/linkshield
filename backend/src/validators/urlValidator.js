/**
 * Validates and sanitizes a URL to ensure it is a valid HTTP or HTTPS URL.
 * Rejects unsafe schemes (javascript:, data:, file:, ftp:, etc.),
 * malformed syntaxes, and empty inputs.
 */
export function validateUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      isValid: false,
      error: 'Please enter a valid HTTP or HTTPS URL.',
      sanitizedUrl: null,
    };
  }

  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a valid HTTP or HTTPS URL.',
      sanitizedUrl: null,
    };
  }

  // Quick check for dangerous protocols or patterns before parsing
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('ftp:') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:')
  ) {
    return {
      isValid: false,
      error: 'Please enter a valid HTTP or HTTPS URL.',
      sanitizedUrl: null,
    };
  }

  try {
    const parsed = new URL(trimmed);

    // Only allow http: and https: protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'Please enter a valid HTTP or HTTPS URL.',
        sanitizedUrl: null,
      };
    }

    // Host must exist and contain at least one dot (or localhost) and valid characters
    const hostname = parsed.hostname;
    if (!hostname || hostname.length < 3) {
      return {
        isValid: false,
        error: 'Please enter a valid HTTP or HTTPS URL.',
        sanitizedUrl: null,
      };
    }

    // Check for obvious malformed characters or whitespace
    if (/\s/.test(trimmed)) {
      return {
        isValid: false,
        error: 'Please enter a valid HTTP or HTTPS URL.',
        sanitizedUrl: null,
      };
    }

    return {
      isValid: true,
      error: null,
      sanitizedUrl: parsed.href,
      domain: hostname,
      protocol: parsed.protocol,
      pathname: parsed.pathname,
    };
  } catch (err) {
    return {
      isValid: false,
      error: 'Please enter a valid HTTP or HTTPS URL.',
      sanitizedUrl: null,
    };
  }
}
