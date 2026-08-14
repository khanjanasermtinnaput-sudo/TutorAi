import { cn } from "@/lib/utils/cn";

/** Inline blinking dot appended after content while tokens are still
 * arriving — Gemini's in-progress cursor, so a streaming reply reads as
 * "still writing" rather than a paragraph that just stopped mid-thought. */
export function StreamingCursor({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-2 w-2 translate-y-[1px] rounded-full bg-accent-primary animate-[cursor-blink_1s_ease-in-out_infinite]",
        className,
      )}
    />
  );
}
