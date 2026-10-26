import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Clock,
  Globe,
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard.jsx';
import { getVerdictConfig, formatDate, truncateUrl } from '../utils/formatters.js';

export default function ScanHistoryPage({ history = [], onSelectScan, onClearHistory, onRemoveScan }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL');

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Verdict filter
      if (verdictFilter !== 'ALL' && item.verdict !== verdictFilter) {
        return false;
      }
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          item.url.toLowerCase().includes(query) ||
          (item.domain && item.domain.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [history, searchTerm, verdictFilter]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2.5">
            <History className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-wide">
              Scan History
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Audit log of previously verified URLs and threat telemetry
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-900/50 text-xs font-mono transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history by URL or domain..."
            className="w-full bg-[#050b18] border border-cyan-500/30 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Verdict Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {['ALL', 'SAFE', 'SUSPICIOUS', 'MALICIOUS'].map((v) => (
            <button
              key={v}
              onClick={() => setVerdictFilter(v)}
              className={`px-3 py-1 rounded-lg transition-all ${
                verdictFilter === v
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <GlassCard className="p-12 text-center" hoverEffect={false}>
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {history.length === 0 ? 'No Scan History Yet' : 'No Results Matching Filter'}
          </h3>
          <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
            {history.length === 0
              ? 'Scans you perform will be saved here automatically for quick reference and report exports.'
              : 'Try searching with a different domain or reset the verdict filter.'}
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const verdictConfig = getVerdictConfig(item.verdict);
            return (
              <GlassCard
                key={item.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Domain & URL */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`mt-1 p-2 rounded-xl border shrink-0 ${verdictConfig.bg} ${verdictConfig.border}`}
                  >
                    {item.verdict === 'MALICIOUS' ? (
                      <ShieldAlert className="w-5 h-5 text-rose-500" />
                    ) : item.verdict === 'SUSPICIOUS' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-white">
                        {item.domain || 'Unknown Domain'}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${verdictConfig.badge}`}
                      >
                        {item.verdict}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Score: <strong className="text-cyan-300">{item.threatScore}/100</strong>
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-400 truncate max-w-xl">
                      {item.url}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(item.scanDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => onSelectScan(item.fullData || item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-white text-xs font-mono transition-all cursor-pointer font-semibold"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveScan(item.id)}
                    title="Remove item"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
