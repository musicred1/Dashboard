import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, ExternalLink, Edit3, Smartphone } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  defaultUrl,
}) => {
  const [url, setUrl] = useState(defaultUrl);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [customInput, setCustomInput] = useState(defaultUrl);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(defaultUrl);
    setCustomInput(defaultUrl);
  }, [defaultUrl]);

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(url, {
      width: 480,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((data) => setQrDataUrl(data))
      .catch((err) => console.error('Failed to generate large QR', err));
  }, [url, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setUrl(customInput.trim());
      setIsEditingUrl(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>สแกนผ่านโทรศัพท์มือถือ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            สแกนเพื่อร่วมประเมินความพึงพอใจ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            เปิดแอปกล้องบนสมาร์ตโฟน แล้วส่องมาที่ QR Code บนหน้าจอนี้เพื่อตอบแบบประเมินได้ทันที
          </p>
        </div>

        {/* Big QR Code Card */}
        <div className="bg-white p-5 rounded-3xl shadow-md border border-slate-200 inline-block mx-auto mb-5">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Survey QR Code"
              className="w-64 h-64 sm:w-72 sm:h-72 object-contain mx-auto"
            />
          ) : (
            <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center text-slate-400">
              กำลังสร้าง QR Code...
            </div>
          )}
        </div>

        {/* URL Box & Copy */}
        <div className="max-w-md mx-auto mb-4">
          {isEditingUrl ? (
            <form onSubmit={handleSaveCustomUrl} className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="ระบุ URL..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
              >
                บันทึก
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-mono text-slate-700 dark:text-slate-300 truncate text-left flex-1 pl-1">
                {url}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  title="คัดลอกลิงก์"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsEditingUrl(true)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="แก้ไข URL"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Steps for Attendees */}
        <div className="grid grid-cols-3 gap-2 text-left pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">1. สแกน QR</span>
            เปิดกล้องมือถือส่อง QR ได้ทันที
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">2. ประเมิน 5 ข้อ</span>
            กดคะแนน 1-5 สะดวกรวดเร็ว
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">3. แสดงผลทันที</span>
            คะแนนขึ้นจอนี้แบบเรียลไทม์
          </div>
        </div>

      </div>
    </div>
  );
};
