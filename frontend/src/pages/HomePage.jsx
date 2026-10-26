import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import URLScanner from '../components/scanner/URLScanner.jsx';
import RadarScanner from '../components/scanner/RadarScanner.jsx';
import ProgressBar from '../components/scanner/ProgressBar.jsx';
import TerminalLogs from '../components/scanner/TerminalLogs.jsx';
import VerdictCard from '../components/dashboard/VerdictCard.jsx';
import ThreatGauge from '../components/dashboard/ThreatGauge.jsx';
import ThreatIndicators from '../components/dashboard/ThreatIndicators.jsx';
import SecuritySummary from '../components/dashboard/SecuritySummary.jsx';
import SecurityIntelligence from '../components/dashboard/SecurityIntelligence.jsx';
import SecurityRecommendations from '../components/dashboard/SecurityRecommendations.jsx';
import URLDetails from '../components/dashboard/URLDetails.jsx';
import VendorAnalysis from '../components/vendors/VendorAnalysis.jsx';
import SecurityCharts from '../components/charts/SecurityCharts.jsx';
import PDFButton from '../components/reports/PDFButton.jsx';
import EmptyState from '../components/states/EmptyState.jsx';
import ErrorState from '../components/states/ErrorState.jsx';
import GlassCard from '../components/common/GlassCard.jsx';

export default function HomePage({
  scanStatus,
  progress,
  currentLog,
  logs,
  scanResult,
  error,
  activeUrl,
  onScan,
  onRetry,
  onToast,
}) {
  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero / Scanner Input Bar */}
      <section className="pt-2">
        <URLScanner onScan={onScan} isScanning={scanStatus === 'scanning'} />
      </section>

      {/* 2. Cyber Scanning Radar & Terminal Section */}
      <AnimatePresence>
        {scanStatus === 'scanning' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <RadarScanner progress={progress} targetUrl={activeUrl} />

            <div className="max-w-xl mx-auto px-4">
              <ProgressBar progress={progress} />
            </div>

            <TerminalLogs logs={logs} currentLog={currentLog} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* 3. Error State */}
      {scanStatus === 'error' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ErrorState error={error} onRetry={onRetry} />
        </motion.div>
      )}

      {/* 4. Empty State before first scan */}
      {scanStatus === 'idle' && !scanResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState />
        </motion.div>
      )}

      {/* 5. Result Dashboard (3-Zone SOC Layout) */}
      {scanStatus === 'complete' && scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Top Actions: Verdict Header & Export Button */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex-1">
              <VerdictCard scanResult={scanResult} onToast={onToast} />
            </div>
            <div className="flex flex-col justify-center items-end shrink-0">
              <PDFButton scanResult={scanResult} onToast={onToast} />
            </div>
          </div>

          {/* 3-Zone Core Section: Threat Score, Indicators, Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Zone: Threat Score & Executive Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Circular Threat Gauge Card */}
              <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
                  SOC RISK ASSESSMENT
                </span>
                <ThreatGauge
                  score={scanResult.threatScore}
                  riskLevel={scanResult.riskLevel}
                />
              </GlassCard>

              {/* Executive Summary */}
              <SecuritySummary
                intelligence={scanResult.intelligence}
                scanResult={scanResult}
              />
            </div>

            {/* Right Zone: Threat Indicators & Security Recommendations (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Threat Indicators */}
              <ThreatIndicators indicators={scanResult.indicators} />

              {/* Recommendations */}
              <SecurityRecommendations
                recommendations={scanResult.recommendations}
                verdict={scanResult.verdict}
              />
            </div>
          </div>

          {/* Security Intelligence Engine Details */}
          <SecurityIntelligence intelligence={scanResult.intelligence} />

          {/* Visual Analytics: Recharts Pie and Bar charts */}
          <SecurityCharts stats={scanResult.stats} />

          {/* Complete URL & Infrastructure Details */}
          <URLDetails scanResult={scanResult} onToast={onToast} />

          {/* Security Vendor Analysis (All Engines, Live Search, Category Filters) */}
          <VendorAnalysis vendors={scanResult.vendors} />
        </motion.div>
      )}
    </div>
  );
}
