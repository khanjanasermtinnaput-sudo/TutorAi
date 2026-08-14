"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createChatSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: user.id })
    .select("id")
    .single();

  if (error || !data) throw new Error("สร้างแชทใหม่ไม่สำเร็จ");
  redirect(`/chat/${data.id}`);
}

export async function deleteChatSession(formData: FormData) {
  const sessionId = formData.get("sessionId");
  const redirectTo = formData.get("redirectTo");
  if (typeof sessionId !== "string") throw new Error("ไม่พบแชทที่ต้องการลบ");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId).eq("user_id", user.id);
  if (error) throw new Error("ลบแชทไม่สำเร็จ");

  if (typeof redirectTo === "string" && redirectTo) {
    redirect(redirectTo);
  }
  revalidatePath("/", "layout");
}
