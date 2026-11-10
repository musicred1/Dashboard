import { EvaluationSubmission, AggregateStats, FirebaseConfigSettings } from '../types';
import { EVALUATION_QUESTIONS, getLikertInterpretation } from '../data/questions';

const STORAGE_KEY = 'training_eval_submissions_v1';
const DEVICE_SUBMITTED_KEY = 'training_eval_device_submitted';
const FIREBASE_CONFIG_KEY = 'training_eval_firebase_cfg';
const CHANNEL_NAME = 'training_eval_broadcast_channel';

// Create broadcast channel for zero-latency multi-tab sync
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported', e);
  }
}

/**
 * Get all stored submissions
 */
export function getSubmissions(): EvaluationSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse submissions', e);
    return [];
  }
}

/**
 * Check if current device has already submitted
 */
export function hasSubmittedOnDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DEVICE_SUBMITTED_KEY) === 'true';
}

/**
 * Get the submission stored for this device if any
 */
export function getDeviceSubmissionDetails(): EvaluationSubmission | null {
  if (typeof window === 'undefined') return null;
  const lastId = localStorage.getItem(`${DEVICE_SUBMITTED_KEY}_id`);
  if (!lastId) return null;
  const all = getSubmissions();
  return all.find((s) => s.id === lastId) || null;
}

/**
 * Save new submission
 */
export function saveSubmission(
  scores: { q1: number; q2: number; q3: number; q4: number; q5: number },
  feedback?: string
): EvaluationSubmission {
  const newSubmission: EvaluationSubmission = {
    id: 'eval_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
    scores,
    feedback: feedback?.trim() || undefined,
    deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) : undefined,
  };

  const current = getSubmissions();
  const updated = [newSubmission, ...current];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(DEVICE_SUBMITTED_KEY, 'true');
    localStorage.setItem(`${DEVICE_SUBMITTED_KEY}_id`, newSubmission.id);
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }

  // Notify other tabs immediately
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'NEW_SUBMISSION', data: newSubmission });
  }

  return newSubmission;
}

/**
 * Reset local submission lock on current device (for testing or re-submission)
 */
export function clearDeviceSubmissionLock(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DEVICE_SUBMITTED_KEY);
  localStorage.removeItem(`${DEVICE_SUBMITTED_KEY}_id`);
}

/**
 * Clear all submissions (organizer reset)
 */
export function clearAllSubmissions(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'DATA_CLEARED' });
  }
}

/**
 * Seed realistic sample responses for projector demo
 */
