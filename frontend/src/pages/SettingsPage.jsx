import React from 'react';
import { Settings, Moon, Sun, PlayCircle, Trash2, ShieldCheck, Eye } from 'lucide-react';
import GlassCard from '../components/common/GlassCard.jsx';

export default function SettingsPage({
  isDarkMode,
  onToggleTheme,
  reducedMotion,
  onToggleReducedMotion,
  onClearHistory,
  historyCount = 0,
}) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <div className="pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-extrabold text-white tracking-wide">
            Console Settings
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Configure LinkShield SOC console preferences and data retention
        </p>
      </div>

      <div className="space-y-4">
        {/* Appearance Setting */}
        <GlassCard className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Appearance & Theme</h4>
              <p className="text-xs text-slate-400 font-mono">
                {isDarkMode ? 'Cyber Dark SOC Theme (Default)' : 'High-Contrast Cyber Theme'}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleTheme}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono transition-all"
          >
            Switch to {isDarkMode ? 'High-Contrast' : 'Dark SOC'}
          </button>
        </GlassCard>

        {/* Animation Preference */}
        <GlassCard className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Animation & Motion</h4>
              <p className="text-xs text-slate-400 font-mono">
                {reducedMotion ? 'Reduced motion enabled' : 'Full cyber animations & radar sweep'}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleReducedMotion}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              reducedMotion
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {reducedMotion ? 'Enable Full Motion' : 'Reduce Motion'}
          </button>
        </GlassCard>

        {/* Scan History Retention */}
        <GlassCard className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Local Scan Cache</h4>
              <p className="text-xs text-slate-400 font-mono">
                Currently storing {historyCount} URL verification records locally
              </p>
            </div>
          </div>

          <button
            onClick={onClearHistory}
            disabled={historyCount === 0}
            className="px-3.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-mono transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear All History
          </button>
        </GlassCard>

        {/* Security Notice */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-mono text-slate-400 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-300 font-semibold block mb-0.5">
              API Security Isolation
            </span>
            <span>
              The VirusTotal API key is securely isolated on the backend server and is never exposed to the client interface or web storage.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
