import React from 'react';
import {
  Cpu,
  ShieldAlert,
  AlertOctagon,
  Crosshair,
  Building,
  User,
  Zap,
  CheckCircle,
} from 'lucide-react';
import GlassCard from '../common/GlassCard.jsx';

export default function SecurityIntelligence({ intelligence }) {
  if (!intelligence) return null;

  const {
    threatAssessment,
    riskExplanation,
    attackScenarios = [],
    businessImpact,
    userImpact,
    recommendedAction,
    confidenceLevel,
    confidenceScore,
  } = intelligence;

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-500/20 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white tracking-wide">
              Security Intelligence
            </h4>
            <p className="text-[11px] font-mono text-slate-400">
              Rule-based deterministic threat modeling derived from VirusTotal telemetry
            </p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono">
          <span className="text-slate-400">Confidence:</span>
          <span className="text-cyan-300 font-bold">{confidenceLevel} ({confidenceScore}%)</span>
        </div>
      </div>

      {/* Grid of Intelligence Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Threat Assessment */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase mb-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Threat Assessment</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {threatAssessment || 'Standard baseline risk assessment active.'}
          </p>
        </div>

        {/* Risk Explanation */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase mb-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>Risk Explanation</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {riskExplanation || 'Evaluated against vendor blacklists.'}
          </p>
        </div>

        {/* Business Impact */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase mb-2">
            <Building className="w-4 h-4 text-blue-400" />
            <span>Enterprise & Business Impact</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {businessImpact || 'Negligible business perimeter impact.'}
          </p>
        </div>

        {/* User Impact */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase mb-2">
            <User className="w-4 h-4 text-emerald-400" />
            <span>End-User Impact</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {userImpact || 'Standard browsing precautions apply.'}
          </p>
        </div>
      </div>

      {/* Possible Attack Scenarios */}
      {attackScenarios.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase mb-3">
            <Crosshair className="w-4 h-4 text-rose-400" />
            <span>Possible Attack Scenarios & Vectors</span>
          </div>
          <div className="space-y-2">
            {attackScenarios.map((sc, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#050b18] border border-slate-800/80">
                <div className="text-xs font-semibold text-rose-300 mb-0.5">
                  ● {sc.vector}
                </div>
                <div className="text-xs text-slate-300 font-sans leading-relaxed pl-3.5">
                  {sc.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      {recommendedAction && (
        <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/25 border border-cyan-500/30 flex items-start gap-3">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-mono font-bold uppercase text-cyan-300 block mb-0.5">
              PRIMARY SOC DIRECTIVE:
            </span>
            <span className="text-slate-200 font-medium">
              {recommendedAction}
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
