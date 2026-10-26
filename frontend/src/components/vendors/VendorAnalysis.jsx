import React, { useState, useMemo } from 'react';
import { Search, ShieldAlert, ShieldCheck, Filter, Layers } from 'lucide-react';
import GlassCard from '../common/GlassCard.jsx';
import VendorCard from './VendorCard.jsx';

export default function VendorAnalysis({ vendors = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'malicious' | 'suspicious' | 'harmless' | 'undetected'

  // Counts by category
  const counts = useMemo(() => {
    const c = { all: vendors.length, malicious: 0, suspicious: 0, harmless: 0, undetected: 0 };
    vendors.forEach((v) => {
      if (c[v.category] !== undefined) c[v.category]++;
      else c.undetected++;
    });
    return c;
  }, [vendors]);

  // Filtered list
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      // Filter tab
      if (activeFilter !== 'all' && v.category !== activeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          v.name.toLowerCase().includes(query) ||
          (v.result && v.result.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [vendors, activeFilter, searchQuery]);

  const tabs = [
    { id: 'all', label: 'All Vendors', count: counts.all, color: 'text-slate-300' },
    { id: 'malicious', label: 'Malicious', count: counts.malicious, color: 'text-rose-400' },
    { id: 'suspicious', label: 'Suspicious', count: counts.suspicious, color: 'text-amber-400' },
    { id: 'harmless', label: 'Harmless', count: counts.harmless, color: 'text-emerald-400' },
    { id: 'undetected', label: 'Undetected', count: counts.undetected, color: 'text-slate-400' },
  ];

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cyan-500/20 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h4 className="text-base font-bold text-white tracking-wide">
              Security Vendor Analysis
            </h4>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time telemetry across {vendors.length} antivirus and threat intelligence engines
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor (e.g. Google)..."
            className="w-full bg-[#050b18] border border-cyan-500/30 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-950/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 ${tab.color}`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-mono text-slate-400">
          No security vendors match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[520px] overflow-y-auto pr-1">
          {filteredVendors.map((vendor, idx) => (
            <VendorCard key={vendor.name + idx} vendor={vendor} />
          ))}
        </div>
      )}
    </GlassCard>
  );
}
