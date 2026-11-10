import { Question, LikertInterpretation } from '../types';

export const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'ด้านเนื้อหาหลักสูตร',
    category: 'เนื้อหา',
    description: 'ความชัดเจน ความครอบคลุม และความสอดคล้องกับวัตถุประสงค์ของการอบรม',
  },
  {
    id: 2,
    title: 'ด้านวิทยากรผู้สอน',
    category: 'วิทยากร',
    description: 'ความเชี่ยวชาญ เทคนิคการถ่ายทอด การตอบคำถาม และการสร้างบรรยากาศการเรียนรู้',
  },
  {
    id: 3,
    title: 'ด้านการนำไปใช้ประโยชน์',
    category: 'การประยุกต์ใช้',
    description: 'สามารถนำความรู้และทักษะที่ได้รับไปประยุกต์ใช้ในการปฏิบัติงานจริงได้',
  },
  {
    id: 4,
    title: 'ด้านสื่อและเอกสารประกอบ',
    category: 'สื่อการสอน',
    description: 'ความสมบูรณ์ เข้าใจง่ายของเอกสาร สไลด์ แบบฝึกหัด และกิจกรรม',
  },
  {
    id: 5,
    title: 'ด้านสถานที่และการให้บริการ',
    category: 'สถานที่/บริการ',
    description: 'ความพร้อมของห้องอบรม อุปกรณ์ โสตทัศนูปกรณ์ อาหารว่าง และการประสานงาน',
  },
];

export const RATING_LEVELS = [
  { score: 1, label: 'น้อยที่สุด', short: 'น้อยสุด', emoji: '😞', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  { score: 2, label: 'น้อย', short: 'น้อย', emoji: '🙁', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { score: 3, label: 'ปานกลาง', short: 'ปานกลาง', emoji: '😐', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  { score: 4, label: 'มาก', short: 'มาก', emoji: '😊', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { score: 5, label: 'มากที่สุด', short: 'มากสุด', emoji: '🤩', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
];

/**
 * Standard Thai Likert 5-level scale interpretation:
 * 4.51 – 5.00: มากที่สุด (Highest)
 * 3.51 – 4.50: มาก (High)
 * 2.51 – 3.50: ปานกลาง (Moderate)
 * 1.51 – 2.50: น้อย (Low)
 * 1.00 – 1.50: น้อยที่สุด (Lowest)
 */
export function getLikertInterpretation(mean: number): LikertInterpretation {
  if (mean >= 4.51) {
    return {
      level: 'มากที่สุด',
      range: '4.51 – 5.00',
      color: 'text-indigo-700 dark:text-indigo-400',
      textColor: 'text-indigo-700',
      bgLight: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      description: 'ระดับความพึงพอใจดีเยี่ยม เกินความคาดหมาย',
    };
  }
  if (mean >= 3.51) {
    return {
      level: 'มาก',
      range: '3.51 – 4.50',
      color: 'text-emerald-700 dark:text-emerald-400',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      description: 'ระดับความพึงพอใจดี เป็นไปตามมาตรฐานที่กำหนด',
    };
  }
  if (mean >= 2.51) {
    return {
      level: 'ปานกลาง',
      range: '2.51 – 3.50',
      color: 'text-yellow-700 dark:text-yellow-400',
      textColor: 'text-yellow-700',
      bgLight: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      description: 'ระดับความพึงพอใจพอใช้ มีจุดที่ควรปรับปรุงพัฒนา',
    };
  }
  if (mean >= 1.51) {
    return {
      level: 'น้อย',
      range: '1.51 – 2.50',
      color: 'text-amber-700 dark:text-amber-400',
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50 border-amber-200 text-amber-700',
      description: 'ระดับความพึงพอใจต่ำ ควรได้รับการปรับปรุง',
    };
  }
  return {
    level: 'น้อยที่สุด',
    range: '1.00 – 1.50',
    color: 'text-rose-700 dark:text-rose-400',
    textColor: 'text-rose-700',
    bgLight: 'bg-rose-50 border-rose-200 text-rose-700',
    description: 'ระดับความพึงพอใจต่ำมาก ต้องปรับปรุงแก้ไขเร่งด่วน',
  };
}
