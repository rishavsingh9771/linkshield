import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ progress }) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {/* Header with percentage */}
      <div className="flex justify-between items-center text-xs font-mono mb-2">
        <span className="text-cyan-300 font-semibold tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          SCANNER STATUS
        </span>
        <span className="text-cyan-400 font-bold">{safeProgress}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-slate-900/90 rounded-full border border-cyan-500/30 overflow-hidden p-0.5 relative shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 relative shadow-lg shadow-cyan-400/50"
        >
          {/* Animated glow shimmer */}
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
