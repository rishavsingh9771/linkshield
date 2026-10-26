import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import GlassCard from '../common/GlassCard.jsx';

export default function SecurityCharts({ stats }) {
  if (!stats) return null;

  // Data for Pie Chart (Distribution)
  const pieData = [
    { name: 'Harmless', value: stats.harmless || 0, color: '#10b981' },
    { name: 'Malicious', value: stats.malicious || 0, color: '#ef4444' },
    { name: 'Suspicious', value: stats.suspicious || 0, color: '#f59e0b' },
    { name: 'Undetected', value: stats.undetected || 0, color: '#64748b' },
    { name: 'Timeout', value: stats.timeout || 0, color: '#334155' },
  ].filter((item) => item.value > 0);

  // Data for Bar Chart (Category comparison)
  const barData = [
    { category: 'Clean / Safe', count: stats.harmless || 0, fill: '#10b981' },
    { category: 'Suspicious', count: stats.suspicious || 0, fill: '#f59e0b' },
    { category: 'Malicious', count: stats.malicious || 0, fill: '#ef4444' },
    { category: 'Undetected', count: stats.undetected || 0, fill: '#64748b' },
  ];

  // Custom Dark Cyber Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="p-2.5 rounded-lg bg-[#050b18] border border-cyan-500/40 shadow-xl text-xs font-mono">
          <div className="text-slate-400 mb-1">{data.name || data.payload?.category}</div>
          <div className="text-white font-bold flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.payload?.color || data.payload?.fill || '#00f5d4' }}
            />
            <span>{data.value} Vendors</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Pie Chart: Vendor Distribution */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-cyan-500/20 mb-4">
          <PieIcon className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-bold text-white tracking-wide">
            Vendor Verdict Distribution
          </h4>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                isAnimationActive={true}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#070f22" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs font-mono text-slate-300">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Bar Chart: Vendor Detection Comparison */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-cyan-500/20 mb-4">
          <BarChart2 className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-bold text-white tracking-wide">
            Vendor Detection Comparison
          </h4>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="category"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive={true}>
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
