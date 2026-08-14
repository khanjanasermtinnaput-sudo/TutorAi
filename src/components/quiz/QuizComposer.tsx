"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassPillSelector } from "@/components/glass/GlassPillSelector";
import { FormulaTextField } from "@/components/formula/FormulaTextField";
import type { Subject } from "@/components/chat/SubjectSelector";
import type { ChoiceKey, Choices } from "@/components/quiz/QuizQuestionCard";
import { quizQuestionSchema, type Difficulty } from "@/lib/quiz/schema";

const CHOICE_KEYS: ChoiceKey[] = ["A", "B", "C", "D"];

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "ง่าย" },
  { id: "medium", label: "ปานกลาง" },
  { id: "hard", label: "ยาก" },
];

interface QuestionDraft {
  question_text: string;
  choices: Choices;
  correct_choice: ChoiceKey | null;
  explanation: string;
}

function emptyDraft(): QuestionDraft {
  return { question_text: "", choices: { A: "", B: "", C: "", D: "" }, correct_choice: null, explanation: "" };
}

function draftError(draft: QuestionDraft): string | null {
  if (!draft.correct_choice) return "กรุณาเลือกคำตอบที่ถูกต้อง";
  const parsed = quizQuestionSchema.safeParse({ ...draft, correct_choice: draft.correct_choice });
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง";
  return null;
}

export function QuizComposer({ subjects, sessionId }: { subjects: Subject[]; sessionId: string | null }) {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [drafts, setDrafts] = useState<QuestionDraft[]>([emptyDraft()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateDraft(index: number, patch: Partial<QuestionDraft>) {
    setDrafts((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function updateChoice(index: number, key: ChoiceKey, text: string) {
    setDrafts((prev) => prev.map((d, i) => (i === index ? { ...d, choices: { ...d.choices, [key]: text } } : d)));
  }

  function removeDraft(index: number) {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  }

  const canSubmit =
    Boolean(subjectId) && topic.trim().length > 0 && drafts.length > 0 && drafts.every((d) => !draftError(d)) && !submitting;

  async function handleSubmit() {
    if (!subjectId || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId ?? undefined,
          subjectId,
          topic: topic.trim(),
          difficulty,
          questions: drafts.map((d) => ({ ...d, correct_choice: d.correct_choice })),
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message ?? "สร้างข้อสอบไม่สำเร็จ");
      router.push(`/quiz/${payload.quizId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 overflow-y-auto p-4">
      <h1 className="font-display text-heading-md font-semibold text-ink-primary">สร้างข้อสอบเอง</h1>

      <GlassCard className="flex flex-col gap-4 p-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-secondary">วิชา</label>
          <GlassPillSelector options={subjects.map((s) => ({ id: s.id, label: s.name }))} value={subjectId} onChange={setSubjectId} />
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
          <GlassPillSelector
            options={DIFFICULTIES.map((d) => ({ id: d.id, label: d.label }))}
            value={difficulty}
            onChange={(v) => setDifficulty(v as Difficulty)}
          />
        </div>
      </GlassCard>

      {drafts.map((draft, index) => {
        const err = draftError(draft);
        return (
          <GlassCard key={index} className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-medium text-ink-primary">ข้อที่ {index + 1}</h2>
              {drafts.length > 1 && (
                <button
                  type="button"
                  aria-label="ลบข้อนี้"
                  onClick={() => removeDraft(index)}
                  className="text-ink-muted hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <FormulaTextField
              id={`q-${index}-text`}
              label="คำถาม"
              value={draft.question_text}
              onChange={(v) => updateDraft(index, { question_text: v })}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CHOICE_KEYS.map((key) => (
                <FormulaTextField
                  key={key}
                  id={`q-${index}-choice-${key}`}
                  label={`ตัวเลือก ${key}`}
                  value={draft.choices[key]}
                  onChange={(v) => updateChoice(index, key, v)}
                  rows={2}
                />
              ))}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-secondary">คำตอบที่ถูกต้อง</label>
              <GlassPillSelector
                options={CHOICE_KEYS.map((k) => ({ id: k, label: k }))}
                value={draft.correct_choice}
                onChange={(v) => updateDraft(index, { correct_choice: v as ChoiceKey })}
              />
            </div>

            <FormulaTextField
              id={`q-${index}-explanation`}
              label="คำอธิบายเฉลย"
              value={draft.explanation}
              onChange={(v) => updateDraft(index, { explanation: v })}
              rows={3}
              minLength={40}
            />

            {err && <p className="text-sm text-error">{err}</p>}
          </GlassCard>
        );
      })}

      <GlassButton variant="glass" onClick={() => setDrafts((prev) => [...prev, emptyDraft()])} className="self-start">
        <Plus className="h-4 w-4" />
        เพิ่มคำถาม
      </GlassButton>

      {error && <p className="text-sm text-error">{error}</p>}

      <GlassButton onClick={handleSubmit} disabled={!canSubmit} loading={submitting} className="w-full">
        {submitting ? "กำลังสร้างข้อสอบ" : `สร้างข้อสอบ (${drafts.length} ข้อ)`}
      </GlassButton>
    </div>
  );
}
