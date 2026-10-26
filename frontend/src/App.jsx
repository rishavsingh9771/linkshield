import React, { useState, useEffect } from 'react';
import CyberBackground from './components/common/CyberBackground.jsx';
import Navbar from './components/common/Navbar.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import Toast from './components/common/Toast.jsx';

import HomePage from './pages/HomePage.jsx';
import ScanHistoryPage from './pages/ScanHistoryPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

import { useScan } from './hooks/useScan.js';
import { useScanHistory } from './hooks/useScanHistory.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState('');
  const [toast, setToast] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { history, addScan, removeScan, clearHistory } = useScanHistory();

  const handleScanSuccess = (data) => {
    addScan(data);
    showToast({ message: `Scan complete: ${data.verdict} verdict assigned`, type: 'success' });
  };

  const {
    status: scanStatus,
    progress,
    currentLog,
    logs,
    scanResult,
    error: scanError,
    startScan,
    resetScan,
    setManualResult,
  } = useScan(handleScanSuccess);

  const showToast = ({ message, type = 'info', duration = 3500 }) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const handleStartScan = (url) => {
    setActiveUrl(url);
    startScan(url);
  };

  const handleRetryScan = () => {
    if (activeUrl) {
      startScan(activeUrl, true);
    } else {
      resetScan();
    }
  };

  const handleSelectHistoricalScan = (historicalData) => {
    setManualResult(historicalData);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast({ message: `Loaded scan for ${historicalData.domain}`, type: 'info' });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#030712]' : 'bg-[#060d1f]'} text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-300`}>
      {/* 1. Animated Cyber Grid & Nodes Background */}
      <CyberBackground />

      {/* 2. Application Layout Shell */}
      <div className="relative z-10 flex min-h-screen">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Sticky Top Navbar */}
          <Navbar
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            activeTab={activeTab}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode((prev) => !prev)}
          />

          {/* Page Views Container */}
          <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
            {activeTab === 'home' && (
              <HomePage
                scanStatus={scanStatus}
                progress={progress}
                currentLog={currentLog}
                logs={logs}
                scanResult={scanResult}
                error={scanError}
                activeUrl={activeUrl}
                onScan={handleStartScan}
                onRetry={handleRetryScan}
                onToast={showToast}
              />
            )}

            {activeTab === 'history' && (
              <ScanHistoryPage
                history={history}
                onSelectScan={handleSelectHistoricalScan}
                onClearHistory={clearHistory}
                onRemoveScan={removeScan}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsPage
                history={history}
                onSelectScan={handleSelectHistoricalScan}
                onToast={showToast}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode((prev) => !prev)}
                reducedMotion={reducedMotion}
                onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
                onClearHistory={clearHistory}
                historyCount={history.length}
              />
            )}

            {activeTab === 'about' && <AboutPage />}
          </main>
        </div>
      </div>

      {/* 3. Global Floating Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
