import React from 'react';
import { FileText, Download, ShieldAlert, ShieldCheck, AlertTriangle, ArrowUpRight, Clock } from 'lucide-react';
import GlassCard from '../components/common/GlassCard.jsx';
import PDFButton from '../components/reports/PDFButton.jsx';
import { getVerdictConfig, formatDate } from '../utils/formatters.js';

export default function ReportsPage({ history = [], onSelectScan, onToast }) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-extrabold text-white tracking-wide">
            Generated Security Reports
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Export publication-ready enterprise PDF reports for SOC auditing, hackathons, and incident logs
        </p>
      </div>

      {history.length === 0 ? (
        <GlassCard className="p-12 text-center" hoverEffect={false}>
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            No Security Reports Generated Yet
          </h3>
          <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
            Scan a suspicious link to automatically compile threat reports with instant PDF export capability.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => {
            const verdictConfig = getVerdictConfig(item.verdict);
            const reportData = item.fullData || item;

            return (
              <GlassCard key={item.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${verdictConfig.badge}`}
                    >
                      {item.verdict}
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      Score: {item.threatScore}/100
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1 truncate">
                    {item.domain || 'Target Link'}
                  </h4>

                  <p className="text-xs font-mono text-slate-400 break-all mb-4">
                    {item.url}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-5">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.scanDate)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectScan(reportData)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    <span>View in SOC</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <PDFButton scanResult={reportData} onToast={onToast} />
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
