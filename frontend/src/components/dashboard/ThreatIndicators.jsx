import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  Unlock,
  Link2,
  Shuffle,
  ThumbsDown,
  ThumbsUp,
  ShieldCheck,
  Flag,
} from 'lucide-react';
import GlassCard from '../common/GlassCard.jsx';

export default function ThreatIndicators({ indicators = [] }) {
  const renderIcon = (iconName, severity) => {
    const iconClass =
      severity === 'critical'
        ? 'text-rose-400'
        : severity === 'high'
        ? 'text-orange-400'
        : severity === 'medium'
        ? 'text-amber-400'
        : 'text-emerald-400';

    switch (iconName) {
      case 'shield-alert':
        return <ShieldAlert className={`w-5 h-5 ${iconClass}`} />;
      case 'alert-triangle':
        return <AlertTriangle className={`w-5 h-5 ${iconClass}`} />;
      case 'lock':
        return <Lock className={`w-5 h-5 ${iconClass}`} />;
      case 'lock-open':
        return <Unlock className={`w-5 h-5 ${iconClass}`} />;
      case 'link-2':
        return <Link2 className={`w-5 h-5 ${iconClass}`} />;
      case 'shuffle':
        return <Shuffle className={`w-5 h-5 ${iconClass}`} />;
      case 'thumbs-down':
        return <ThumbsDown className={`w-5 h-5 ${iconClass}`} />;
      case 'thumbs-up':
        return <ThumbsUp className={`w-5 h-5 ${iconClass}`} />;
      case 'shield-check':
      default:
        return <ShieldCheck className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'safe':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-4">
        <div className="flex items-center gap-2.5">
          <Flag className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-bold text-white tracking-wide">
            Threat Indicators
          </h4>
        </div>
        <span className="text-xs font-mono text-cyan-400/80 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
          {indicators.length} Signals Analyzed
        </span>
      </div>

      <div className="space-y-3">
        {indicators.length === 0 ? (
          <div className="text-xs text-slate-400 py-3 text-center font-mono">
            No anomalous threat signals detected for this link.
          </div>
        ) : (
          indicators.map((ind, index) => (
            <div
              key={index}
              className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
            >
              <div className="mt-0.5 p-2 rounded-lg bg-[#050b18] border border-slate-800 shrink-0">
                {renderIcon(ind.icon, ind.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-100">
                    {ind.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold shrink-0 ${getSeverityBadge(
                      ind.severity
                    )}`}
                  >
                    {ind.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {ind.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