export function seedSampleData(): void {
  const sampleFeedbacks = [
    'วิทยากรถ่ายทอดได้เข้าใจง่ายมาก ยกตัวอย่างการใช้งานจริงชัดเจน',
    'อยากให้เพิ่มเวลาในช่วงทำ Workshop ปฏิบัติการอีกนิดครับ สนุกมาก',
    'เนื้อหาทันสมัยและตอบโจทย์การทำงานในยุคนี้มาก นำไปปรับใช้ได้ทันที',
    'เอกสารประกอบการสอนสวยงาม เข้าใจง่าย โสตทัศนูปกรณ์ชัดเจนดี',
    'อาหารว่างอร่อย การบริการของทีมงานเป็นกันเองและดูแลดีมากครับ',
    'อยากให้จัดหลักสูตรระดับ Advanced ต่อยอดจากคอร์สนี้อีกครั้ง',
    'การตอบข้อซักถามของอาจารย์กระจ่างชัดเจน ประทับใจมาก',
    'สถานที่สะอาด แอร์เย็นสบาย บรรยากาศส่งเสริมการเรียนรู้ดีมาก',
  ];

  const now = Date.now();
  const sampleList: EvaluationSubmission[] = [];

  // Generate 16 realistic submissions with varying high-to-mid scores
  const scorePresets = [
    { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
    { q1: 4, q2: 5, q3: 4, q4: 5, q5: 4 },
    { q1: 5, q2: 4, q3: 5, q4: 4, q5: 5 },
    { q1: 5, q2: 5, q3: 5, q4: 5, q5: 4 },
    { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4 },
    { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    { q1: 3, q2: 4, q3: 4, q4: 3, q5: 4 },
    { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5 },
    { q1: 4, q2: 5, q3: 5, q4: 4, q5: 4 },
    { q1: 5, q2: 5, q3: 4, q4: 4, q5: 5 },
    { q1: 4, q2: 4, q3: 5, q4: 5, q5: 4 },
    { q1: 5, q2: 4, q3: 4, q4: 4, q5: 3 },
    { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5 },
    { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4 },
  ];

  scorePresets.forEach((scores, index) => {
    sampleList.push({
      id: `sample_${now}_${index}`,
      timestamp: now - (scorePresets.length - index) * 90000,
      scores,
      feedback: index % 2 === 0 && sampleFeedbacks[index / 2] ? sampleFeedbacks[index / 2] : undefined,
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleList));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'DATA_SEEDED' });
  }
}

/**
 * Calculate aggregated statistics
 */
export function calculateAggregateStats(submissions: EvaluationSubmission[]): AggregateStats {
  const totalCount = submissions.length;

  if (totalCount === 0) {
    return {
      totalCount: 0,
      overallMean: 0,
      overallSD: 0,
      overallLikert: getLikertInterpretation(0),
      questionStats: EVALUATION_QUESTIONS.map((q) => ({
        questionId: q.id,
        mean: 0,
        sd: 0,
        likert: getLikertInterpretation(0),
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      })),
      recentFeedbacks: [],
    };
  }

  // Question-by-question metrics
  const questionStats = EVALUATION_QUESTIONS.map((q) => {
    const key = `q${q.id}` as keyof EvaluationSubmission['scores'];
    const scores = submissions.map((s) => s.scores[key] || 0);
    const sum = scores.reduce((acc, val) => acc + val, 0);
    const mean = sum / totalCount;

    // Standard deviation: sqrt( sum( (x - mean)^2 ) / N )
    const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / totalCount;
    const sd = Math.sqrt(variance);

    // Distribution
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    scores.forEach((s) => {
      if (distribution[s] !== undefined) {
        distribution[s]++;
      }
    });

    return {
      questionId: q.id,
      mean: Number(mean.toFixed(2)),
      sd: Number(sd.toFixed(2)),
      likert: getLikertInterpretation(mean),
      distribution,
    };
  });

  // Overall mean across all 5 questions
  const allQuestionMeans = questionStats.map((qs) => qs.mean);
  const overallMean = Number(
    (allQuestionMeans.reduce((acc, m) => acc + m, 0) / allQuestionMeans.length).toFixed(2)
  );

  // Overall SD across all responses
  const allIndividualAverages = submissions.map((s) => {
    const sum = s.scores.q1 + s.scores.q2 + s.scores.q3 + s.scores.q4 + s.scores.q5;
    return sum / 5;
  });
  const overallVariance =
    allIndividualAverages.reduce((acc, val) => acc + Math.pow(val - overallMean, 2), 0) / totalCount;
  const overallSD = Number(Math.sqrt(overallVariance).toFixed(2));

  // Extract recent feedbacks
  const recentFeedbacks = submissions
    .filter((s) => s.feedback && s.feedback.trim().length > 0)
    .slice(0, 20)
    .map((s) => {
      const avg = (s.scores.q1 + s.scores.q2 + s.scores.q3 + s.scores.q4 + s.scores.q5) / 5;
      return {
        id: s.id,
        text: s.feedback || '',
        timestamp: s.timestamp,
        overallScore: Number(avg.toFixed(1)),
      };
    });

  return {
    totalCount,
    overallMean,
    overallSD,
    overallLikert: getLikertInterpretation(overallMean),
    questionStats,
    recentFeedbacks,
  };
}

/**
 * Export submissions to CSV with UTF-8 BOM for perfect Thai Excel support
 */
export function exportToCSV(submissions: EvaluationSubmission[]): void {
  if (submissions.length === 0) return;

  const headers = [
    'ลำดับ',
    'วันที่-เวลา',
    'ข้อ 1 (เนื้อหา)',
    'ข้อ 2 (วิทยากร)',
    'ข้อ 3 (การนำไปใช้)',
    'ข้อ 4 (สื่อการสอน)',
    'ข้อ 5 (สถานที่)',
    'คะแนนเฉลี่ยรวม',
    'ระดับการประเมิน',
    'ข้อเสนอแนะเพิ่มเติม',
  ];

  const rows = submissions.map((sub, idx) => {
    const dateStr = new Date(sub.timestamp).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const avg = (sub.scores.q1 + sub.scores.q2 + sub.scores.q3 + sub.scores.q4 + sub.scores.q5) / 5;
    const likert = getLikertInterpretation(avg).level;
    const cleanFeedback = sub.feedback ? `"${sub.feedback.replace(/"/g, '""')}"` : '""';

    return [
      idx + 1,
      `"${dateStr}"`,
      sub.scores.q1,
      sub.scores.q2,
      sub.scores.q3,
      sub.scores.q4,
      sub.scores.q5,
      avg.toFixed(2),
      `"${likert}"`,
      cleanFeedback,
    ].join(',');
  });

  // UTF-8 BOM: \uFEFF ensures Thai characters render properly in Excel
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `training-evaluation-results-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Subscribe to realtime updates across browser tabs
 */
export function subscribeToUpdates(callback: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      callback();
    }
  };

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type) {
      callback();
    }
  };

  window.addEventListener('storage', handleStorage);
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    window.removeEventListener('storage', handleStorage);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}

/**
 * Firebase Config local storage
 */
export function getFirebaseConfig(): FirebaseConfigSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveFirebaseConfig(cfg: FirebaseConfigSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(cfg));
}
