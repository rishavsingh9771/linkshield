import React from 'react';
import {
  Shield,
  Search,
  History,
  FileText,
  Settings,
  Info,
  X,
  Radio,
  Lock,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Search },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About', icon: Info },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5">
      {/* Top Section: Brand & Navigation */}
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-slate-900 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-950/50">
              <Shield className="w-6 h-6 text-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#050b18]" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1.5">
                LINK<span className="text-cyan-400">SHIELD</span>
              </h1>
              <p className="text-[11px] font-mono text-cyan-300/80 tracking-tight">
                Scan Smart. Click Safe.
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-semibold">
            Operations Console
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-400/30 shadow-md shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-slate-500 group-hover:text-cyan-300'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Security Status Card */}
      <div className="pt-4 border-t border-cyan-500/20 space-y-3">
        {/* Your Safety Our Priority Card */}
        <div className="relative overflow-hidden rounded-xl p-3.5 bg-gradient-to-br from-slate-900/90 to-[#081228] border border-cyan-500/25 shadow-lg shadow-black/40">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">
                Your Safety
              </div>
              <div className="text-[11px] font-medium text-cyan-300">
                Our Priority
              </div>
            </div>
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-1">
            Detect. Analyze. Protect.
          </p>
        </div>

        {/* Version & Ready Status */}
        <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
          <span className="text-slate-400">LinkShield v1.0.0</span>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready to scan</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 backdrop-blur-xl bg-[#050b18]/90 border-r border-cyan-500/20 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#050b18] border-r border-cyan-500/30 shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
