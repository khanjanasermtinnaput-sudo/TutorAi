import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default async function ChatSessionPage({ params }: { params: { sessionId: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id, subject_id")
    .eq("id", params.sessionId)
    .eq("user_id", user.id)
    .single();
  if (!session) notFound();

  const [{ data: subjects }, { data: messages }] = await Promise.all([
    supabase.from("subjects").select("id, name").order("sort_order", { ascending: true }),
    supabase
      .from("chat_messages")
      .select("id, role, content, citations")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <ChatWindow
      sessionId={session.id}
      subjects={subjects ?? []}
      initialSubjectId={session.subject_id}
      initialMessages={(messages ?? []).map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        citations: m.citations as never,
      }))}
    />
  );
}
