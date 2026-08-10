import { z } from "zod";

// Rejects an explanation that's literally just the answer restated
// ("คำตอบคือ B") — master prompt §10 explicitly bans this. A qualitative
// "step-by-step" requirement can't be fully enforced by a schema, but this
// catches the exact failure mode named in the spec.
function isJustTheAnswer(text: string): boolean {
  return /^(คำตอบ(คือ)?|ตอบ)\s*[:\-]?\s*[A-D]\.?\s*$/.test(text.trim());
}

export const quizQuestionSchema = z.object({
  question_text: z.string().min(1),
  choices: z.object({
    A: z.string().min(1),
    B: z.string().min(1),
    C: z.string().min(1),
    D: z.string().min(1),
  }),
  correct_choice: z.enum(["A", "B", "C", "D"]),
  explanation: z
    .string()
    .min(40, "explanation too short to be step-by-step")
    .refine((v) => !isJustTheAnswer(v), { message: "explanation must show the reasoning, not just the answer" }),
});

export const quizGenerationResponseSchema = z.object({
  questions: z.array(quizQuestionSchema).min(1),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type QuizGenerationResponse = z.infer<typeof quizGenerationResponseSchema>;

export type Difficulty = "easy" | "medium" | "hard";
export const difficultySchema = z.enum(["easy", "medium", "hard"]);
