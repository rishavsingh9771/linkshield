import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 35000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanApi = {
  /**
   * Scan a URL with VirusTotal
   */
  async scanUrl(url, forceRefresh = false) {
    try {
      const response = await api.post('/scan', { url, forceRefresh });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Unable to complete the security analysis.';
      const code = error.response?.data?.code || 'UNKNOWN_ERROR';
      throw { message, code, status: error.response?.status };
    }
  },

  /**
   * Fetch scan by ID
   */
  async getScan(id) {
    const response = await api.get(`/scan/${id}`);
    return response.data;
  },

  /**
   * Fetch scan history from server cache
   */
  async getHistory() {
    const response = await api.get('/scan/history');
    return response.data;
  },

  /**
   * Download PDF by scanId or payload
   */
  async downloadPdf(scanData) {
    let response;
    if (scanData.scanId && !scanData.scanId.startsWith('mock-')) {
      // Try GET by ID
      try {
        response = await api.get(`/report/${scanData.scanId}/pdf`, {
          responseType: 'blob',
        });
      } catch (err) {
        // Fallback to POST payload
        response = await api.post('/report/pdf', scanData, {
          responseType: 'blob',
        });
      }
    } else {
      // POST payload
      response = await api.post('/report/pdf', scanData, {
        responseType: 'blob',
      });
    }

    const safeDomain = (scanData.domain || 'report').replace(/[^a-zA-Z0-9.-]/g, '_');
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LinkShield-Report-${safeDomain}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Health check
   */
  async getHealth() {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
