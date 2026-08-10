"use client";

import * as Label from "@radix-ui/react-label";
import { GlassButton } from "@/components/glass/GlassButton";

export function NicknameStep({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const trimmed = value.trim();
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (trimmed) onNext();
      }}
    >
      <div className="flex flex-col gap-2">
        <Label.Root htmlFor="nickname" className="text-sm font-medium text-ink-secondary">
          ให้เราเรียกคุณว่าอะไรดี?
        </Label.Root>
        <input
          id="nickname"
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={40}
          placeholder="ชื่อเล่น"
          className="h-12 rounded-md border border-glass-border bg-canvas-elevated px-4 text-ink-primary outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        />
      </div>
      <GlassButton type="submit" disabled={!trimmed} className="self-end">
        ถัดไป
      </GlassButton>
    </form>
  );
}
