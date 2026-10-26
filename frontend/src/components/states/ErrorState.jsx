import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Key, ShieldAlert } from 'lucide-react';
import GlassCard from '../common/GlassCard.jsx';

export default function ErrorState({ error, onRetry }) {
  const isKeyError = error && error.includes('VirusTotal API key not configured');

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <GlassCard className="p-8 border-rose-500/30 shadow-rose-950/40" hoverEffect={false}>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center mb-4 text-rose-400">
            {isKeyError ? <Key className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {isKeyError ? 'Configuration Notice' : 'Security Scan Interrupted'}
          </h3>

          <p className="text-sm font-mono text-rose-300 max-w-md mb-6 leading-relaxed">
            {error || 'Unable to complete the security analysis.'}
          </p>

          {isKeyError && (
            <div className="w-full text-left p-4 rounded-xl bg-black/50 border border-slate-800 text-xs font-mono text-slate-300 mb-6">
              <span className="text-cyan-400 font-bold block mb-1">
                How to configure your API key:
              </span>
              <p className="text-slate-400 mb-2">
                1. Open <code className="text-cyan-300">backend/.env</code> in your editor.
              </p>
              <p className="text-slate-400 mb-2">
                2. Set <code className="text-cyan-300">VIRUSTOTAL_API_KEY=your_actual_key</code>.
              </p>
              <p className="text-slate-400">
                3. Save and re-run your scan.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-950/40 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Scan</span>
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
