"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { PLANS, type PlanTier } from "@/lib/stripe/plans";
import { cn } from "@/lib/utils/cn";

const TIER_ORDER: PlanTier[] = ["free", "pro", "max"];

export function BillingTierCards({ currentTier }: { currentTier: PlanTier }) {
  const [loadingTier, setLoadingTier] = useState<PlanTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade(tier: "pro" | "max") {
    setLoadingTier(tier);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.url) throw new Error(payload?.error ?? "ไม่สามารถเริ่มการชำระเงินได้");
      window.location.href = payload.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setLoadingTier(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TIER_ORDER.map((tier) => {
          const plan = PLANS[tier];
          const isCurrent = tier === currentTier;
          return (
            <GlassCard
              key={tier}
              depth={tier === "max" ? "top" : "mid"}
              className={cn("flex flex-col gap-3 p-6", isCurrent && "ring-2 ring-accent-primary")}
            >
              <div>
                <p className="font-display text-heading-md font-semibold text-ink-primary">{plan.name}</p>
                <p className="mt-1 text-2xl font-bold text-ink-primary">
                  {plan.price === 0 ? "ฟรี" : `฿${plan.price}`}
                  {plan.price > 0 && <span className="text-sm font-normal text-ink-muted">/เดือน</span>}
                </p>
              </div>

              <ul className="flex flex-1 flex-col gap-1.5 text-sm text-ink-secondary">
                {/* TODO: feature list per tier — pending spec */}
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success" /> แชทกับติวเตอร์ AI
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success" /> สร้างข้อสอบ
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success" /> สรุปเนื้อหาเชิงลึก
                </li>
              </ul>

              {tier === "free" ? (
                <GlassButton variant="ghost" disabled className="w-full">
                  {isCurrent ? "แพ็กเกจปัจจุบัน" : "ฟรี"}
                </GlassButton>
              ) : (
                <GlassButton
                  onClick={() => handleUpgrade(tier)}
                  disabled={isCurrent || loadingTier !== null}
                  className="w-full"
                >
                  {isCurrent ? "แพ็กเกจปัจจุบัน" : loadingTier === tier ? "กำลังไปหน้าชำระเงิน..." : `อัปเกรดเป็น ${plan.name}`}
                </GlassButton>
              )}
            </GlassCard>
          );
        })}
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
