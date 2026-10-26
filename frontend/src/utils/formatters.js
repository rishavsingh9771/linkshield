/**
 * Format helpers for LinkShield
 */

export function formatDate(isoString) {
  if (!isoString || isoString === 'Not available') return 'Not available';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (err) {
    return isoString;
  }
}

export function getVerdictConfig(verdict) {
  switch (verdict) {
    case 'SAFE':
      return {
        label: 'SAFE',
        color: 'text-cyber-safe',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500 text-black',
        glow: 'text-glow-safe',
        dot: 'bg-emerald-400',
        description: 'Zero malicious or suspicious threats identified across threat engines.',
      };
    case 'SUSPICIOUS':
      return {
        label: 'SUSPICIOUS',
        color: 'text-cyber-warning',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500 text-black',
        glow: '',
        dot: 'bg-amber-400',
        description: 'Anomalous signals or suspicious indicators detected. Exercise caution.',
      };
    case 'MALICIOUS':
      return {
        label: 'MALICIOUS',
        color: 'text-cyber-danger',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        badge: 'bg-red-600 text-white',
        glow: 'text-glow-danger',
        dot: 'bg-red-500',
        description: 'Active malicious threat detected. High probability of malware or credential phishing.',
      };
    default:
      return {
        label: 'UNKNOWN',
        color: 'text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        badge: 'bg-slate-600 text-white',
        glow: '',
        dot: 'bg-slate-400',
        description: 'Insufficient telemetry to classify security risk.',
      };
  }
}

export function getRiskLevelConfig(riskLevel) {
  switch (riskLevel) {
    case 'Critical':
      return { text: 'Critical', color: '#ef4444', class: 'text-red-500' };
    case 'High':
      return { text: 'High Risk', color: '#f97316', class: 'text-orange-500' };
    case 'Medium':
      return { text: 'Medium Risk', color: '#f59e0b', class: 'text-amber-400' };
    case 'Good':
      return { text: 'Good / Low Risk', color: '#22c55e', class: 'text-green-400' };
    case 'Excellent':
    default:
      return { text: 'Excellent / Safe', color: '#10b981', class: 'text-emerald-400' };
  }
}

export function truncateUrl(url, maxLen = 45) {
  if (!url) return '';
  if (url.length <= maxLen) return url;
  return url.substring(0, maxLen) + '...';
}
