import { Flame } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { InlineMath } from "@/components/InlineMath";

export function FrequentlyTestedList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">จุดที่ออกข้อสอบบ่อย</h2>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <GlassCard key={i} tint="error" className="flex items-start gap-2 p-3">
            <FrequentlyTestedBadge />
            <span className="text-sm text-ink-primary">
              <InlineMath text={item} />
            </span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export function FrequentlyTestedBadge() {
  return (
    <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-warning-tint px-2 py-0.5 text-xs font-medium text-warning">
      <Flame className="h-3 w-3" />
      ออกสอบบ่อย
    </span>
  );
}
