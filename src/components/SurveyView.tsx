import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EVALUATION_QUESTIONS, RATING_LEVELS, getLikertInterpretation } from '../data/questions';
import {
  saveSubmission,
  hasSubmittedOnDevice,
  getDeviceSubmissionDetails,
  clearDeviceSubmissionLock,
} from '../services/storage';
import { CheckCircle2, RotateCcw, Send, Star, AlertCircle } from 'lucide-react';
import { EvaluationSubmission } from '../types';

interface SurveyViewProps {
  onSuccessSubmit: () => void;
  onGoToDashboard: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({
  onSuccessSubmit,
  onGoToDashboard,
}) => {
  const [scores, setScores] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<EvaluationSubmission | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasSubmittedOnDevice()) {
      setIsSubmitted(true);
      setSubmittedData(getDeviceSubmissionDetails());
    }
  }, []);

  const handleScoreSelect = (questionId: number, score: number) => {
    setScores((prev) => ({ ...prev, [questionId]: score }));
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all 5 questions
    const unanswered = EVALUATION_QUESTIONS.filter((q) => !scores[q.id]);
    if (unanswered.length > 0) {
      setValidationError(`กรุณาตอบแบบประเมินให้ครบทุกข้อ (ยังไม่ได้ตอบข้อ ${unanswered.map((u) => u.id).join(', ')})`);
      // Scroll to first unanswered question
      const el = document.getElementById(`question-card-${unanswered[0].id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const submission = saveSubmission(
        {
          q1: scores[1],
          q2: scores[2],
          q3: scores[3],
          q4: scores[4],
          q5: scores[5],
        },
        feedback
      );

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
      });

      setSubmittedData(submission);
      setIsSubmitted(true);
      setIsSubmitting(false);
      onSuccessSubmit();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    clearDeviceSubmissionLock();
    setIsSubmitted(false);
    setSubmittedData(null);
    setScores({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    setFeedback('');
    setValidationError(null);
  };

  // If already submitted on this device
  if (isSubmitted) {
    const avgScore = submittedData
      ? (submittedData.scores.q1 +
          submittedData.scores.q2 +
          submittedData.scores.q3 +
          submittedData.scores.q4 +
          submittedData.scores.q5) /
        5
      : 0;
    const likert = getLikertInterpretation(avgScore);

    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center shadow-sm">
          
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-5 shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            ขอบคุณสำหรับการประเมิน!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed max-w-md mx-auto">
            ความคิดเห็นและข้อเสนอแนะของท่านได้รับการบันทึกและส่งต่อไปยังหน้าจอสรุปผลของผู้จัดงานแบบเรียลไทม์แล้ว
          </p>

          {/* Submission summary pill */}
          {submittedData && (
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 mb-6 text-left space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-700/60">
                <span>สรุปคะแนนที่ท่านให้</span>
                <span className="font-mono tabular-nums">เฉลี่ย {avgScore.toFixed(2)} / 5.00 ({likert.level})</span>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center">
                {EVALUATION_QUESTIONS.map((q) => {
                  const scoreKey = `q${q.id}` as keyof EvaluationSubmission['scores'];
                  const scoreVal = submittedData.scores[scoreKey];
                  return (
                    <div key={q.id} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">ข้อ {q.id}</span>
                      <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                        {scoreVal}
                      </span>
                    </div>
                  );
                })}
              </div>

              {submittedData.feedback && (
                <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 italic">
                  &ldquo;{submittedData.feedback}&rdquo;
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onGoToDashboard}
              className="px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
            >
              ดูผลประเมินรวมบน Dashboard
            </button>
            <button
              onClick={handleResetForTesting}
              className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ส่งแบบประเมินใหม่ (โหมดทดสอบ)</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-6">
            ระบบป้องกันการส่งซ้ำอัตโนมัติด้วยบันทึกภายในอุปกรณ์ (Local Device Token)
          </p>
        </div>
      </div>
    );
  }

  // Active survey form
  const answeredCount = Object.values(scores).filter((v) => v > 0).length;
  const progressPercent = Math.round((answeredCount / 5) * 100);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      
      {/* Progress & Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
          <span>ความคืบหน้าการตอบ ({answeredCount}/5 ข้อ)</span>
          <span className="font-mono tabular-nums">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 mb-6">
        <h2 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 mb-1">
          แบบประเมินความพึงพอใจการฝึกอบรม
        </h2>
        <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
          กรุณาให้คะแนนความพึงพอใจในระดับ 1 (น้อยที่สุด) ถึง 5 (มากที่สุด)
          ข้อมูลของท่านจะถูกส่งไปยังหน้าจอประมวลผลทันทีโดยไม่ระบุตัวตน
        </p>
      </div>

      {/* Validation Error banner */}
      {validationError && (
        <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Evaluation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {EVALUATION_QUESTIONS.map((q) => {
          const currentScore = scores[q.id];
          const isAnswered = currentScore > 0;
          const selectedLevel = RATING_LEVELS.find((l) => l.score === currentScore);

          return (
            <div
              key={q.id}
              id={`question-card-${q.id}`}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs ${
                isAnswered
                  ? 'border-indigo-200 dark:border-indigo-900/60 ring-1 ring-indigo-50 dark:ring-transparent'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  ข้อ {q.id} · {q.category}
                </span>

                {selectedLevel ? (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <span>{selectedLevel.emoji}</span>
                    <span>{selectedLevel.label} ({selectedLevel.score})</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    ยังไม่เลือก
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
                {q.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                {q.description}
              </p>

              {/* 1-5 Rating Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {RATING_LEVELS.map((level) => {
                  const isSelected = currentScore === level.score;

                  return (
                    <button
                      key={level.score}
                      type="button"
                      onClick={() => handleScoreSelect(q.id, level.score)}
                      className={`min-h-[56px] py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform -translate-y-0.5'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-lg leading-none mb-1">{level.emoji}</span>
                      <span className="text-sm font-bold font-mono tabular-nums leading-none mb-0.5">
                        {level.score}
                      </span>
                      <span
                        className={`text-[10px] leading-none whitespace-nowrap ${
                          isSelected ? 'text-indigo-100 font-medium' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {level.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Feedback Text Area */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <label
            htmlFor="feedback-input"
            className="block text-sm font-bold text-slate-900 dark:text-white mb-1"
          >
            ข้อเสนอแนะเพิ่มเติม <span className="text-xs font-normal text-slate-400">(ไม่บังคับ)</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            สิ่งที่ท่านประทับใจ หรือสิ่งที่อยากให้พัฒนาเพิ่มเติมในการจัดอบรมครั้งถัดไป
          </p>
          <textarea
            id="feedback-input"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="พิมพ์ความคิดเห็น หรือข้อเสนอแนะของท่านได้ที่นี่..."
            className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 pb-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[52px] py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>{isSubmitting ? 'กำลังส่งแบบประเมิน...' : 'ส่งแบบประเมินความพึงพอใจ'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
