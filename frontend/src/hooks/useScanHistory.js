import { useState, useEffect } from 'react';

const STORAGE_KEY = 'linkshield_scan_history_v1';
const MAX_HISTORY_ITEMS = 50;

export function useScanHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.warn('Failed to load scan history from localStorage:', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      console.warn('Failed to save scan history to localStorage:', err);
    }
  }, [history]);

  const addScan = (scanResult) => {
    if (!scanResult || !scanResult.url) return;

    setHistory((prev) => {
      // Remove any existing entry for this exact URL to deduplicate
      const filtered = prev.filter((item) => item.url !== scanResult.url);

      const historyEntry = {
        id: scanResult.scanId || `scan-${Date.now()}`,
        url: scanResult.url,
        finalUrl: scanResult.finalUrl,
        domain: scanResult.domain,
        verdict: scanResult.verdict,
        threatScore: scanResult.threatScore,
        riskLevel: scanResult.riskLevel,
        statusColor: scanResult.statusColor,
        scanDate: scanResult.scanDate || new Date().toISOString(),
        stats: scanResult.stats,
        fullData: scanResult, // Stored so users can re-inspect the exact scan
      };

      return [historyEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const removeScan = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // Ignore
    }
  };

  return {
    history,
    addScan,
    removeScan,
    clearHistory,
  };
}
