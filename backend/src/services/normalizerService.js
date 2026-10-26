/**
 * LinkShield Normalizer Service
 * Safely parses and normalizes VirusTotal v3 responses into a structured format.
 * Never invents facts; provides clean fallback indicators.
 */

// Known URL shortener domains for threat indicators
const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'buff.ly',
  'is.gd', 'cutt.ly', 'rebrand.ly', 'shorturl.at', 'rb.gy', 'tiny.cc',
  'v.gd', 'lnkd.in', 'qr.ae', 'adf.ly', 'bitly.com', 'bl.ink'
]);

/**
 * Calculate dynamic Threat Score (0 - 100) and risk tier
 */
export function calculateThreatScore(stats, reputation = 0) {
  const malicious = stats?.malicious || 0;
  const suspicious = stats?.suspicious || 0;
  const harmless = stats?.harmless || 0;
  const undetected = stats?.undetected || 0;
  const timeout = stats?.timeout || 0;
  const totalVendors = malicious + suspicious + harmless + undetected + timeout;

  let score = 0;
  let riskLevel = 'Excellent';
  let verdict = 'SAFE';

  if (totalVendors === 0) {
    return {
      score: 0,
      riskLevel: 'Unknown',
      verdict: 'UNKNOWN',
      color: '#6b7280',
    };
  }

  if (malicious >= 4) {
    // Critical risk: 85 - 100
    score = Math.min(100, 85 + Math.floor((malicious - 4) * 1.5));
    riskLevel = 'Critical';
    verdict = 'MALICIOUS';
  } else if (malicious >= 2) {
    // High risk: 62 - 82
    score = Math.min(82, 60 + malicious * 6 + suspicious * 3);
    riskLevel = score >= 75 ? 'Critical' : 'High';
    verdict = 'MALICIOUS';
  } else if (malicious === 1) {
    // 1 single vendor detection: check consensus ratio
    if (harmless >= 35) {
      score = 36;
      riskLevel = 'Medium';
      verdict = 'SUSPICIOUS';
    } else {
      score = 65;
      riskLevel = 'High';
      verdict = 'MALICIOUS';
    }
  } else if (suspicious >= 2) {
    // Medium risk: 41 - 60
    score = Math.min(60, 42 + suspicious * 5);
    riskLevel = 'Medium';
    verdict = 'SUSPICIOUS';
  } else if (suspicious === 1) {
    // Low-Medium risk: 25 - 40
    score = 28;
    if (reputation < 0) score += 10;
    riskLevel = score > 40 ? 'Medium' : 'Good';
    verdict = score > 40 ? 'SUSPICIOUS' : 'SAFE';
  } else {
    // Zero malicious, zero suspicious
    if (reputation < 0) {
      score = Math.min(38, Math.abs(reputation));
      riskLevel = 'Good';
      verdict = 'SAFE';
    } else {
      score = Math.max(2, Math.min(15, Math.round((undetected / Math.max(1, totalVendors)) * 12)));
      riskLevel = 'Excellent';
      verdict = 'SAFE';
    }
  }

  // Dynamic status color
  let color = '#10b981'; // safe neon green
  if (verdict === 'MALICIOUS') {
    color = '#ef4444'; // red
  } else if (verdict === 'SUSPICIOUS') {
    color = '#f59e0b'; // yellow/amber
  } else if (riskLevel === 'High') {
    color = '#f97316'; // orange
  }

  return {
    score,
    riskLevel,
    verdict,
    color,
  };
}

/**
 * Extract threat indicators from URL and VirusTotal metadata
 */
export function extractThreatIndicators(url, parsedUrl, vtData, stats) {
  const indicators = [];
  const domain = parsedUrl?.domain || '';
  const isHttps = parsedUrl?.protocol === 'https:';
  const malicious = stats?.malicious || 0;
  const suspicious = stats?.suspicious || 0;
  const reputation = vtData?.reputation || 0;
  const redirectChain = vtData?.redirection_chain || [];

  // 1. Vendor Detections
  if (malicious > 0) {
    indicators.push({
      id: 'malicious_vendors',
      name: 'Malicious Security Detections',
      severity: 'critical',
      description: `${malicious} security vendor${malicious > 1 ? 's have' : ' has'} flagged this link as malicious or dangerous.`,
      icon: 'shield-alert',
    });
  }

  if (suspicious > 0) {
    indicators.push({
      id: 'suspicious_vendors',
      name: 'Suspicious Vendor Flags',
      severity: malicious > 0 ? 'high' : 'medium',
      description: `${suspicious} security vendor${suspicious > 1 ? 's' : ''} classified this URL as suspicious or untrusted.`,
      icon: 'alert-triangle',
    });
  }

  // 2. Protocol Security (HTTPS vs HTTP)
  if (!isHttps) {
    indicators.push({
      id: 'insecure_http',
      name: 'Unencrypted HTTP Protocol',
      severity: 'medium',
      description: 'The URL uses unencrypted HTTP. Data transmitted (passwords, cookies) can be intercepted via man-in-the-middle attacks.',
      icon: 'lock-open',
    });
  } else {
    indicators.push({
      id: 'secure_https',
      name: 'Encrypted HTTPS Connection',
      severity: 'safe',
      description: 'The destination uses TLS/SSL transport encryption for transmission security.',
      icon: 'lock',
    });
  }

  // 3. URL Shortener Detection
  if (SHORTENER_DOMAINS.has(domain.toLowerCase())) {
    indicators.push({
      id: 'url_shortener',
      name: 'URL Shortener Detected',
      severity: 'medium',
      description: `Domain '${domain}' is a known link shortening service. Phishing campaigns frequently disguise true destinations using shorteners.`,
      icon: 'link-2',
    });
  }

  // 4. Redirection Chain
  if (redirectChain.length > 2) {
    indicators.push({
      id: 'excessive_redirects',
      name: 'Multiple Redirect Hops',
      severity: 'medium',
      description: `Link traverses ${redirectChain.length} redirection hops, a pattern often used to evade automated link crawlers.`,
      icon: 'shuffle',
    });
  }

  // 5. Reputation Score
  if (reputation < -10) {
    indicators.push({
      id: 'negative_reputation',
      name: 'Negative Community Reputation',
      severity: 'high',
      description: `VirusTotal community reputation score is heavily negative (${reputation}).`,
      icon: 'thumbs-down',
    });
  } else if (reputation > 10) {
    indicators.push({
      id: 'positive_reputation',
      name: 'Positive Community Reputation',
      severity: 'safe',
      description: `Community reputation score is positive (${reputation}) with verified harmless votes.`,
      icon: 'thumbs-up',
    });
  }

  // 6. Overall cleanliness if no bad indicators
  if (malicious === 0 && suspicious === 0) {
    indicators.push({
      id: 'clean_scan',
      name: 'Consensus Clean Reputation',
      severity: 'safe',
      description: 'No threat intelligence vendors flagged this link as malicious or suspicious during this scan.',
      icon: 'shield-check',
    });
  }

  return indicators;
}

