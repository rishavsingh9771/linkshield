import React from 'react';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import GlassCard from '../common/GlassCard.jsx';

export default function SecuritySummary({ intelligence, scanResult }) {
  const isMalicious = scanResult?.verdict === 'MALICIOUS';
  const isSuspicious = scanResult?.verdict === 'SUSPICIOUS';

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-cyan-500/20 mb-4">
        <FileText className="w-5 h-5 text-cyan-400" />
        <h4 className="text-base font-bold text-white tracking-wide">
          Executive Summary
        </h4>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 mb-4 leading-relaxed text-sm text-slate-200">
        {intelligence?.executiveSummary ||
          'Analysis completed. Telemetry reflects active VirusTotal vendor engines.'}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            Vendor Consensus
          </span>
          <span className="text-slate-200 font-medium">
            {scanResult?.stats?.malicious > 0
              ? `${scanResult.stats.malicious} of ${scanResult.stats.total} vendors flagged malicious`
              : 'Zero vendor malicious detections'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            Reputation Score
          </span>
          <span className="text-slate-200 font-medium">
            {scanResult?.reputation !== undefined
              ? `${scanResult.reputation} (${scanResult.reputation < 0 ? 'Negative' : 'Clean'})`
              : 'Not available'}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
