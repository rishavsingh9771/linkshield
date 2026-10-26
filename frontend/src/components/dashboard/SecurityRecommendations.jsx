import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Key,
  Ban,
  DownloadCloud,
  RefreshCw,
  Box,
  Flag,
  Shield,
  Cpu,
} from 'lucide-react';
import GlassCard from '../common/GlassCard.jsx';

export default function SecurityRecommendations({ recommendations = [], verdict = 'SAFE' }) {
  const getIcon = (iconName, urgency) => {
    const isCritical = urgency === 'critical';
    const isHigh = urgency === 'high';
    const colorClass = isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-emerald-400';

    switch (iconName) {
      case 'ban':
        return <Ban className={`w-4 h-4 ${colorClass}`} />;
      case 'key':
        return <Key className={`w-4 h-4 ${colorClass}`} />;
      case 'box':
        return <Box className={`w-4 h-4 ${colorClass}`} />;
      case 'flag':
        return <Flag className={`w-4 h-4 ${colorClass}`} />;
      case 'lock':
        return <Lock className={`w-4 h-4 ${colorClass}`} />;
      case 'lock-open':
        return <Unlock className={`w-4 h-4 ${colorClass}`} />;
      case 'download-cloud':
        return <DownloadCloud className={`w-4 h-4 ${colorClass}`} />;
      case 'refresh-cw':
        return <RefreshCw className={`w-4 h-4 ${colorClass}`} />;
      case 'cpu':
        return <Cpu className={`w-4 h-4 ${colorClass}`} />;
      case 'shield-check':
      case 'shield':
      default:
        return <ShieldCheck className={`w-4 h-4 ${colorClass}`} />;
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-bold text-white tracking-wide">
            Security Recommendations
          </h4>
        </div>
        <span className="text-xs font-mono text-cyan-400/80 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
          Target Posture: {verdict}
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const isCritical = rec.urgency === 'critical';
          const isHigh = rec.urgency === 'high';

          return (
            <div
              key={index}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
                isCritical
                  ? 'bg-rose-950/30 border-rose-500/30 hover:border-rose-500/50'
                  : isHigh
                  ? 'bg-amber-950/25 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/30'
              }`}
            >
              <div className="mt-0.5 p-2 rounded-lg bg-[#050b18] border border-slate-800 shrink-0">
                {getIcon(rec.icon, rec.urgency)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-100">
                    {rec.title}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {rec.urgency}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {rec.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
