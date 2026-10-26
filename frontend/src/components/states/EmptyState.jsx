import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Cpu, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import GlassCard from '../common/GlassCard.jsx';

export default function EmptyState() {
  const steps = [
    {
      step: '01',
      title: 'Enter Target URL',
      desc: 'Input any link, shortened URL, or suspected destination into the scanner.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Securely Analyze',
      desc: 'LinkShield submits the link to VirusTotal v3 and queries global threat engines.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Review Threat Intelligence',
      desc: 'Examine detailed vendor consensus, threat score, indicators, and download SOC PDF report.',
      icon: Shield,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      {/* Center Shield Graphic */}
      <div className="text-center mb-12">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-slate-900 border border-cyan-400/30 shadow-2xl shadow-cyan-950/60 mb-5 relative"
        >
          <div className="absolute inset-0 rounded-3xl border border-cyan-400/20 animate-pulse" />
          <Shield className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_12px_rgba(0,245,212,0.6)]" />
        </motion.div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          Ready to Analyze
        </h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto mt-2 font-mono">
          Enter a suspicious URL above to begin a security scan.
        </p>
      </div>

      {/* How LinkShield Works Section */}
      <GlassCard className="p-8" hoverEffect={false}>
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 block font-semibold">
              ARCHITECTURE & WORKFLOW
            </span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              How LinkShield Works
            </h4>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero Data Leakage</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                    {item.step}
                  </span>
                  <Icon className="w-5 h-5 text-slate-400" />
                </div>
                <h5 className="text-sm font-bold text-slate-100 mb-1.5">
                  {item.title}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
