import { GlassCard } from "@/components/glass/GlassCard";
import { InlineMath } from "@/components/InlineMath";
import type { Formula } from "@/lib/topic-summary/schema";

export function FormulaList({ formulas }: { formulas: Formula[] }) {
  if (formulas.length === 0) return null;
  return (
    <div>
      <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">สูตรที่เกี่ยวข้อง</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {formulas.map((f, i) => (
          <GlassCard key={i} depth="top" className="p-4">
            <p className="font-display font-medium text-ink-primary">{f.name}</p>
            <p className="mt-2 text-lg text-accent-primary">
              <InlineMath text={f.formula} />
            </p>
            <p className="mt-2 text-sm text-ink-secondary">{f.when_to_use}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
