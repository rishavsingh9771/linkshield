import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Search, X, Clipboard, ShieldCheck } from 'lucide-react';

export default function URLScanner({ onScan, isScanning }) {
  const [url, setUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const exampleLinks = [
    'https://google.com',
    'https://bit.ly/example',
    'https://example.com',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!url || !url.trim()) {
      setErrorMsg('Please enter a valid HTTP or HTTPS URL.');
      return;
    }

    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setErrorMsg('Please enter a valid HTTP or HTTPS URL.');
      return;
    }

    onScan(trimmed);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) setUrl(text.trim());
      }
    } catch (err) {
      // Ignore
    }
  };

  const handleSelectExample = (example) => {
    setUrl(example);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-4">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>GLOBAL THREAT INTELLIGENCE VERIFICATION</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
          Scan a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Link</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Enter a URL to check if it's safe, suspicious or dangerous. Powered by VirusTotal v3 security vendors.
        </p>
      </div>

      {/* Glassmorphism URL Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-3 p-2 rounded-2xl backdrop-blur-2xl bg-[#091124]/80 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 hover:border-cyan-400/50 transition-all duration-300">
          
          {/* Input container */}
          <div className="relative flex-1 flex items-center min-w-0">
            <div className="pl-4 pr-3 text-cyan-400 shrink-0">
              <LinkIcon className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="https://example.com"
              disabled={isScanning}
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base font-mono py-3.5 focus:outline-none disabled:opacity-50"
            />

            {/* Paste Button */}
            {!url && (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="mr-2 p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors text-xs flex items-center gap-1 shrink-0 font-mono"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Paste</span>
              </button>
            )}

            {/* Clear Button */}
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="mr-3 text-slate-400 hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cyan/Blue Gradient Scan Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isScanning}
            className="relative px-7 py-3.5 rounded-xl font-bold text-slate-950 text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shrink-0 bg-gradient-to-r from-[#00f5d4] via-[#00d2ff] to-[#3a86ff] shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 disabled:opacity-50 cursor-pointer overflow-hidden group"
          >
            <Search className="w-4 h-4 transition-transform group-hover:scale-110 stroke-[2.5]" />
            <span>{isScanning ? 'Scanning...' : 'Scan'}</span>
            
            {/* Shimmer line */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.button>
        </div>

        {/* Validation Error Banner */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs font-mono text-rose-400 pl-4"
          >
            ● {errorMsg}
          </motion.div>
        )}
      </form>

      {/* Example links */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
        <span className="text-slate-500 font-semibold">Try:</span>
        {exampleLinks.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => handleSelectExample(ex)}
            className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-cyan-400/90 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-950/30 transition-all cursor-pointer"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
