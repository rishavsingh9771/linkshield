import React, { useEffect, useRef } from 'react';
import { Terminal, Shield, Check } from 'lucide-react';

export default function TerminalLogs({ logs = [], currentLog = '' }) {
  const terminalBottomRef = useRef(null);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, currentLog]);

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl overflow-hidden backdrop-blur-xl bg-[#030713]/90 border border-cyan-500/30 shadow-2xl shadow-black/80 font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#081024] border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[11px] font-mono text-slate-400">
            linkshield-soc-engine ~ /vt-v3
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>LIVE TELEMETRY</span>
        </div>
      </div>

      {/* Terminal Logs Body */}
      <div className="p-4 space-y-2 max-h-52 overflow-y-auto font-mono text-[11px]">
        {logs.map((log, index) => {
          const isLatest = index === logs.length - 1;
          return (
            <div
              key={index}
              className={`flex items-start gap-2.5 transition-opacity ${
                isLatest ? 'text-cyan-300 font-semibold' : 'text-slate-400'
              }`}
            >
              <span className="text-slate-600 select-none">[{log.time}]</span>
              <span className="text-emerald-400 select-none">
                {isLatest ? '➜' : '✔'}
              </span>
              <span className="break-all">«{log.text}»</span>
            </div>
          );
        })}

        {/* Active Cursor line */}
        <div className="flex items-center gap-2 text-cyan-400 pt-1">
          <span className="text-slate-600 select-none">[{new Date().toLocaleTimeString()}]</span>
          <span className="text-cyan-400 font-bold select-none">➜</span>
          <span className="text-cyan-200">Processing real-time stream</span>
          <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1" />
        </div>

        <div ref={terminalBottomRef} />
      </div>
    </div>
  );
}
