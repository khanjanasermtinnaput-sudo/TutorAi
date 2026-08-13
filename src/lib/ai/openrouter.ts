import { readSseDataLines } from "./sse";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterStreamParams {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function* streamOpenRouterCompletion({
  apiKey,
  model,
  messages,
  temperature = 0.7,
  maxTokens = 2048,
  signal,
}: OpenRouterStreamParams): AsyncGenerator<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens, stream: true }),
    signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenRouter request failed: ${res.status} ${detail}`.trim());
  }

  for await (const data of readSseDataLines(res.body)) {
    if (data === "[DONE]") return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      continue; // malformed keep-alive/comment line — skip, don't crash the stream
    }
    const delta = (parsed as { choices?: { delta?: { content?: string } }[] })?.choices?.[0]?.delta?.content;
    if (typeof delta === "string" && delta.length > 0) yield delta;
  }
}
