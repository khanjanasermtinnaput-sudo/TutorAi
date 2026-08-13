import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuizComposer } from "@/components/quiz/QuizComposer";

export default async function QuizNewPage({ searchParams }: { searchParams: { sessionId?: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name")
    .order("sort_order", { ascending: true });

  return <QuizComposer subjects={subjects ?? []} sessionId={searchParams.sessionId ?? null} />;
}
