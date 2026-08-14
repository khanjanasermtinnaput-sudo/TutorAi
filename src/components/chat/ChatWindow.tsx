"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, BookOpen } from "lucide-react";
import { MessageBubble, type Citation } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { SubjectSelector, type Subject } from "./SubjectSelector";
import { GlassFab } from "@/components/glass/GlassFab";
import { QuizGeneratorModal } from "@/components/quiz/QuizGeneratorModal";
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
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageView[]>(initialMessages);
  const [subjectId, setSubjectId] = useState<string | null>(initialSubjectId);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Simple auto-suggest: the student's most recent message, as a topic starting point.
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content;

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
    // The server generates a real session title from the first exchange —
    // refresh afterward so the sidebar (a Server Component) picks it up
    // instead of showing "แชทใหม่" until the next full navigation.
    const isFirstMessage = messages.length === 0;
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
      if (isFirstMessage) router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <SubjectSelector subjects={subjects} value={subjectId} onChange={handleSubjectChange} />
        {subjectId && lastUserMessage && (
          <Link
            href={`/topic/${subjectId}/${encodeURIComponent(lastUserMessage.slice(0, 100))}`}
            className="glass-surface flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-secondary hover:text-accent-primary"
          >
            <BookOpen className="h-4 w-4" />
            ดูสรุปเรื่องนี้แบบละเอียด
          </Link>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-1 py-2">
        {messages.map((m, i) => {
          const isLastAssistant = streaming && i === messages.length - 1 && m.role === "assistant";
          const streamState = !isLastAssistant ? "idle" : m.content === "" ? "thinking" : "streaming";
          return (
            <MessageBubble key={m.id} role={m.role} content={m.content} citations={m.citations} streamState={streamState} />
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-1 text-sm text-error">{error}</p>}

      <div className="relative">
        <ChatInput onSend={handleSend} disabled={streaming} />
        <div className="absolute -top-20 right-0">
          <GlassFab
            icon={<Sparkles className="h-5 w-5" />}
            label="สร้างข้อสอบ"
            onClick={() => setQuizModalOpen(true)}
          />
        </div>
      </div>

      <QuizGeneratorModal
        open={quizModalOpen}
        onOpenChange={setQuizModalOpen}
        subjects={subjects}
        initialSubjectId={subjectId}
        suggestedTopic={lastUserMessage}
        sessionId={sessionId}
      />
    </div>
  );
}
