import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuizResultSummary } from "@/components/quiz/QuizResultSummary";

export default async function QuizResultPage({ params }: { params: { quizId: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, status, score, question_count")
    .eq("id", params.quizId)
    .eq("user_id", user.id)
    .single();
  if (!quiz) notFound();
  if (quiz.status !== "completed") redirect(`/quiz/${quiz.id}`);

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, question_text, choices, correct_choice, user_answer, explanation")
    .eq("quiz_id", quiz.id)
    .order("order_index", { ascending: true });

  if (!questions) notFound();

  return (
    <QuizResultSummary
      score={quiz.score ?? 0}
      total={quiz.question_count}
      questions={questions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        choices: q.choices as never,
        correct_choice: q.correct_choice as never,
        user_answer: q.user_answer as never,
        explanation: q.explanation,
      }))}
    />
  );
}
