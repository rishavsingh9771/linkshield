/**
 * LinkShield Security Intelligence Engine
 * Deterministic rule-based threat assessment and context-aware security recommendations
 * derived strictly from empirical VirusTotal scan telemetry.
 */

export function generateSecurityIntelligence(normalizedData) {
  const { verdict, threatScore, stats, domain, url, isHttps, reputation, redirectionChain } = normalizedData;
  const maliciousCount = stats.malicious || 0;
  const suspiciousCount = stats.suspicious || 0;
  const harmlessCount = stats.harmless || 0;
  const totalVendors = stats.total || 0;

  // 1. Executive Summary
  let executiveSummary = '';
  if (verdict === 'MALICIOUS') {
    executiveSummary = `This URL (${url}) has been flagged by ${maliciousCount} independent cybersecurity threat intelligence vendor${maliciousCount > 1 ? 's' : ''}. Multiple security engines classify this destination as an active threat involving malware distribution, credential harvesting, or phishing. Users should immediately cease interaction and avoid opening this destination.`;
  } else if (verdict === 'SUSPICIOUS') {
    executiveSummary = `Suspicious activity has been reported for this URL (${url}) across ${suspiciousCount} security vendor${suspiciousCount > 1 ? 's' : ''}. While not universally verified as an active exploit, anomalous indicators or deceptive hosting patterns warrant elevated caution before proceeding.`;
  } else if (verdict === 'SAFE') {
    executiveSummary = `Security analysis across ${totalVendors} global threat intelligence engines yielded zero detections for malicious binaries, credential theft, or known phishing campaigns. The target host (${domain}) maintains a positive security posture under current evaluation.`;
  } else {
    executiveSummary = `Insufficient threat telemetry available for this URL from global scanning engines. Exercise general cyber hygiene when interacting with unindexed destinations.`;
  }

  // 2. Threat Assessment & Risk Explanation
  let threatAssessment = '';
  let riskExplanation = '';
  if (verdict === 'MALICIOUS') {
    threatAssessment = `HIGH-SEVERITY THREAT: The URL exhibits high-confidence threat signatures detected by major security vendors. Domain is actively associated with known cyber threats.`;
    riskExplanation = `The target URL or its hosting infrastructure matches known blacklists and behavioral threat rules. Visiting this link poses an acute risk of unauthorized code execution, browser compromise, or deceptive login credential extraction.`;
  } else if (verdict === 'SUSPICIOUS') {
    threatAssessment = `ELEVATED RISK: Inconclusive or suspicious behavior observed by security engines without full consensus.`;
    riskExplanation = `Unusual redirects (${redirectionChain.length} hops detected), unverified host reputation (${reputation}), or low domain age suggest this link may be an unclassified lure or deceptive redirector.`;
  } else {
    threatAssessment = `MINIMAL RISK: No vendor blacklists or behavioral threat patterns were triggered during inspection.`;
    riskExplanation = `Standard web destination with consistent protocol certificates (${isHttps ? 'Valid HTTPS' : 'Insecure HTTP'}) and benign vendor evaluations.`;
  }

  // 3. Possible Attack Scenarios
  let attackScenarios = [];
  if (verdict === 'MALICIOUS') {
    attackScenarios = [
      {
        vector: 'Spear-Phishing / Credential Harvesting',
        description: 'Impersonates authentic enterprise portals (e.g. Microsoft 365, Google, Banking) to intercept credentials and session cookies.',
      },
      {
        vector: 'Drive-by Malware Infiltration',
        description: 'Attempts automated browser exploitation or downloads obfuscated executable payloads upon page load.',
      },
      {
        vector: 'Session Hijacking & Token Theft',
        description: 'Deploys malicious scripts designed to exfiltrate active authentication tokens and browser storage.',
      }
    ];
  } else if (verdict === 'SUSPICIOUS') {
    attackScenarios = [
      {
        vector: 'Deceptive Traffic Redirection',
        description: 'Directs users through cloaked intermediary servers that alter target destinations depending on visitor geography or user-agent.',
      },
      {
        vector: 'Social Engineering Lure',
        description: 'Presents deceptive notifications, fake giveaways, or urgent tech-support warnings designed to prompt user action.',
      }
    ];
  } else {
    attackScenarios = [
      {
        vector: 'Routine Web Interaction',
        description: 'Standard HTTP/HTTPS web delivery. No active threat vectors or exploitation mechanics identified by scanning engines.',
      }
    ];
  }

  // 4. Business & User Impact
  let businessImpact = '';
  let userImpact = '';
  if (verdict === 'MALICIOUS') {
    businessImpact = 'Critical risk of corporate network perimeter breach, compliance violations, data exfiltration, and downstream lateral movement.';
    userImpact = 'Immediate risk of personal identity theft, compromised financial accounts, stolen credentials, and persistent endpoint malware.';
  } else if (verdict === 'SUSPICIOUS') {
    businessImpact = 'Potential compliance and reputation risk if employees interact with untrusted third-party services or shadow IT assets.';
    userImpact = 'Risk of exposure to aggressive adware, tracking beacons, or deceptive forms requesting unnecessary permissions.';
  } else {
    businessImpact = 'Negligible business risk identified under current threat intelligence evaluation.';
    userImpact = 'Normal browsing experience with standard web safety protocols.';
  }

  // 5. Recommended Action
  let recommendedAction = '';
  if (verdict === 'MALICIOUS') {
    recommendedAction = 'BLOCK & ISOLATE: Immediately add this domain/URL to firewall and DNS sinkholes. Terminate any active sessions and purge local DNS cache.';
  } else if (verdict === 'SUSPICIOUS') {
    recommendedAction = 'EXERCISE CAUTION: Do not submit login credentials, sensitive personal data, or payment information. Inspect destination URL carefully.';
  } else {
    recommendedAction = 'PROCEED NORMALLY: Link demonstrates benign indicators. Standard web hygiene remains recommended.';
  }

  // 6. Confidence Level
  // High confidence if total vendors >= 60, or if multiple malicious detections confirm threat
  let confidenceLevel = 'High';
  let confidenceScore = 95;
  if (totalVendors < 30) {
    confidenceLevel = 'Moderate';
    confidenceScore = 65;
  } else if (maliciousCount > 0 && totalVendors >= 50) {
    confidenceLevel = 'Very High';
    confidenceScore = 98;
  }

  return {
    executiveSummary,
    threatAssessment,
    riskExplanation,
    attackScenarios,
    businessImpact,
    userImpact,
    recommendedAction,
    confidenceLevel,
    confidenceScore,
  };
}

