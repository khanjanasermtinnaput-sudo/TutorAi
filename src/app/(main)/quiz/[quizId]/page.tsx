import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuizTaker } from "@/components/quiz/QuizTaker";

export default async function QuizPage({ params }: { params: { quizId: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, status")
    .eq("id", params.quizId)
    .eq("user_id", user.id)
    .single();
  if (!quiz) notFound();
  if (quiz.status === "completed") redirect(`/quiz/${quiz.id}/result`);

  // Correct answers / explanations are deliberately not selected here — the
  // taking page must not send them to the client before submission.
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, question_text, choices")
    .eq("quiz_id", quiz.id)
    .order("order_index", { ascending: true });

  if (!questions || questions.length === 0) notFound();

  return (
    <QuizTaker
      quizId={quiz.id}
      questions={questions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        choices: q.choices as never,
      }))}
    />
  );
}
