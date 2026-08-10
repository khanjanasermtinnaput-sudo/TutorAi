import { routeChatCompletion, collectChunks, type RouteChatDeps, type AiProvider } from "./ai-router";
import { buildQuizGenerationPrompt, QUIZ_SYSTEM, type QuizGenerationParams } from "./prompts/quiz-generation";
import { quizGenerationResponseSchema, type QuizGenerationResponse } from "@/lib/quiz/schema";

export interface GenerateQuizParams extends QuizGenerationParams {
  openRouterApiKey?: string;
  openRouterModel?: string;
  geminiApiKey?: string;
  geminiModel?: string;
}

export interface GenerateQuizResult {
  quiz: QuizGenerationResponse;
  provider: AiProvider;
}

function extractJson(text: string): string {
  // Strip ```json ... ``` fences in case the model ignores the "no markdown" instruction.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : text).trim();
}

const MAX_ATTEMPTS = 2;

/** Generates a quiz via the AI router, validates against the Zod schema, and
 * retries once (feeding the validation error back) before giving up — matches
 * master prompt §5.4's "retry 1 ครั้งก่อน error" requirement literally. */
export async function generateQuiz(
  params: GenerateQuizParams,
  deps?: RouteChatDeps,
): Promise<GenerateQuizResult> {
  const prompt = buildQuizGenerationPrompt(params);
  let lastError = "";
  let lastProvider: AiProvider | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const systemInstruction =
      attempt === 0
        ? QUIZ_SYSTEM
        : `${QUIZ_SYSTEM}\n\nการตอบครั้งก่อนไม่ผ่านการตรวจสอบ: ${lastError}\nกรุณาตอบใหม่ให้ตรงตาม schema เท่านั้น`;

    const routed = await routeChatCompletion(
      { messages: [{ role: "user", content: prompt }], systemInstruction, ...params },
      deps,
    );
    lastProvider = routed.provider;
    const text = await collectChunks(routed.chunks);

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(extractJson(text));
    } catch {
      lastError = "response was not valid JSON";
      continue;
    }

    const result = quizGenerationResponseSchema.safeParse(parsedJson);
    if (result.success) {
      return { quiz: result.data, provider: routed.provider };
    }
    lastError = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
  }

  throw new Error(
    `AI failed to produce a valid quiz after ${MAX_ATTEMPTS} attempts (provider: ${lastProvider}): ${lastError}`,
  );
}
