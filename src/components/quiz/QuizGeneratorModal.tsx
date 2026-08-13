"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassModal } from "@/components/glass/GlassModal";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassPillSelector } from "@/components/glass/GlassPillSelector";
import type { Difficulty } from "@/lib/quiz/schema";
import type { Subject } from "@/components/chat/SubjectSelector";

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "ง่าย" },
  { id: "medium", label: "ปานกลาง" },
  { id: "hard", label: "ยาก" },
];

export function QuizGeneratorModal({
  open,
  onOpenChange,
  subjects,
  initialSubjectId,
  suggestedTopic,
  sessionId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjects: Subject[];
  initialSubjectId: string | null;
  suggestedTopic?: string;
  sessionId: string;
}) {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState<string | null>(initialSubjectId);
  const [topic, setTopic] = useState(suggestedTopic ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = Boolean(subjectId) && topic.trim().length > 0 && !submitting;

  async function handleSubmit() {
    if (!subjectId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, subjectId, topic: topic.trim(), difficulty, questionCount }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message ?? "สร้างข้อสอบไม่สำเร็จ");
      onOpenChange(false);
      router.push(`/quiz/${payload.quizId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassModal open={open} onOpenChange={onOpenChange} title="สร้างข้อสอบ" description="กำหนดหัวข้อและระดับความยากของข้อสอบ">
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-secondary">วิชา</label>
          <GlassPillSelector
            options={subjects.map((s) => ({ id: s.id, label: s.name }))}
            value={subjectId}
            onChange={setSubjectId}
          />
        </div>

        <div>
          <label htmlFor="quiz-topic" className="mb-1.5 block text-sm font-medium text-ink-secondary">
            หัวข้อ / บทที่ต้องการ
          </label>
          <input
            id="quiz-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="เช่น อนุพันธ์, สมการกำลังสอง"
            className="h-11 w-full rounded-md border border-glass-border bg-canvas-elevated px-3 text-ink-primary outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-secondary">ระดับความยาก</label>
          <GlassPillSelector options={DIFFICULTIES.map((d) => ({ id: d.id, label: d.label }))} value={difficulty} onChange={(v) => setDifficulty(v as Difficulty)} />
        </div>

        <div>
          <label htmlFor="quiz-count" className="mb-1.5 block text-sm font-medium text-ink-secondary">
            จำนวนข้อ: {questionCount}
          </label>
          <input
            id="quiz-count"
            type="range"
            min={10}
            max={20}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full accent-accent-primary"
          />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <GlassButton onClick={handleSubmit} disabled={!canSubmit} className="w-full">
          {submitting ? "กำลังสร้างข้อสอบ..." : "สร้างข้อสอบ"}
        </GlassButton>

        <Link
          href={`/quiz/new?sessionId=${sessionId}`}
          onClick={() => onOpenChange(false)}
          className="text-center text-sm text-ink-secondary hover:text-accent-primary"
        >
          หรือสร้างข้อสอบเอง
        </Link>
      </div>
    </GlassModal>
  );
}
