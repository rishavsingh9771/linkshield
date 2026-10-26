/**
 * In-memory scan cache for LinkShield
 * Preserves scan reports for quick retrieval, PDF generation, and rate limit conservation.
 */
class ScanCache {
  constructor(maxSize = 200, ttlMs = 30 * 60 * 1000) {
    this.cache = new Map();
    this.urlToIdMap = new Map();
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  set(id, data) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.delete(oldestKey);
    }

    const entry = {
      data,
      timestamp: Date.now(),
    };

    this.cache.set(id, entry);
    if (data.url) {
      this.urlToIdMap.set(data.url, id);
    }
  }

  get(id) {
    const entry = this.cache.get(id);
    if (!entry) return null;

    // Expire if TTL exceeded
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.delete(id);
      return null;
    }

    return entry.data;
  }

  getByUrl(url) {
    const id = this.urlToIdMap.get(url);
    if (!id) return null;
    return this.get(id);
  }

  delete(id) {
    const entry = this.cache.get(id);
    if (entry && entry.data && entry.data.url) {
      this.urlToIdMap.delete(entry.data.url);
    }
    this.cache.delete(id);
  }

  getAllReports() {
    const reports = [];
    for (const [id, entry] of this.cache.entries()) {
      if (Date.now() - entry.timestamp <= this.ttlMs) {
        reports.push({
          id,
          url: entry.data.url,
          domain: entry.data.domain,
          verdict: entry.data.verdict,
          threatScore: entry.data.threatScore,
          scanDate: entry.data.scanDate || entry.data.timestamp,
        });
      }
    }
    return reports.reverse();
  }
}

export const scanCache = new ScanCache();
