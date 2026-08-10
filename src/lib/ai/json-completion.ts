import type { z } from "zod";
import { routeChatCompletion, collectChunks, type RouteChatDeps, type AiProvider, type RouteChatParams } from "./ai-router";

function extractJson(text: string): string {
  // Strip ```json ... ``` fences in case the model ignores the "no markdown" instruction.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : text).trim();
}

export interface GenerateValidatedJsonParams<T> extends Omit<RouteChatParams, "messages" | "systemInstruction"> {
  prompt: string;
  systemPrompt: string;
  schema: z.ZodType<T>;
  maxAttempts?: number;
}

export interface GenerateValidatedJsonResult<T> {
  data: T;
  provider: AiProvider;
}

/** Shared "call the AI, parse JSON, validate against a Zod schema, retry once
 * with the validation error fed back" pattern — used by both quiz generation
 * and topic summaries, which differ only in their prompt/schema, not this
 * control flow. */
export async function generateValidatedJson<T>(
  params: GenerateValidatedJsonParams<T>,
  deps?: RouteChatDeps,
): Promise<GenerateValidatedJsonResult<T>> {
  const maxAttempts = params.maxAttempts ?? 2;
  let lastError = "";
  let lastProvider: AiProvider | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const systemInstruction =
      attempt === 0
        ? params.systemPrompt
        : `${params.systemPrompt}\n\nการตอบครั้งก่อนไม่ผ่านการตรวจสอบ: ${lastError}\nกรุณาตอบใหม่ให้ตรงตาม schema เท่านั้น`;

    const routed = await routeChatCompletion({ ...params, messages: [{ role: "user", content: params.prompt }], systemInstruction }, deps);
    lastProvider = routed.provider;
    const text = await collectChunks(routed.chunks);

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(extractJson(text));
    } catch {
      lastError = "response was not valid JSON";
      continue;
    }

    const result = params.schema.safeParse(parsedJson);
    if (result.success) {
      return { data: result.data, provider: routed.provider };
    }
    lastError = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
  }

  throw new Error(
    `AI failed to produce valid JSON after ${maxAttempts} attempts (provider: ${lastProvider}): ${lastError}`,
  );
}
