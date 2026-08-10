import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/chat/AppShell";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("id, title")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const { data: profile } = await supabase.from("profiles").select("nickname").eq("id", user.id).single();

  return (
    <AppShell sessions={sessions ?? []} nickname={profile?.nickname ?? null}>
      {children}
    </AppShell>
  );
}
