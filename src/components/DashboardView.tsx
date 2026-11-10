import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  AggregateStats,
  EvaluationSubmission,
} from '../types';
import { EVALUATION_QUESTIONS, RATING_LEVELS } from '../data/questions';
import {
  exportToCSV,
  seedSampleData,
  clearAllSubmissions,
} from '../services/storage';
import {
  Download,
  Maximize2,
  Minimize2,
  Sparkles,
  Trash2,
  QrCode,
  Copy,
  Check,
  TrendingUp,
  MessageSquare,
  Users,
  BarChart3,
  PieChart,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  stats: AggregateStats;
  submissions: EvaluationSubmission[];
  surveyUrl: string;
  onOpenQRModal: () => void;
  onRefresh: () => void;
}

interface CircularGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({
  score,
  size = 92,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, (score / 5) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let strokeColor = '#94a3b8'; // Slate (0.00 / no data)
  if (score >= 4.51) strokeColor = '#6366f1'; // Indigo (มากที่สุด)
  else if (score >= 3.51) strokeColor = '#10b981'; // Emerald (มาก)
  else if (score >= 2.51) strokeColor = '#eab308'; // Amber/Yellow (ปานกลาง)
  else if (score >= 1.51) strokeColor = '#f97316'; // Orange (น้อย)
  else if (score > 0) strokeColor = '#f43f5e'; // Rose (น้อยที่สุด)

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums leading-none">
          {score.toFixed(2)}
        </span>
        <span className="text-[10px] text-slate-400 font-medium leading-none mt-1">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  submissions,
  surveyUrl,
  onOpenQRModal,
  onRefresh,
}) => {
  const [chartType, setChartType] = useState<'circular' | 'bar'>('circular');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuestionTab, setSelectedQuestionTab] = useState<number | 'all'>('all');
  const [confirmClearModal, setConfirmClearModal] = useState(false);

  // Generate QR code for survey URL
  useEffect(() => {
    QRCode.toDataURL(surveyUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [surveyUrl]);

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(surveyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSeedData = () => {
    seedSampleData();
    onRefresh();
  };

  const handleConfirmClear = () => {
    clearAllSubmissions();
    setConfirmClearModal(false);
    onRefresh();
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 30) return 'เมื่อสักครู่';
    if (diff < 60) return `${diff} วินาทีที่แล้ว`;
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
    return new Date(timestamp).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Action & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              Live Realtime Feed
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              อัปเดตอัตโนมัติทันทีที่มีผู้ตอบ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            ผลการประเมินความพึงพอใจการอบรม
          </h1>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seed demo data */}
          <button
            onClick={handleSeedData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-800/60"
            title="เพิ่มข้อมูลจำลอง 14 คนสำหรับการทดสอบระบบ"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ จำลองข้อมูลตัวอย่าง</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={() => exportToCSV(submissions)}
            disabled={submissions.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          {/* Fullscreen for Projector */}
          <button
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            title="ขยายเต็มจอสำหรับโปรเจกเตอร์"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'ย่อหน้าต่าง' : 'โหมดเต็มจอ'}</span>
          </button>

          {/* Clear Submissions */}
          {submissions.length > 0 && (
            <button
              onClick={() => setConfirmClearModal(true)}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="ล้างข้อมูลทั้งหมด"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Top 3 High-Impact KPI Cards (Projector Ready) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Card 1: Total Respondents */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              ผู้ตอบแบบสอบถาม
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                {stats.totalCount}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">คน</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>ส่งล่าสุด:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {submissions.length > 0 ? formatRelativeTime(submissions[0].timestamp) : 'ยังไม่มีผู้ตอบ'}
            </span>
          </div>
        </div>

        {/* Card 2: Overall Mean & 5-Level Likert Tier */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              คะแนนเฉลี่ยรวม (Overall Mean)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl lg:text-6xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums tracking-tight">
                {stats.overallMean.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-slate-400">/ 5.00</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${stats.overallLikert.bgLight}`}>
              ระดับ &ldquo;{stats.overallLikert.level}&rdquo; ({stats.overallLikert.range})
            </span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              S.D. = {stats.overallSD.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card 3: Live QR Code for Audience Projector */}
        <div className="md:col-span-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-indigo-950/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-indigo-300">
                สแกนร่วมประเมิน
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                QR Code สำหรับผู้เข้าอบรม
              </h3>
            </div>
            <button
              onClick={onOpenQRModal}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="ขยาย QR Code ขึ้นจอใหญ่"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 my-3">
            {qrCodeDataUrl ? (
              <div
                onClick={onOpenQRModal}
                className="bg-white p-2 rounded-2xl shrink-0 cursor-pointer hover:scale-105 transition-transform shadow-md"
                title="คลิกเพื่อขยาย QR Code เต็มจอ"
              >
                <img src={qrCodeDataUrl} alt="Survey QR Code" className="w-24 h-24 object-contain" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center">
                <QrCode className="w-8 h-8 text-slate-400 animate-spin" />
              </div>
            )}

            <div className="space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed">
                เปิดกล้องมือถือส่อง QR Code หรือคัดลอกลิงก์เพื่อเข้าตอบแบบสอบถาม
              </p>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium transition-colors text-[11px]"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-indigo-200/80 flex items-center justify-between pt-2 border-t border-white/10">
            <span className="truncate max-w-[200px]">{surveyUrl}</span>
            <button
              onClick={onOpenQRModal}
              className="text-white hover:underline flex items-center gap-1 font-semibold"
            >
              <span>ขยายขึ้นจอ</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Bar Charts per Question & Suggestions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: 5 Questions Performance (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            
            {/* Header & View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {chartType === 'circular' ? (
                    <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                  <span>คะแนนเฉลี่ยรายข้อ (เกณฑ์ 5 ระดับ)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {chartType === 'circular' ? 'การนำเสนอแบบวงกลม (Circular Progress Gauges)' : 'การนำเสนอแบบแท่ง (Bar Charts)'}
                </p>
              </div>

              {/* View Toggle Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setChartType('circular')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    chartType === 'circular'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>แบบวงกลม</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    chartType === 'bar'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>แบบแท่ง</span>
                </button>
              </div>
            </div>

            {/* Circular Charts Mode (Default) */}
            {chartType === 'circular' ? (
              <div className="space-y-3.5 mt-4">
                {stats.questionStats.map((qs) => {
                  const questionMeta = EVALUATION_QUESTIONS.find((q) => q.id === qs.questionId)!;

                  return (
                    <div
                      key={qs.questionId}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      {/* Left: Circular Progress Gauge */}
                      <CircularGauge score={qs.mean} size={94} strokeWidth={8} />

                      {/* Right: Question Metadata & Distribution */}
                      <div className="flex-1 text-center sm:text-left min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1">
                          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                              ข้อ {qs.questionId}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">·</span>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                              {questionMeta.title}
                            </h3>
                          </div>

                          <div className="flex items-center justify-center sm:justify-end gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${qs.likert.bgLight}`}>
                              {qs.likert.level} ({qs.likert.range})
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                              S.D. {qs.sd.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                          {questionMeta.description}
                        </p>

                        {/* 1-5 Rating Distribution Pills */}
                        <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] sm:text-[11px]">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const count = qs.distribution[star] || 0;
                            const ratio = stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
                            return (
                              <div
                                key={star}
                                className="bg-white dark:bg-slate-900/90 rounded-lg py-1 px-1.5 border border-slate-200/70 dark:border-slate-800"
                              >
                                <span className="text-[10px] text-slate-400 block">{star}★</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                                  {count} <span className="text-[9px] font-normal text-slate-400">({ratio}%)</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Bar Charts Mode */
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
                {stats.questionStats.map((qs) => {
                  const questionMeta = EVALUATION_QUESTIONS.find((q) => q.id === qs.questionId)!;
                  const percent = Math.min(100, (qs.mean / 5) * 100);

                  return (
                    <div key={qs.questionId} className="py-4 first:pt-3 last:pb-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                              ข้อ {qs.questionId}
                            </span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">
                              {questionMeta.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {questionMeta.description}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                              {qs.mean.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400">/ 5.00</span>
                          </div>
                          <div className="mt-0.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${qs.likert.bgLight}`}>
                              {qs.likert.level}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-2 relative">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-700 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {stats.totalCount > 0 && (
                        <div className="grid grid-cols-5 gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const count = qs.distribution[star] || 0;
                            const ratio = stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
                            return (
                              <div key={star} className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-1 text-center">
                                <span className="text-[10px] text-slate-400 block">{star} ดาว</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                                  {count} <span className="text-[9px] font-normal text-slate-400">({ratio}%)</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Live Suggestions & Comments Feed (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[500px]">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  ข้อเสนอแนะล่าสุด
                </h2>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                {stats.recentFeedbacks.length} รายการ
              </span>
            </div>

            {/* Scrollable Feed */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto max-h-[560px] pr-1 flex-1 mt-1">
              {stats.recentFeedbacks.length === 0 ? (
                <div className="py-16 text-center text-slate-400 dark:text-slate-500">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">ยังไม่มีข้อเสนอแนะเพิ่มเติม</p>
                  <p className="text-xs mt-1">
                    ข้อเสนอแนะจากผู้เข้าอบรมจะแสดงขึ้นที่นี่ทันทีแบบเรียลไทม์
                  </p>
                </div>
              ) : (
                stats.recentFeedbacks.map((item) => (
                  <div key={item.id} className="py-3.5 first:pt-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span>{formatRelativeTime(item.timestamp)}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono tabular-nums">
                        ⭐ คะแนนรวม {item.overallScore}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Confirmation Modal for Clearing Submissions */}
      {confirmClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              ยืนยันการล้างข้อมูล?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              การกระทำนี้จะล้างข้อมูลการประเมินทั้งหมด ({stats.totalCount} รายการ) ออกจากระบบ และไม่สามารถกู้คืนได้
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmClearModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
              >
                ล้างข้อมูลทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
