import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Copy,
  ExternalLink,
  Check,
  Clock,
  Globe,
} from 'lucide-react';
import { getVerdictConfig, formatDate } from '../../utils/formatters.js';
import { copyToClipboard } from '../../utils/clipboard.js';

export default function VerdictCard({ scanResult, onToast }) {
  const [copied, setCopied] = useState(false);
  const verdictConfig = getVerdictConfig(scanResult.verdict);

  const handleCopyUrl = async () => {
    const ok = await copyToClipboard(scanResult.url);
    if (ok) {
      setCopied(true);
      if (onToast) onToast({ message: 'URL copied to clipboard', type: 'success' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getVerdictIcon = () => {
    switch (scanResult.verdict) {
      case 'SAFE':
        return <ShieldCheck className="w-9 h-9 text-emerald-400" />;
      case 'SUSPICIOUS':
        return <AlertTriangle className="w-9 h-9 text-amber-400" />;
      case 'MALICIOUS':
        return <ShieldAlert className="w-9 h-9 text-rose-500" />;
      default:
        return <HelpCircle className="w-9 h-9 text-slate-400" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-2xl bg-[#091124]/85 border border-cyan-500/30 shadow-2xl shadow-black/60">
      {/* Dynamic verdict background glow */}
      <div
        className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[100px] opacity-25 pointer-events-none ${
          scanResult.verdict === 'MALICIOUS'
            ? 'bg-red-500'
            : scanResult.verdict === 'SUSPICIOUS'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-cyan-500/20">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
            SECURITY ANALYSIS
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            Threat Intelligence Report
          </h3>
        </div>

        {/* Scan Timestamp */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatDate(scanResult.scanDate)}</span>
        </div>
      </div>

      {/* Submitted URL Bar */}
      <div className="mt-4 p-3.5 rounded-xl bg-[#050a16] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">
              SUBMITTED DESTINATION
            </span>
            <span className="text-sm font-mono text-cyan-200 font-medium truncate block">
              {scanResult.url}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all"
            title="Copy URL"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overall Verdict Banner */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-xl bg-slate-900/50 border border-cyan-500/20">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${verdictConfig.bg} border ${verdictConfig.border}`}>
            {getVerdictIcon()}
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              THREAT STATUS
            </span>
            <div className={`text-3xl sm:text-4xl font-black font-mono tracking-wide ${verdictConfig.color} ${verdictConfig.glow}`}>
              {scanResult.verdict}
            </div>
          </div>
        </div>

        <div className="text-center sm:text-right max-w-sm">
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {verdictConfig.description}
          </p>
        </div>
      </div>
    </div>
  );
}
