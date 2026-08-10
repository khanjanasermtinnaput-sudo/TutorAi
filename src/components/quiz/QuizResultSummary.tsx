"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { QuizQuestionCard, type Choices, type ChoiceKey } from "./QuizQuestionCard";

export interface QuizResultQuestion {
  id: string;
  question_text: string;
  choices: Choices;
  correct_choice: ChoiceKey;
  user_answer: ChoiceKey | null;
  explanation: string;
}

export function QuizResultSummary({
  score,
  total,
  questions,
}: {
  score: number;
  total: number;
  questions: QuizResultQuestion[];
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <GlassCard depth="top" radius="xl" className="p-8 text-center">
        <p className="text-sm text-ink-secondary">คะแนนของคุณ</p>
        <p className="mt-1 font-display text-6xl font-bold text-ink-primary">
          {score}
          <span className="text-2xl text-ink-muted"> / {total}</span>
        </p>
        <p className="mt-1 text-sm text-ink-secondary">{pct}%</p>
      </GlassCard>

      <div className="flex flex-col gap-4">
        {questions.map((q, i) => (
          <QuizQuestionCard
            key={q.id}
            mode="review"
            index={i}
            questionText={q.question_text}
            choices={q.choices}
            correctChoice={q.correct_choice}
            userAnswer={q.user_answer}
            explanation={q.explanation}
          />
        ))}
      </div>
    </div>
  );
}
