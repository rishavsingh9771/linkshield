import React, { useState } from 'react';
import {
  Globe,
  Server,
  Lock,
  Unlock,
  Layers,
  Tag,
  ArrowRight,
  FileCode,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import GlassCard from '../common/GlassCard.jsx';
import { formatDate } from '../../utils/formatters.js';
import { copyToClipboard } from '../../utils/clipboard.js';

export default function URLDetails({ scanResult, onToast }) {
  const [showWhois, setShowWhois] = useState(false);

  const handleCopy = async (text, label) => {
    const ok = await copyToClipboard(text);
    if (ok && onToast) {
      onToast({ message: `${label} copied to clipboard`, type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5 pb-2 border-b border-cyan-500/20">
        <Server className="w-5 h-5 text-cyan-400" />
        <h4 className="text-base font-bold text-white tracking-wide">
          Complete URL & Infrastructure Details
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Network & Protocol */}
        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3 font-semibold uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>Network & Protocol</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Domain</span>
              <div className="flex items-center justify-between gap-1 text-slate-100 font-semibold mt-0.5">
                <span className="truncate">{scanResult.domain}</span>
                <button
                  onClick={() => handleCopy(scanResult.domain, 'Domain')}
                  className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
                  title="Copy Domain"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Protocol / SSL</span>
              <span className={`inline-flex items-center gap-1 mt-0.5 font-semibold ${scanResult.isHttps ? 'text-emerald-400' : 'text-amber-400'}`}>
                {scanResult.isHttps ? (
                  <>
                    <Lock className="w-3 h-3" /> HTTPS (TLS Encrypted)
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3" /> HTTP (Unencrypted / Insecure)
                  </>
                )}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Final Resolved Destination</span>
              <span className="text-slate-300 break-all text-[11px] block mt-0.5">
                {scanResult.finalUrl || scanResult.url}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Card 2: HTTP Response Telemetry */}
        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3 font-semibold uppercase">
            <Globe className="w-3.5 h-3.5" />
            <span>HTTP Response Telemetry</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">HTTP Status Code</span>
              <span className="text-cyan-300 font-bold mt-0.5 block">
                {scanResult.httpDetails?.responseCode || 'Not available'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Content Type</span>
              <span className="text-slate-300 truncate block mt-0.5">
                {scanResult.httpDetails?.contentType || 'Not provided by VirusTotal'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Page Title</span>
              <span className="text-slate-300 text-[11px] truncate block mt-0.5">
                {scanResult.httpDetails?.title || 'Not provided by VirusTotal'}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Card 3: Reputation & Analysis Dates */}
        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3 font-semibold uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>Threat Telemetry</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Community Votes</span>
              <div className="flex items-center gap-3 mt-0.5 text-xs">
                <span className="text-emerald-400 font-semibold">
                  👍 {scanResult.communityVotes?.harmless ?? 0} Harmless
                </span>
                <span className="text-rose-400 font-semibold">
                  👎 {scanResult.communityVotes?.malicious ?? 0} Malicious
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Domain Reputation</span>
              <span className="text-slate-200 font-bold block mt-0.5">
                {scanResult.reputation !== undefined ? scanResult.reputation : 'Not available'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Last VirusTotal Analysis</span>
              <span className="text-slate-300 text-[11px] block mt-0.5">
                {formatDate(scanResult.lastAnalysisDate)}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Redirection Chain (if any) */}
      {scanResult.redirectionChain && scanResult.redirectionChain.length > 0 && (
        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2 font-semibold uppercase">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Redirection Chain ({scanResult.redirectionChain.length} Hops)</span>
          </div>
          <div className="space-y-1.5 font-mono text-xs text-slate-300">
            {scanResult.redirectionChain.map((hop, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-cyan-400 text-[10px] font-bold">[{idx + 1}]</span>
                <span className="truncate break-all">{hop}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Categories & Tags */}
      {((scanResult.categories && scanResult.categories.length > 0) || (scanResult.tags && scanResult.tags.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scanResult.categories && scanResult.categories.length > 0 && (
            <GlassCard className="p-4" hoverEffect={false}>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2 font-semibold uppercase">
                <Tag className="w-3.5 h-3.5" />
                <span>Security Categories</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {scanResult.categories.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300"
                  >
                    <span className="text-slate-500">{c.source}: </span>
                    {c.category}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {scanResult.tags && scanResult.tags.length > 0 && (
            <GlassCard className="p-4" hoverEffect={false}>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2 font-semibold uppercase">
                <Tag className="w-3.5 h-3.5" />
                <span>Domain Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {scanResult.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* WHOIS Summary Toggle */}
      {scanResult.whois && scanResult.whois !== 'Not provided by VirusTotal' && (
        <GlassCard className="p-4" hoverEffect={false}>
          <button
            type="button"
            onClick={() => setShowWhois(!showWhois)}
            className="w-full flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold uppercase"
          >
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5" />
              <span>WHOIS Registration Record</span>
            </div>
            {showWhois ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showWhois && (
            <div className="mt-3 p-3 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {scanResult.whois}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