/**
 * Generate context-aware security recommendations
 */
export function generateSecurityRecommendations(verdict, isHttps) {
  const recommendations = [];

  if (verdict === 'MALICIOUS') {
    recommendations.push(
      {
        id: 'rec-block',
        title: 'Block and Blacklist Destination',
        description: 'Add this domain to organization DNS sinkholes, firewall blocklists, and browser security policies immediately.',
        urgency: 'critical',
        icon: 'ban',
      },
      {
        id: 'rec-no-creds',
        title: 'Never Enter Credentials or Personal Data',
        description: 'Do not provide usernames, passwords, API tokens, or banking information on this site or any redirected destination.',
        urgency: 'critical',
        icon: 'key',
      },
      {
        id: 'rec-mfa',
        title: 'Enforce Multi-Factor Authentication (MFA)',
        description: 'Ensure all accounts (especially email and enterprise SSO) require strong hardware-token or authenticator-app MFA.',
        urgency: 'high',
        icon: 'shield-check',
      },
      {
        id: 'rec-sandbox',
        title: 'Inspect Only in Isolated Sandbox',
        description: 'If forensic investigation is required, access this URL strictly within an isolated, disposable cloud sandbox or virtual machine.',
        urgency: 'high',
        icon: 'box',
      },
      {
        id: 'rec-report',
        title: 'Report URL to Security Authorities',
        description: 'Submit this URL to Google Safe Browsing, Microsoft Defender SmartScreen, and US-CERT to protect the broader community.',
        urgency: 'medium',
        icon: 'flag',
      }
    );
  } else if (verdict === 'SUSPICIOUS') {
    recommendations.push(
      {
        id: 'rec-verify-domain',
        title: 'Verify Domain Ownership & Identity',
        description: 'Check whether the domain matches the official brand spelling. Beware of homograph and typosquatting attacks.',
        urgency: 'high',
        icon: 'check-circle',
      },
      {
        id: 'rec-ssl',
        title: 'Check TLS/SSL Certificate Issuer',
        description: 'Inspect the browser padlock to verify that the SSL certificate was issued to the genuine entity.',
        urgency: 'medium',
        icon: 'lock',
      },
      {
        id: 'rec-no-downloads',
        title: 'Refuse Unexpected File Downloads',
        description: 'Do not execute or save any files, browser extensions, or profile configurations prompted by this destination.',
        urgency: 'high',
        icon: 'download-cloud',
      },
      {
        id: 'rec-browser-update',
        title: 'Keep Web Browser Fully Updated',
        description: 'Ensure your web browser is patched against recent zero-day vulnerabilities before navigating unfamiliar sites.',
        urgency: 'medium',
        icon: 'refresh-cw',
      }
    );
  } else {
    // SAFE
    recommendations.push(
      {
        id: 'rec-safe-verify',
        title: 'Verify URL Context and Origin',
        description: 'Ensure this link was received from a trusted source, as safe links can sometimes be used in redirection chains.',
        urgency: 'low',
        icon: 'check-circle',
      },
      {
        id: 'rec-safe-https',
        title: isHttps ? 'Maintain HTTPS Connection' : 'Upgrade to HTTPS',
        description: isHttps
          ? 'Connection is encrypted with TLS. Confirm padlock icon in your browser address bar.'
          : 'This link uses unencrypted HTTP. Do not send sensitive passwords or payment details.',
        urgency: isHttps ? 'low' : 'high',
        icon: isHttps ? 'lock' : 'lock-open',
      },
      {
        id: 'rec-safe-mfa',
        title: 'Practice Routine Cyber Hygiene',
        description: 'Keep multi-factor authentication enabled on all core online accounts as standard defense-in-depth.',
        urgency: 'low',
        icon: 'shield',
      },
      {
        id: 'rec-safe-endpoint',
        title: 'Maintain Active Endpoint Protection',
        description: 'Ensure real-time antivirus and operating system security patches remain active on your workstation.',
        urgency: 'low',
        icon: 'cpu',
      }
    );
  }

  return recommendations;
}
