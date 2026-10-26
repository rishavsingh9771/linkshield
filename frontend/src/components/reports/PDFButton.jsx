import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { scanApi } from '../../api/client.js';

export default function PDFButton({ scanResult, onToast }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!scanResult || isDownloading) return;
    setIsDownloading(true);

    try {
      if (onToast) {
        onToast({ message: 'Compiling enterprise PDF security report...', type: 'info' });
      }

      await scanApi.downloadPdf(scanResult);

      if (onToast) {
        onToast({ message: 'Security report downloaded successfully!', type: 'success' });
      }
    } catch (err) {
      console.error('PDF download error:', err);
      if (onToast) {
        onToast({
          message: err.message || 'Failed to download PDF report. Please try again.',
          type: 'error',
        });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleDownload}
      disabled={isDownloading}
      className="relative flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold font-mono text-sm tracking-wide bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/10 border border-cyan-400/40 text-cyan-300 hover:text-white hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50 group"
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>Generating PDF Report...</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Download Full Security Report</span>
          <Download className="w-4 h-4 text-cyan-400 ml-1 group-hover:translate-y-0.5 transition-transform" />
        </>
      )}

      {/* Cyber corner marks */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400" />
    </motion.button>
  );
}
