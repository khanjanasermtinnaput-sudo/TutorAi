import { generateValidatedJson } from "./json-completion";
import type { RouteChatDeps, AiProvider } from "./ai-router";
import { buildQuizGenerationPrompt, QUIZ_SYSTEM, type QuizGenerationParams } from "./prompts/quiz-generation";
import { quizGenerationResponseSchema, type QuizGenerationResponse } from "@/lib/quiz/schema";

export interface GenerateQuizParams extends QuizGenerationParams {
  openRouterApiKey?: string;
  openRouterModel?: string;
  geminiApiKey?: string;
  geminiModel?: string;
  maxTokens?: number;
}

export interface GenerateQuizResult {
  quiz: QuizGenerationResponse;
  provider: AiProvider;
}

/** Generates a quiz via the AI router, validates against the Zod schema, and
 * retries once (feeding the validation error back) before giving up — matches
 * master prompt §5.4's "retry 1 ครั้งก่อน error" requirement literally. */
export async function generateQuiz(params: GenerateQuizParams, deps?: RouteChatDeps): Promise<GenerateQuizResult> {
  const result = await generateValidatedJson(
    {
      prompt: buildQuizGenerationPrompt(params),
      systemPrompt: QUIZ_SYSTEM,
      schema: quizGenerationResponseSchema,
      openRouterApiKey: params.openRouterApiKey,
      openRouterModel: params.openRouterModel,
      geminiApiKey: params.geminiApiKey,
      geminiModel: params.geminiModel,
      maxTokens: params.maxTokens ?? 4096,
    },
    deps,
  );
  return { quiz: result.data, provider: result.provider };
}
