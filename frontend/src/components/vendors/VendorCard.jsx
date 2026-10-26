import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, MinusCircle, Clock } from 'lucide-react';

export default function VendorCard({ vendor }) {
  const { name, category, result, method } = vendor;

  const getStatusBadge = () => {
    switch (category) {
      case 'malicious':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
          label: 'MALICIOUS',
          style: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-500',
        };
      case 'suspicious':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'SUSPICIOUS',
          style: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-500',
        };
      case 'harmless':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'HARMLESS',
          style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-500',
        };
      case 'timeout':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
          label: 'TIMEOUT',
          style: 'bg-slate-800 text-slate-400 border-slate-700',
          dot: 'bg-slate-500',
        };
      case 'undetected':
      default:
        return {
          icon: <MinusCircle className="w-3.5 h-3.5 text-slate-400" />,
          label: 'UNDETECTED',
          style: 'bg-slate-800/60 text-slate-400 border-slate-700/60',
          dot: 'bg-slate-500',
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="p-3.5 rounded-xl bg-[#070e20]/80 border border-slate-800/90 hover:border-cyan-500/30 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
            {name}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border shrink-0 ${badge.style}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Verdict:</span>
          <span className="font-semibold text-slate-300 uppercase truncate max-w-[120px]">
            {result || 'clean'}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Method:</span>
        <span className="text-slate-400">{method || 'blacklist'}</span>
      </div>
    </div>
  );
}
