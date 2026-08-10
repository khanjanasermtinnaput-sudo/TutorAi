"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { MessageBubble, type Citation } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { SubjectSelector, type Subject } from "./SubjectSelector";
import { GlassFab } from "@/components/glass/GlassFab";
import { createClient } from "@/lib/supabase/client";

export interface ChatMessageView {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[] | null;
}

export function ChatWindow({
  sessionId,
  subjects,
  initialSubjectId,
  initialMessages,
}: {
  sessionId: string;
  subjects: Subject[];
  initialSubjectId: string | null;
  initialMessages: ChatMessageView[];
}) {
  const [messages, setMessages] = useState<ChatMessageView[]>(initialMessages);
  const [subjectId, setSubjectId] = useState<string | null>(initialSubjectId);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubjectChange(id: string) {
    setSubjectId(id);
    const supabase = createClient();
    await supabase.from("chat_sessions").update({ subject_id: id }).eq("id", sessionId);
  }

  async function handleSend(message: string) {
    setError(null);
    const userMsg: ChatMessageView = { id: `local-${Date.now()}`, role: "user", content: message };
    const assistantId = `local-${Date.now()}-assistant`;
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message }),
      });

      if (!res.ok || !res.body) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message ?? "เกิดข้อผิดพลาดในการเชื่อมต่อ AI");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <SubjectSelector subjects={subjects} value={subjectId} onChange={handleSubjectChange} />

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-1 py-2">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} citations={m.citations} />
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-1 text-sm text-error">{error}</p>}

      <div className="relative">
        <ChatInput onSend={handleSend} disabled={streaming} />
        <div className="absolute -top-20 right-0">
          {/* Wired to QuizGeneratorModal in Phase 5 */}
          <GlassFab icon={<Sparkles className="h-5 w-5" />} label="สร้างข้อสอบ" disabled />
        </div>
      </div>
    </div>
  );
}
