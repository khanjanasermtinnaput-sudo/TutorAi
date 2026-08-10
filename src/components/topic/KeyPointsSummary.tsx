import { GlassCard } from "@/components/glass/GlassCard";
import { InlineMath } from "@/components/InlineMath";

export function KeyPointsSummary({ points }: { points: string[] }) {
  return (
    <GlassCard depth="deep" className="p-6">
      <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">ใจความสำคัญ</h2>
      <ul className="flex flex-col gap-2">
        {points.map((point, i) => (
          <li key={i} className="flex gap-2 text-ink-secondary">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
            <InlineMath text={point} />
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
