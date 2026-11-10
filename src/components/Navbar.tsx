import React from 'react';
import { Smartphone, Monitor, Code2, QrCode } from 'lucide-react';

interface NavbarProps {
  activeTab: 'survey' | 'dashboard' | 'export';
  setActiveTab: (tab: 'survey' | 'dashboard' | 'export') => void;
  onOpenQRModal: () => void;
  totalSubmissions: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQRModal,
  totalSubmissions,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            E
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            ระบบประเมินความพึงพอใจ
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('survey')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'survey'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>แบบสอบถาม (มือถือ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 relative ${
              activeTab === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Dashboard จอใหญ่</span>
            {totalSubmissions > 0 && (
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-mono tabular-nums">
                {totalSubmissions}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'export'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">โค้ดแยก 2 ไฟล์ & </span>
            <span>คู่มือ Firebase</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenQRModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-xs active:scale-98 whitespace-nowrap shrink-0"
            title="แสดง QR Code สำหรับผู้เข้าร่วมสแกน"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">QR Code ผู้เข้าอบรม</span>
            <span className="sm:hidden">QR</span>
          </button>
        </div>

      </div>
    </header>
  );
};
