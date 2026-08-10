import type { Difficulty } from "@/lib/quiz/schema";

const DIFFICULTY_TH: Record<Difficulty, string> = {
  easy: "ง่าย",
  medium: "ปานกลาง",
  hard: "ยาก",
};

export interface QuizGenerationParams {
  subjectName: string;
  educationLevel: string;
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
}

export const QUIZ_SYSTEM = `คุณคือติวเตอร์ AI ที่สร้างข้อสอบปรนัย 4 ตัวเลือก
ตอบกลับเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอกเหนือจาก JSON object เดียว ห้ามใช้ markdown code fence
โครงสร้าง JSON ต้องตรงตามนี้เป๊ะ:
{
  "questions": [
    {
      "question_text": string,
      "choices": { "A": string, "B": string, "C": string, "D": string },
      "correct_choice": "A" | "B" | "C" | "D",
      "explanation": string
    }
  ]
}
กฎสำคัญ: "explanation" ต้องอธิบายวิธีคิดทีละขั้นตอนอย่างละเอียด ห้ามตอบสั้นๆ แค่ "คำตอบคือ B" เด็ดขาด
ถ้าเนื้อหามีสูตร ให้เขียนสูตรด้วย LaTeX ($...$) ภายใน string ได้`;

export function buildQuizGenerationPrompt(params: QuizGenerationParams): string {
  return `สร้างข้อสอบวิชา${params.subjectName} สำหรับนักเรียนระดับ${params.educationLevel}
หัวข้อ: ${params.topic}
ระดับความยาก: ${DIFFICULTY_TH[params.difficulty]}
จำนวนข้อ: ${params.questionCount} ข้อ

สร้างข้อสอบตามจำนวนและระดับความยากที่กำหนด ตอบเป็น JSON ตาม schema ที่กำหนดไว้เท่านั้น`;
}
