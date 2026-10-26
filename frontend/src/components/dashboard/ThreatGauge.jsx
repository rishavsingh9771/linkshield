import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getRiskLevelConfig } from '../../utils/formatters.js';

export default function ThreatGauge({ score = 0, riskLevel = 'Excellent' }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animated counter from 0 to score
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(score / 35));
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [score]);

  const riskConfig = getRiskLevelConfig(riskLevel);

  // SVG Gauge calculations
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc gauge or full 360 circle
  const progressOffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Gauge Container */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-20 pointer-events-none"
          style={{ backgroundColor: riskConfig.color }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#111c38"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score stroke */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={riskConfig.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progressOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 6px ${riskConfig.color})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span
              className="text-4xl font-extrabold font-mono tracking-tight"
              style={{ color: riskConfig.color }}
            >
              {displayScore}
            </span>
            <span className="text-xs font-mono text-slate-500 ml-1">/100</span>
          </div>

          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
            Threat Score
          </span>
        </div>
      </div>

      {/* Risk Tier Badge */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: riskConfig.color }}
        />
        <span
          className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
          style={{
            backgroundColor: `${riskConfig.color}18`,
            color: riskConfig.color,
            border: `1px solid ${riskConfig.color}40`,
          }}
        >
          {riskConfig.text}
        </span>
      </div>
    </div>
  );
}
