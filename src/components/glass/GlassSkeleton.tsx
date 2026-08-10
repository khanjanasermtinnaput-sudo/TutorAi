import { cn } from "@/lib/utils/cn";

/** Loading placeholder — a light band sweeps across the glass surface
 * (master prompt §9 Phase 8: "shimmer เป็นเงาไหลผ่านผิวกระจก ไม่ใช่ grey bar
 * ธรรมดา"), not a flat grey bar. Respects prefers-reduced-motion via the
 * global rule in globals.css that collapses all animation durations. */
export function GlassSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass-surface relative overflow-hidden rounded-md", className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>
  );
}
