import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BillingTierCards } from "@/components/settings/BillingTierCards";
import type { PlanTier } from "@/lib/stripe/plans";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
      <h1 className="font-display text-heading-lg font-bold text-ink-primary">แพ็กเกจสมาชิก</h1>
      <BillingTierCards currentTier={(profile?.subscription_tier as PlanTier) ?? "free"} />
    </div>
  );
}
