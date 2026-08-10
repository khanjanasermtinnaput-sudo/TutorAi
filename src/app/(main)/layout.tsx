import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { SignOutButton } from "@/components/chat/SignOutButton";

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
    <div className="flex h-screen gap-3 p-3">
      <ChatSidebar sessions={sessions ?? []} />
      <div className="flex flex-1 flex-col gap-3">
        <header className="glass-surface flex items-center justify-between rounded-lg px-4 py-2.5">
          <span className="font-display font-semibold text-ink-primary">Tutor AI</span>
          <div className="flex items-center gap-3">
            {profile?.nickname && <span className="text-sm text-ink-secondary">{profile.nickname}</span>}
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
