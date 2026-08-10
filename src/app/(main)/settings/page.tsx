import Link from "next/link";
import { redirect } from "next/navigation";
import { CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/GlassCard";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, email, education_level, subscription_tier")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <h1 className="font-display text-heading-lg font-bold text-ink-primary">ตั้งค่า</h1>

      <GlassCard className="p-6">
        <p className="text-sm text-ink-secondary">ชื่อเล่น</p>
        <p className="text-ink-primary">{profile?.nickname}</p>
        <p className="mt-3 text-sm text-ink-secondary">อีเมล</p>
        <p className="text-ink-primary">{profile?.email}</p>
        <p className="mt-3 text-sm text-ink-secondary">ระดับชั้น</p>
        <p className="text-ink-primary">{profile?.education_level}</p>
      </GlassCard>

      <Link href="/settings/billing" className="block">
        <GlassCard className="flex items-center justify-between p-4">
          <span className="flex items-center gap-2 text-ink-primary">
            <CreditCard className="h-4 w-4" />
            แพ็กเกจสมาชิก
          </span>
          <span className="text-sm text-ink-secondary capitalize">{profile?.subscription_tier ?? "free"}</span>
        </GlassCard>
      </Link>
    </div>
  );
}
