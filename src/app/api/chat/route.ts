import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { buildSystemPrompt } from "@/lib/ai/prompts/system-prompt";
import { routeChatCompletion, AllProvidersFailedError } from "@/lib/ai/ai-router";
import { generateSessionTitle } from "@/lib/ai/session-title";
import type { ChatMessage } from "@/lib/ai/openrouter";

const bodySchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().min(1).max(4000),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.issues }, { status: 400 });
  }
  const { sessionId, message } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: session, error: sessionError } = await supabase
    .from("chat_sessions")
    .select("id, subject_id, subjects(name)")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();
  if (sessionError || !session) {
    return NextResponse.json({ error: "session_not_found" }, { status: 404 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("nickname, birth_date, education_level")
    .eq("id", user.id)
    .single();
  if (profileError || !profile) {
    return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  }

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  const { error: insertUserError } = await supabase
    .from("chat_messages")
    .insert({ session_id: sessionId, role: "user", content: message });
  if (insertUserError) {
    return NextResponse.json({ error: "failed_to_save_message" }, { status: 500 });
  }

  const subjectName = (session as unknown as { subjects: { name: string } | null }).subjects?.name ?? null;
  const systemInstruction = buildSystemPrompt(profile, subjectName);

  const messages: ChatMessage[] = [
    ...(history ?? []).map((m) => ({ role: m.role as ChatMessage["role"], content: m.content })),
    { role: "user", content: message },
  ];

  let routed;
  try {
    routed = await routeChatCompletion({
      messages,
      systemInstruction,
      openRouterApiKey: process.env.OPENROUTER_API_KEY,
      openRouterModel: process.env.OPENROUTER_MODEL,
      geminiApiKey: process.env.GEMINI_API_KEY,
      geminiModel: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      maxTokens: 1024,
    });
  } catch (err) {
    if (err instanceof AllProvidersFailedError) {
      console.error("[TutorAI] both AI providers failed", err.openRouterError, err.geminiError);
      return NextResponse.json({ error: "ai_unavailable", message: "ระบบ AI ไม่พร้อมใช้งานในขณะนี้ กรุณาลองใหม่อีกครั้ง" }, { status: 502 });
    }
    throw err;
  }

  const { provider, chunks } = routed;
  const encoder = new TextEncoder();
  let fullText = "";

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await chunks.next();
        if (done) {
          await supabase
            .from("chat_messages")
            .insert({ session_id: sessionId, role: "assistant", content: fullText, ai_provider: provider });
          await supabase.from("usage_logs").insert({ user_id: user.id, action_type: "chat_message" });

          if ((history?.length ?? 0) === 0) {
            try {
              const title = await generateSessionTitle({
                userMessage: message,
                assistantReply: fullText,
                openRouterApiKey: process.env.OPENROUTER_API_KEY,
                openRouterModel: process.env.OPENROUTER_MODEL,
                geminiApiKey: process.env.GEMINI_API_KEY,
                geminiModel: process.env.GEMINI_MODEL || "gemini-3.6-flash",
              });
              if (title) {
                await supabase.from("chat_sessions").update({ title }).eq("id", sessionId);
              }
            } catch (err) {
              console.error("[TutorAI] session title generation failed", err);
            }
          }

          controller.close();
          return;
        }
        fullText += value;
        controller.enqueue(encoder.encode(value));
      } catch (err) {
        console.error("[TutorAI] stream error mid-response", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Ai-Provider": provider,
      "Cache-Control": "no-store",
    },
  });
}
