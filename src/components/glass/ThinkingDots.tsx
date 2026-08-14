import { cn } from "@/lib/utils/cn";

/** Pre-response loader — three dots pulsing in sequence, one accent color.
 * Shown for the gap between sending a message and the first streamed token
 * (Gemini's "thinking" indicator), not a spinner or skeleton. */
export function ThinkingDots({ className }: { className?: string }) {
  return (
    <span role="status" aria-label="กำลังคิด" className={cn("inline-flex items-center gap-1 py-1", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-[thinking-dot_1.1s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
