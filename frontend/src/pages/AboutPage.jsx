import React from 'react';
import { Shield, CheckCircle, Terminal, Layers, ExternalLink, Cpu } from 'lucide-react';
import GlassCard from '../components/common/GlassCard.jsx';

export default function AboutPage() {
  const techStack = [
    { name: 'React.js (v18)', role: 'Frontend Architecture & State Management' },
    { name: 'Vite', role: 'Next-Generation Frontend Tooling' },
    { name: 'Tailwind CSS', role: 'Futuristic Dark SOC Design System' },
    { name: 'Framer Motion', role: 'Cyber Radar Scanning & Micro-Interactions' },
    { name: 'Recharts', role: 'Telemetry Visual Analytics & Threat Charts' },
    { name: 'Node.js & Express.js', role: 'Secure Backend Gateway & Rate Limiting' },
    { name: 'VirusTotal API v3', role: 'Global Threat Intelligence & Vendor Consensus' },
    { name: 'PDFKit', role: 'Enterprise Publication-Ready SOC Report Generation' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <div className="pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-extrabold text-white tracking-wide">
            About LinkShield
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Scan Smart. Click Safe.
        </p>
      </div>

      {/* Mission & Purpose */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">
          Suspicious Link Verification Platform
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong>LinkShield</strong> is a specialized cybersecurity platform built for high-stakes demonstration, SOC exhibitions, and hackathons. It is engineered with a strict focus on a single core mission: <strong>analyzing and validating suspicious URLs</strong> to prevent credential theft, drive-by malware delivery, and phishing deception.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          By integrating directly with <strong>VirusTotal API v3</strong>, LinkShield aggregates consensus detections across dozens of commercial antivirus engines, security vendors, and threat intelligence feeds. The resulting telemetry is synthesized into a calculated 0–100 Threat Score, dynamic threat indicators, rule-based Security Intelligence, and exportable enterprise PDF reports.
        </p>
      </GlassCard>

      {/* Technology Stack */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-cyan-500/20 mb-4">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-bold text-white tracking-wide">
            Technology Stack & Architecture
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
            >
              <span className="text-xs font-mono font-bold text-cyan-300">
                {tech.name}
              </span>
              <span className="text-[11px] text-slate-400 font-sans mt-1">
                {tech.role}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Operational Principles */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-cyan-500/20 mb-4">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-bold text-white tracking-wide">
            Enterprise Security Standards
          </h4>
        </div>

        <ul className="space-y-2 text-xs font-mono text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strict Backend Isolation: VirusTotal API key is never exposed to the frontend.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strict Input Sanitization: Rejects javascript:, file:, data:, and malformed schemes.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero Data Fabrication: Telemetry and vendor counts reflect only empirical API data.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Resilient Fail-Safe Handling: Rate limits, unconfigured keys, and timeouts handled cleanly.</span>
          </li>
        </ul>
      </GlassCard>
    </div>
  );
}
