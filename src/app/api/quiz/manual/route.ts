import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { difficultySchema, quizQuestionSchema } from "@/lib/quiz/schema";

const bodySchema = z.object({
  sessionId: z.string().uuid().optional(),
  subjectId: z.string().uuid(),
  topic: z.string().min(1).max(200),
  difficulty: difficultySchema,
  questions: z.array(quizQuestionSchema).min(1).max(20),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.issues }, { status: 400 });
  }
  const { sessionId, subjectId, topic, difficulty, questions } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: subject } = await supabase.from("subjects").select("id").eq("id", subjectId).single();
  if (!subject) return NextResponse.json({ error: "subject_not_found" }, { status: 404 });

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      user_id: user.id,
      session_id: sessionId ?? null,
      subject_id: subjectId,
      topic,
      difficulty,
      question_count: questions.length,
      status: "in_progress",
      source: "manual",
    })
    .select("id")
    .single();
  if (quizError || !quiz) {
    return NextResponse.json({ error: "failed_to_save_quiz" }, { status: 500 });
  }

  const { error: questionsError } = await supabase.from("quiz_questions").insert(
    questions.map((q, index) => ({
      quiz_id: quiz.id,
      order_index: index,
      question_text: q.question_text,
      choices: q.choices,
      correct_choice: q.correct_choice,
      explanation: q.explanation,
    })),
  );
  if (questionsError) {
    return NextResponse.json({ error: "failed_to_save_questions" }, { status: 500 });
  }

  return NextResponse.json({ quizId: quiz.id });
}
