import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Link as LinkIcon, Radio } from 'lucide-react';

export default function RadarScanner({ progress, targetUrl }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Radar Container */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        
        {/* Outer Glow Circle */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-2xl animate-pulse-glow" />

        {/* Outer Ring with tick marks */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 shadow-neon-cyan" />
        
        {/* Ring 2 with dotted border */}
        <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400/30" />
        
        {/* Ring 3 */}
        <div className="absolute inset-12 rounded-full border border-cyan-500/20" />

        {/* Ring 4 (Inner) */}
        <div className="absolute inset-20 rounded-full border border-cyan-500/40" />

        {/* Rotating Outer Dashes Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-400/70 border-r-cyan-400/40 pointer-events-none"
        />

        {/* Counter-rotating Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-10 rounded-full border-b-2 border-l-2 border-transparent border-b-blue-400/60 border-l-blue-400/30 pointer-events-none"
        />

        {/* Radar Sweep Beam (Conic Gradient) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full radar-gradient pointer-events-none"
        />

        {/* Crosshair lines */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-cyan-500/25 pointer-events-none" />
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-cyan-500/25 pointer-events-none" />

        {/* Center Shield + Link Badge */}
        <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-slate-900 via-[#060f24] to-[#040918] border-2 border-cyan-400/60 shadow-2xl shadow-cyan-950 flex flex-col items-center justify-center group">
          {/* Animated pulse ring around center */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl border border-cyan-400 pointer-events-none"
          />

          <div className="relative flex items-center justify-center">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,245,212,0.8)]" />
            <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 absolute -bottom-1 -right-1" />
          </div>

          {/* Percentage Counter in Badge */}
          <div className="mt-1 text-[11px] font-mono font-bold text-cyan-300">
            {progress}%
          </div>
        </div>
      </div>

      {/* Target Scanning URL label */}
      {targetUrl && (
        <div className="mt-6 px-4 py-2 rounded-lg bg-slate-900/80 border border-cyan-500/20 max-w-md text-center">
          <span className="text-xs font-mono text-slate-400">INSPECTING: </span>
          <span className="text-xs font-mono font-semibold text-cyan-300 break-all">{targetUrl}</span>
        </div>
      )}
    </div>
  );
}
