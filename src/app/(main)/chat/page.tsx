import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ChatIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: latest } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest) redirect(`/chat/${latest.id}`);

  const { data: created, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: user.id })
    .select("id")
    .single();
  if (error || !created) throw new Error("สร้างแชทใหม่ไม่สำเร็จ");

  redirect(`/chat/${created.id}`);
}
