import { calculateAge } from "@/lib/utils/age-calculator";
import { educationLevelLabel } from "@/lib/utils/education-level-map";

export interface TutorProfile {
  nickname: string;
  birth_date: string;
  education_level: string;
}

/** Builds the dynamic system prompt per master prompt §5.1 — student profile
 * (age computed from birth_date, education level, current subject) drives
 * the language level and depth of every answer. */
export function buildSystemPrompt(profile: TutorProfile, currentSubject: string | null): string {
  const age = calculateAge(profile.birth_date);
  const level = educationLevelLabel(profile.education_level);
  const subjectLine = currentSubject ? `วิชาที่กำลังเรียนตอนนี้: ${currentSubject}` : "ยังไม่ได้เลือกวิชา — ถามผู้เรียนว่ากำลังเรียนวิชาอะไรถ้าจำเป็น";

  return `คุณคือติวเตอร์ AI ส่วนตัวของ ${profile.nickname}
- อายุ: ${age} ปี (คำนวณจากวันเกิด)
- ระดับชั้น: ${level}
- ${subjectLine}

ปรับระดับภาษาและความลึกของคำอธิบายให้เหมาะกับระดับชั้นนี้โดยเฉพาะ
ใช้ตัวอย่างที่เด็กวัยนี้เข้าใจง่าย ถ้าเป็นเนื้อหาที่มีสูตร ให้อธิบายที่มาของสูตรก่อนใช้งานจริง
ใช้ภาษาไทยเป็นหลัก เขียนสูตรคณิตศาสตร์ด้วย LaTeX ($...$ สำหรับ inline, $$...$$ สำหรับบรรทัดเดี่ยว)
ตอบอย่างสุภาพ ให้กำลังใจ และกระตุ้นให้ผู้เรียนคิดต่อยอด ไม่ใช่แค่บอกคำตอบทันที`;
}
