import { routeChatCompletion, collectChunks, type RouteChatDeps } from "./ai-router";

const TITLE_SYSTEM_PROMPT =
  "ตั้งชื่อหัวข้อบทสนทนานี้แบบสั้นๆ 3-6 คำ ภาษาไทย ห้ามใส่เครื่องหมายคำพูดหรือจุด ตอบแค่ชื่อหัวข้อเท่านั้น ห้ามมีคำอธิบายเพิ่ม";

const MAX_TITLE_LENGTH = 60;

function sanitizeTitle(raw: string): string | null {
  const cleaned = raw
    .replace(/^["'“”‘’\s]+|["'“”‘’\s.]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;
  return cleaned.length > MAX_TITLE_LENGTH ? cleaned.slice(0, MAX_TITLE_LENGTH).trim() : cleaned;
}

export interface GenerateSessionTitleParams {
  userMessage: string;
  assistantReply: string;
  openRouterApiKey?: string;
  openRouterModel?: string;
  geminiApiKey?: string;
  geminiModel?: string;
}

/** Generates a short title for a chat session from its first exchange.
 * Never throws — a title is a nice-to-have, not something that should ever
 * take down the chat response it's derived from. */
export async function generateSessionTitle(
  params: GenerateSessionTitleParams,
  deps?: RouteChatDeps,
): Promise<string | null> {
  try {
    const routed = await routeChatCompletion(
      {
        messages: [{ role: "user", content: `คำถาม: ${params.userMessage}\n\nคำตอบ: ${params.assistantReply}` }],
        systemInstruction: TITLE_SYSTEM_PROMPT,
        openRouterApiKey: params.openRouterApiKey,
        openRouterModel: params.openRouterModel,
        geminiApiKey: params.geminiApiKey,
        geminiModel: params.geminiModel,
        maxTokens: 30,
      },
      deps,
    );
    const text = await collectChunks(routed.chunks);
    return sanitizeTitle(text);
  } catch {
    return null;
  }
}
