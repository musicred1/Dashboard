import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { CodeExportView } from './components/CodeExportView';
import { QRCodeModal } from './components/QRCodeModal';
import {
  getSubmissions,
  calculateAggregateStats,
  subscribeToUpdates,
} from './services/storage';
import { EvaluationSubmission, AggregateStats } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'export'>('survey');
  const [submissions, setSubmissions] = useState<EvaluationSubmission[]>([]);
  const [stats, setStats] = useState<AggregateStats>(() => calculateAggregateStats([]));
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('');

  // Determine current survey URL for QR codes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', 'survey');
      setSurveyUrl(url.toString());

      // If initial URL has ?mode=dashboard, open dashboard
      const modeParam = new URLSearchParams(window.location.search).get('mode');
      if (modeParam === 'dashboard') {
        setActiveTab('dashboard');
      } else if (modeParam === 'export') {
        setActiveTab('export');
      }
    }
  }, []);

  // Sync submissions from storage
  const loadSubmissions = useCallback(() => {
    const list = getSubmissions();
    setSubmissions(list);
    setStats(calculateAggregateStats(list));
  }, []);

  useEffect(() => {
    loadSubmissions();
    const unsubscribe = subscribeToUpdates(() => {
      loadSubmissions();
    });
    return unsubscribe;
  }, [loadSubmissions]);

  // Update URL query parameter when tab changes without full reload
  const handleTabChange = (tab: 'survey' | 'dashboard' | 'export') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', tab);
      window.history.pushState({}, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Bar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenQRModal={() => setIsQRModalOpen(true)}
        totalSubmissions={submissions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'survey' && (
          <SurveyView
            onSuccessSubmit={() => {
              loadSubmissions();
            }}
            onGoToDashboard={() => handleTabChange('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            submissions={submissions}
            surveyUrl={surveyUrl}
            onOpenQRModal={() => setIsQRModalOpen(true)}
            onRefresh={loadSubmissions}
          />
        )}

        {activeTab === 'export' && <CodeExportView />}
      </main>

      {/* Large Projector QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        defaultUrl={surveyUrl}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            ระบบประเมินความพึงพอใจการอบรม &middot; สเกล 1-5 ตามเกณฑ์ Likert 5 ระดับ &middot; ไม่ระบุตัวตนผู้ตอบ
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleTabChange('survey')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              หน้าแบบสอบถาม
            </button>
            <button
              onClick={() => handleTabChange('dashboard')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              หน้าจอโปรเจกเตอร์
            </button>
            <button
              onClick={() => handleTabChange('export')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              โค้ด Firebase
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
