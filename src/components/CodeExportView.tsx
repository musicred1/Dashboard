import React, { useState } from 'react';
import {
  STANDALONE_SURVEY_HTML,
  STANDALONE_DASHBOARD_HTML,
  FIREBASE_SETUP_GUIDE_MD,
} from '../data/standaloneTemplates';
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  Code2,
  BookOpen,
  FileText,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const CodeExportView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'survey' | 'dashboard' | 'guide'>('survey');
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Custom Firebase Config fields
  const [apiKey, setApiKey] = useState('AIzaSyExampleKey123');
  const [projectId, setProjectId] = useState('training-eval-demo');
  const [databaseURL, setDatabaseURL] = useState('https://training-eval-demo-default-rtdb.asia-southeast1.firebasedatabase.app');
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  // Replace placeholder with custom config if set
  const getCustomizedSurveyCode = () => {
    return STANDALONE_SURVEY_HTML
      .replace('YOUR_API_KEY', apiKey)
      .replace(/YOUR_PROJECT_ID/g, projectId)
      .replace('https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com', databaseURL);
  };

  const getCustomizedDashboardCode = () => {
    return STANDALONE_DASHBOARD_HTML
      .replace('YOUR_API_KEY', apiKey)
      .replace(/YOUR_PROJECT_ID/g, projectId)
      .replace('https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com', databaseURL);
  };

  const currentCode =
    selectedTab === 'survey'
      ? getCustomizedSurveyCode()
      : selectedTab === 'dashboard'
      ? getCustomizedDashboardCode()
      : FIREBASE_SETUP_GUIDE_MD;

  const currentFilename =
    selectedTab === 'survey'
      ? 'index.html'
      : selectedTab === 'dashboard'
      ? 'dashboard.html'
      : 'firebase-setup-guide.md';

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleDownload = () => {
    const mime = selectedTab === 'guide' ? 'text/markdown;charset=utf-8;' : 'text/html;charset=utf-8;';
    const blob = new Blob([currentCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Firebase Realtime Database Ready
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">Standalone Files (ไม่ต้องมี Node.js)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            โค้ดแยก 2 ไฟล์ & คู่มือการตั้งค่า Firebase Realtime Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            ไฟล์ HTML + JS บริสุทธิ์แยก 2 หน้าตามความต้องการ: หน้าสำหรับผู้เข้าอบรม (<code className="text-indigo-600 dark:text-indigo-400 font-mono">index.html</code>)
            และหน้า Dashboard สำหรับผู้จัดงาน (<code className="text-indigo-600 dark:text-indigo-400 font-mono">dashboard.html</code>)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showConfigDrawer ? 'ซ่อนการตั้งค่า Config' : 'ใส่ Firebase Config ของคุณ'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'คัดลอกโค้ดแล้ว!' : 'คัดลอกโค้ด'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด {currentFilename}</span>
          </button>
        </div>
      </div>

      {/* Firebase Config Injection Drawer */}
      {showConfigDrawer && (
        <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-3xl p-5 sm:p-6 transition-all animate-fadeIn">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                แทรกค่า Firebase Config ลงในโค้ดโดยอัตโนมัติ
              </h3>
              <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80">
                เมื่อท่านระบุค่าตรงนี้ โค้ดในกล่องด้านล่างจะอัปเดตอัตโนมัติทันที สามารถคัดลอกหรือดาวน์โหลดไปใช้ได้เลย
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
              Auto-Injected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Project ID
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="my-eval-project"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Realtime Database URL
              </label>
              <input
                type="text"
                value={databaseURL}
                onChange={(e) => setDatabaseURL(e.target.value)}
                placeholder="https://...firebasedatabase.app"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs Selection Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl max-w-md">
        <button
          onClick={() => setSelectedTab('survey')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            selectedTab === 'survey'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. index.html (หน้าตอบ)</span>
        </button>

        <button
          onClick={() => setSelectedTab('dashboard')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            selectedTab === 'dashboard'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>2. dashboard.html (จอผล)</span>
        </button>

        <button
          onClick={() => setSelectedTab('guide')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            selectedTab === 'guide'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>3. คู่มือติดตั้ง & Deploy</span>
        </button>
      </div>

      {/* Content Area */}
      {selectedTab === 'guide' ? (
        /* Markdown Style Step-by-Step Guide */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              คู่มือการตั้งค่า Firebase Realtime Database และการ Deploy ฟรีทีละขั้น
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              สำหรับนำไฟล์ <code className="text-indigo-600 font-mono">index.html</code> และ <code className="text-indigo-600 font-mono">dashboard.html</code> ไปเผยแพร่ใช้งานจริงในงานสัมมนาหรือการอบรม ฟรี 100%
            </p>
          </div>

          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                สร้าง Firebase Project และเปิด Realtime Database (ฟรีตลอดการใช้งาน)
              </h3>
            </div>
            <div className="pl-9 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>
                1.1 เข้าเว็บไซต์ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium">Firebase Console <ExternalLink className="w-3 h-3" /></a> แล้วลงชื่อเข้าใช้ด้วยบัญชี Google
              </p>
              <p>
                1.2 คลิกปุ่ม <strong>&ldquo;Add project&rdquo;</strong> (สร้างโปรเจกต์) ตั้งชื่อโปรเจกต์ เช่น <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">training-eval-2026</code> แล้วกด <strong>Continue</strong>
              </p>
              <p>
                1.3 ที่แถบเมนูด้านซ้าย เลือก <strong>Build &gt; Realtime Database</strong> จากนั้นคลิกปุ่ม <strong>&ldquo;Create Database&rdquo;</strong>
              </p>
              <p>
                1.4 เลือก Cloud Location เป็น <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">Singapore (asia-southeast1)</code> เพื่อความเร็วสูงสุดในไทย
              </p>
              <p>
                1.5 ในขั้นตอน Security Rules ให้เลือก <strong>&ldquo;Start in test mode&rdquo;</strong> แล้วคลิก <strong>Enable</strong>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ตั้งค่า Database Rules (เพื่อให้ผู้ตอบส่งคะแนนได้ทันทีโดยไม่ต้องล็อกอิน)
              </h3>
            </div>
            <div className="pl-9 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>
                ในหน้า Realtime Database ให้คลิกแท็บ <strong>&ldquo;Rules&rdquo;</strong> (กฎ) แล้วแทนที่ด้วยโค้ดด้านล่างนี้ จากนั้นกด <strong>Publish</strong>:
              </p>
              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
{`{
  "rules": {
    "submissions": {
      ".read": true,
      ".write": true
    }
  }
}`}
              </pre>
              <p className="text-[11px] text-slate-500">
                * กฎนี้อนุญาตให้อ่านและเขียนในพาธ submissions ได้อย่างปลอดภัยสำหรับงานสัมมนาแบบนิรนาม
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                คัดลอกค่า firebaseConfig มาใส่ในไฟล์ HTML
              </h3>
            </div>
            <div className="pl-9 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>
                3.1 ใน Firebase Console คลิกไอคอน ⚙️ (Project Settings) ที่มุมซ้ายบน
              </p>
              <p>
                3.2 เลื่อนลงมาที่หัวข้อ <strong>&ldquo;Your apps&rdquo;</strong> แล้วคลิกไอคอนเว็บ <strong>&lt;/&gt;</strong> ตั้งชื่อเว็บแล้วกด Register
              </p>
              <p>
                3.3 คัดลอกค่า <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">firebaseConfig</code> มาวางในกล่อง <strong>&ldquo;ใส่ Firebase Config ของคุณ&rdquo;</strong> ด้านบน หรือเปิดแก้ไขในไฟล์ <code className="font-mono">index.html</code> และ <code className="font-mono">dashboard.html</code> โดยตรง
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                วิธีนำไป Deploy ขึ้นออนไลน์ฟรี (GitHub Pages หรือ Firebase Hosting)
              </h3>
            </div>
            <div className="pl-9 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                  ตัวเลือกที่ 1: GitHub Pages (แนะนำ ง่ายสุด ไม่ต้องติดตั้งโปรแกรม)
                </h4>
                <ol className="list-decimal pl-4 space-y-1 text-xs">
                  <li>สร้าง Repository ใหม่ใน GitHub (เลือกเป็น Public)</li>
                  <li>อัปโหลดไฟล์ <code className="font-mono">index.html</code> และ <code className="font-mono">dashboard.html</code> ขึ้น Repository</li>
                  <li>ไปที่ <strong>Settings &gt; Pages</strong> เลือก Branch: <strong>main</strong> และโฟลเดอร์ <strong>/ (root)</strong> แล้วกด Save</li>
                  <li>จะได้ลิงก์ เช่น <code className="font-mono">https://username.github.io/my-eval/</code> เพื่อนำไปเปิดและสร้าง QR Code ได้ทันที</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                  ตัวเลือกที่ 2: Firebase Hosting
                </h4>
                <p className="text-xs mb-2">สั่งรันคำสั่งเพียง 2 บรรทัดผ่าน Terminal:</p>
                <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
{`npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy`}
                </pre>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Code Display Box */
        <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-slate-300 ml-2">{currentFilename}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'COPIED!' : 'COPY'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD</span>
              </button>
            </div>
          </div>

          <pre className="p-5 sm:p-6 text-xs sm:text-[13px] font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[650px] overflow-y-auto selection:bg-indigo-600 selection:text-white">
            <code>{currentCode}</code>
          </pre>
        </div>
      )}

    </div>
  );
};