/**
 * Format timestamp safely
 */
function formatTimestamp(epochSeconds) {
  if (!epochSeconds) return 'Not available';
  try {
    return new Date(epochSeconds * 1000).toISOString();
  } catch (err) {
    return 'Not available';
  }
}

/**
 * Normalize complete URL object and analysis findings
 */
export function normalizeScanData(submittedUrl, parsedUrl, vtData, analysisAttributes) {
  // Merge attributes from both analysis and url resource
  const stats = analysisAttributes?.stats || vtData?.last_analysis_stats || {
    harmless: 0,
    malicious: 0,
    suspicious: 0,
    undetected: 0,
    timeout: 0,
  };

  const rawVendors = analysisAttributes?.results || vtData?.last_analysis_results || {};

  // Build full dynamic vendor analysis list
  const vendors = Object.entries(rawVendors).map(([engineName, vendorData]) => {
    const category = vendorData?.category || 'undetected';
    const result = vendorData?.result || 'clean';
    const method = vendorData?.method || 'blacklist';
    const update = vendorData?.engine_update || 'Not provided by VirusTotal';

    return {
      name: engineName,
      category, // 'harmless' | 'suspicious' | 'malicious' | 'undetected' | 'timeout'
      result,
      method,
      updateDate: update,
    };
  });

  // Calculate score & verdict
  const reputation = vtData?.reputation ?? 0;
  const { score, riskLevel, verdict, color } = calculateThreatScore(stats, reputation);

  // Extract threat indicators
  const indicators = extractThreatIndicators(submittedUrl, parsedUrl, vtData, stats);

  // Parse categories safely
  const categories = vtData?.categories
    ? Object.entries(vtData.categories).map(([source, cat]) => ({ source, category: cat }))
    : [];

  // Parse redirection chain safely
  const redirectionChain = vtData?.redirection_chain || [];

  // Parse tags
  const tags = vtData?.tags || [];

  // Format WHOIS
  const whois = vtData?.whois ? String(vtData.whois).trim() : 'Not provided by VirusTotal';

  // Last analysis date
  const lastAnalysisEpoch = vtData?.last_analysis_date || analysisAttributes?.date;
  const lastAnalysisDate = formatTimestamp(lastAnalysisEpoch);

  // Community votes
  const totalVotes = vtData?.total_votes || { harmless: 0, malicious: 0 };

  return {
    scanId: analysisAttributes?.id || `scan-${Date.now()}`,
    url: submittedUrl,
    finalUrl: vtData?.last_final_url || submittedUrl,
    domain: parsedUrl?.domain || 'Not available',
    hostname: parsedUrl?.domain || 'Not available',
    protocol: parsedUrl?.protocol || 'https:',
    isHttps: parsedUrl?.protocol === 'https:',
    scanDate: new Date().toISOString(),
    lastAnalysisDate,
    verdict,
    threatScore: score,
    riskLevel,
    statusColor: color,
    reputation,
    stats: {
      harmless: stats.harmless || 0,
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      undetected: stats.undetected || 0,
      timeout: stats.timeout || 0,
      total: (stats.harmless || 0) + (stats.malicious || 0) + (stats.suspicious || 0) + (stats.undetected || 0) + (stats.timeout || 0),
    },
    communityVotes: {
      harmless: totalVotes.harmless || 0,
      malicious: totalVotes.malicious || 0,
    },
    httpDetails: {
      responseCode: vtData?.last_http_response_code ? String(vtData.last_http_response_code) : 'Not available',
      contentType: vtData?.last_http_response_content_type || 'Not provided by VirusTotal',
      contentLength: vtData?.last_http_response_content_length ? `${vtData.last_http_response_content_length} bytes` : 'Not available',
      title: vtData?.title || 'Not provided by VirusTotal',
    },
    redirectionChain,
    categories,
    tags,
    whois,
    indicators,
    vendors,
  };
}
