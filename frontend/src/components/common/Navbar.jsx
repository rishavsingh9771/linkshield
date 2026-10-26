import React, { useState, useEffect } from 'react';
import { Shield, Radio, Sun, Moon, Menu, Terminal, Activity } from 'lucide-react';

export default function Navbar({ onToggleSidebar, activeTab, isDarkMode, onToggleTheme }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#050b18]/80 border-b border-cyan-500/20 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile menu toggle & page breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-800/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="lg:hidden flex items-center gap-2 mr-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-extrabold text-base tracking-wider text-white">LINKSHIELD</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/50">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>SOC CONSOLE</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-300 uppercase">{activeTab}</span>
          </div>
        </div>
      </div>

      {/* Right Controls: SOC Status, Clock, Cyber Mode & Theme */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* System Time */}
        <div className="hidden md:flex items-center gap-1.5 font-mono text-xs text-slate-300 bg-slate-900/60 px-3 py-1 rounded border border-slate-800">
          <span className="text-slate-500">UTC/LOC:</span>
          <span className="text-cyan-400 font-semibold">{time}</span>
        </div>

        {/* Green Active Status Indicator */}
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-mono text-emerald-300 shadow-sm shadow-emerald-950/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide">ACTIVE</span>
        </div>

        {/* Cyber Security Mode Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cyber Security Mode</span>
        </div>

        {/* Theme / Appearance Toggle */}
        <button
          onClick={onToggleTheme}
          title="Toggle Cyber Theme"
          className="p-1.5 rounded-lg bg-slate-800/70 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-cyan-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
