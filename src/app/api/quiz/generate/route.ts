import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateQuiz } from "@/lib/ai/quiz-generator";
import { difficultySchema } from "@/lib/quiz/schema";

const bodySchema = z.object({
  sessionId: z.string().uuid().optional(),
  subjectId: z.string().uuid(),
  topic: z.string().min(1).max(200),
  difficulty: difficultySchema,
  questionCount: z.number().int().min(10).max(20),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.issues }, { status: 400 });
  }
  const { sessionId, subjectId, topic, difficulty, questionCount } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [{ data: profile }, { data: subject }] = await Promise.all([
    supabase.from("profiles").select("education_level").eq("id", user.id).single(),
    supabase.from("subjects").select("name").eq("id", subjectId).single(),
  ]);
  if (!profile) return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  if (!subject) return NextResponse.json({ error: "subject_not_found" }, { status: 404 });

  let generated;
  try {
    generated = await generateQuiz({
      subjectName: subject.name,
      educationLevel: profile.education_level,
      topic,
      difficulty,
      questionCount,
      openRouterApiKey: process.env.OPENROUTER_API_KEY,
      openRouterModel: process.env.OPENROUTER_MODEL,
      geminiApiKey: process.env.GEMINI_API_KEY,
      geminiModel: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    });
  } catch (err) {
    console.error("[TutorAI] quiz generation failed", err);
    return NextResponse.json(
      { error: "quiz_generation_failed", message: "สร้างข้อสอบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: 502 },
    );
  }

  // The model can ignore the requested count even with a strict prompt —
  // quizzes.question_count has a DB check (10-20); fail cleanly before
  // inserting rather than surfacing a raw constraint-violation error.
  const actualCount = generated.quiz.questions.length;
  if (actualCount < 10 || actualCount > 20) {
    console.error(`[TutorAI] quiz generation returned ${actualCount} questions (requested ${questionCount})`);
    return NextResponse.json(
      { error: "quiz_generation_failed", message: "AI สร้างจำนวนข้อไม่ตรงตามที่กำหนด กรุณาลองใหม่อีกครั้ง" },
      { status: 502 },
    );
  }

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      user_id: user.id,
      session_id: sessionId ?? null,
      subject_id: subjectId,
      topic,
      difficulty,
      question_count: generated.quiz.questions.length,
      status: "in_progress",
    })
    .select("id")
    .single();
  if (quizError || !quiz) {
    return NextResponse.json({ error: "failed_to_save_quiz" }, { status: 500 });
  }

  const { error: questionsError } = await supabase.from("quiz_questions").insert(
    generated.quiz.questions.map((q, index) => ({
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

  await supabase.from("usage_logs").insert({ user_id: user.id, action_type: "quiz_generated" });

  return NextResponse.json({ quizId: quiz.id });
}
