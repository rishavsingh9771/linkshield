import { useState, useRef, useCallback } from 'react';
import { scanApi } from '../api/client.js';

const SCAN_STEPS = [
  { progress: 10, message: 'Initializing Secure Scanner...' },
  { progress: 20, message: 'Validating URL & Security Schemes...' },
  { progress: 35, message: 'Connecting to VirusTotal API v3...' },
  { progress: 50, message: 'Collecting Threat Intelligence...' },
  { progress: 65, message: 'Checking Security Vendors & Blacklists...' },
  { progress: 75, message: 'Checking Reputation & Domain WHOIS...' },
  { progress: 85, message: 'Analyzing Redirection Hops & SSL...' },
  { progress: 95, message: 'Generating SOC Report & Recommendations...' },
  { progress: 100, message: 'Finalizing Threat Verification Results...' },
];

export function useScan(onScanSuccess) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'scanning' | 'complete' | 'error'
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState('');
  const [logs, setLogs] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const isCancelledRef = useRef(false);

  const startScan = useCallback(async (url, forceRefresh = false) => {
    if (!url || !url.trim()) {
      setError('Please enter a valid HTTP or HTTPS URL.');
      setStatus('error');
      return;
    }

    const trimmed = url.trim();
    // Immediate scheme check
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setError('Please enter a valid HTTP or HTTPS URL.');
      setStatus('error');
      return;
    }

    isCancelledRef.current = false;
    setStatus('scanning');
    setProgress(5);
    setLogs([]);
    setError(null);
    setScanResult(null);

    // Helper to append a log
    const addLog = (msg) => {
      setCurrentLog(msg);
      setLogs((prev) => [...prev, { text: msg, time: new Date().toLocaleTimeString() }]);
    };

    addLog(SCAN_STEPS[0].message);

    try {
      // Start API call in parallel with visual scan sequence
      const apiPromise = scanApi.scanUrl(trimmed, forceRefresh);

      // Play forward through scan steps smoothly
      for (let i = 1; i < SCAN_STEPS.length - 1; i++) {
        if (isCancelledRef.current) return;
        await new Promise((r) => setTimeout(r, 380));
        if (isCancelledRef.current) return;

        setProgress(SCAN_STEPS[i].progress);
        addLog(SCAN_STEPS[i].message);
      }

      // Await actual API response
      const response = await apiPromise;

      if (isCancelledRef.current) return;

      // Final step: 100%
      setProgress(100);
      addLog(SCAN_STEPS[SCAN_STEPS.length - 1].message);
      await new Promise((r) => setTimeout(r, 450));

      setScanResult(response.data);
      setStatus('complete');

      if (onScanSuccess) {
        onScanSuccess(response.data);
      }
    } catch (err) {
      if (isCancelledRef.current) return;
      console.error('Scan error:', err);
      const errMsg = err.message || 'Unable to complete the security analysis.';
      setError(errMsg);
      setStatus('error');
    }
  }, [onScanSuccess]);

  const resetScan = useCallback(() => {
    isCancelledRef.current = true;
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    setCurrentLog('');
    setScanResult(null);
    setError(null);
  }, []);

  const setManualResult = useCallback((data) => {
    setScanResult(data);
    setStatus('complete');
    setError(null);
  }, []);

  return {
    status,
    progress,
    currentLog,
    logs,
    scanResult,
    error,
    startScan,
    resetScan,
    setManualResult,
  };
}
