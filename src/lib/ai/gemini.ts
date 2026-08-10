import { readSseDataLines } from "./sse";
import type { ChatMessage } from "./openrouter";

export interface GeminiStreamParams {
  apiKey: string;
  model: string;
  systemInstruction?: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
}

function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;
}

export async function* streamGeminiCompletion({
  apiKey,
  model,
  systemInstruction,
  messages,
  signal,
}: GeminiStreamParams): AsyncGenerator<string> {
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const res = await fetch(geminiUrl(model), {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...(systemInstruction ? { system_instruction: { parts: [{ text: systemInstruction }] } } : {}),
      contents,
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini request failed: ${res.status} ${detail}`.trim());
  }

  for await (const data of readSseDataLines(res.body)) {
    if (!data) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      continue;
    }
    const parts = (
      parsed as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
    )?.candidates?.[0]?.content?.parts;
    const text = parts?.map((p) => p.text ?? "").join("") ?? "";
    if (text.length > 0) yield text;
  }
}
