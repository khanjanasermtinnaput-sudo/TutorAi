"use client";

import * as Label from "@radix-ui/react-label";
import { GlassButton } from "@/components/glass/GlassButton";
import { calculateAge } from "@/lib/utils/age-calculator";

const MIN_AGE = 3;
const MAX_AGE = 100;

export function BirthdateStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const age = value ? calculateAge(value) : null;
  const isValid = value !== "" && age !== null && age >= MIN_AGE && age <= MAX_AGE && new Date(value) <= new Date();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) onNext();
      }}
    >
      <div className="flex flex-col gap-2">
        <Label.Root htmlFor="birth-date" className="text-sm font-medium text-ink-secondary">
          วันเดือนปีเกิดของคุณ
        </Label.Root>
        <input
          id="birth-date"
          type="date"
          autoFocus
          value={value}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 rounded-md border border-glass-border bg-canvas-elevated px-4 text-ink-primary outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        />
        {value && !isValid && (
          <p className="text-sm text-error">กรุณาเลือกวันเกิดที่ถูกต้อง</p>
        )}
        {isValid && <p className="text-sm text-ink-muted">อายุ {age} ปี</p>}
      </div>
      <div className="flex justify-between">
        <GlassButton type="button" variant="ghost" onClick={onBack}>
          ย้อนกลับ
        </GlassButton>
        <GlassButton type="submit" disabled={!isValid}>
          ถัดไป
        </GlassButton>
      </div>
    </form>
  );
}
