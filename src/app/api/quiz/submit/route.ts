import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  quizId: z.string().uuid(),
  answers: z.array(z.object({ questionId: z.string().uuid(), choice: z.enum(["A", "B", "C", "D"]) })).min(1),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.issues }, { status: 400 });
  }
  const { quizId, answers } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, status")
    .eq("id", quizId)
    .eq("user_id", user.id)
    .single();
  if (!quiz) return NextResponse.json({ error: "quiz_not_found" }, { status: 404 });
  if (quiz.status === "completed") {
    return NextResponse.json({ error: "already_submitted" }, { status: 409 });
  }

  const { data: questions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select("id, correct_choice")
    .eq("quiz_id", quizId);
  if (questionsError || !questions) {
    return NextResponse.json({ error: "failed_to_load_questions" }, { status: 500 });
  }

  // Scored server-side only, against the DB's correct_choice — the client's
  // reported answers are never trusted for correctness, only for which
  // choice the student picked.
  const correctByQuestion = new Map(questions.map((q) => [q.id, q.correct_choice]));
  let score = 0;
  const updates = answers
    .filter((a) => correctByQuestion.has(a.questionId))
    .map((a) => {
      const isCorrect = correctByQuestion.get(a.questionId) === a.choice;
      if (isCorrect) score += 1;
      return { id: a.questionId, user_answer: a.choice, is_correct: isCorrect };
    });

  await Promise.all(
    updates.map((u) =>
      supabase
        .from("quiz_questions")
        .update({ user_answer: u.user_answer, is_correct: u.is_correct })
        .eq("id", u.id),
    ),
  );

  const { error: quizUpdateError } = await supabase
    .from("quizzes")
    .update({ status: "completed", score, completed_at: new Date().toISOString() })
    .eq("id", quizId);
  if (quizUpdateError) {
    return NextResponse.json({ error: "failed_to_save_score" }, { status: 500 });
  }

  return NextResponse.json({ score, total: questions.length });
}
