"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/glass/GlassButton";
import { QuizProgressBar } from "./QuizProgressBar";
import { QuizQuestionCard, type Choices, type ChoiceKey } from "./QuizQuestionCard";

export interface QuizTakerQuestion {
  id: string;
  question_text: string;
  choices: Choices;
}

export function QuizTaker({ quizId, questions }: { quizId: string; questions: QuizTakerQuestion[] }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, ChoiceKey>>({});
  const [viewMode, setViewMode] = useState<"single" | "all">("single");
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          answers: Object.entries(answers).map(([questionId, choice]) => ({ questionId, choice })),
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message ?? "ส่งคำตอบไม่สำเร็จ");
      }
      router.push(`/quiz/${quizId}/result`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <QuizProgressBar answered={answeredCount} total={questions.length} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setViewMode((v) => (v === "single" ? "all" : "single"))}
          className="text-sm text-accent-primary"
        >
          {viewMode === "single" ? "ดูทั้งหมด" : "ดูทีละข้อ"}
        </button>
      </div>

      {viewMode === "all" ? (
        <div className="flex flex-col gap-4">
          {questions.map((q, i) => (
            <QuizQuestionCard
              key={q.id}
              mode="answer"
              index={i}
              questionText={q.question_text}
              choices={q.choices}
              selected={answers[q.id] ?? null}
              onSelect={(choice) => setAnswers((prev) => ({ ...prev, [q.id]: choice }))}
            />
          ))}
        </div>
      ) : (
        <>
          <QuizQuestionCard
            mode="answer"
            index={current}
            questionText={questions[current].question_text}
            choices={questions[current].choices}
            selected={answers[questions[current].id] ?? null}
            onSelect={(choice) => setAnswers((prev) => ({ ...prev, [questions[current].id]: choice }))}
          />
          <div className="flex justify-between">
            <GlassButton variant="ghost" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
              ข้อก่อนหน้า
            </GlassButton>
            <GlassButton
              variant="ghost"
              onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              disabled={current === questions.length - 1}
            >
              ข้อถัดไป
            </GlassButton>
          </div>
        </>
      )}

      {error && <p className="text-sm text-error">{error}</p>}

      <GlassButton onClick={handleSubmit} disabled={!allAnswered || submitting} className="w-full">
        {submitting ? "กำลังส่งคำตอบ..." : allAnswered ? "ส่งคำตอบ" : `เหลืออีก ${questions.length - answeredCount} ข้อ`}
      </GlassButton>
    </div>
  );
}
