"use client";

import { GlassButton } from "@/components/glass/GlassButton";
import { EDUCATION_LEVELS } from "@/lib/utils/education-level-map";
import { cn } from "@/lib/utils/cn";

const GROUPS = ["ประถมศึกษา", "มัธยมศึกษา", "อาชีวศึกษา", "อุดมศึกษา"] as const;

export function EducationLevelStep({
  value,
  onChange,
  onSubmit,
  onBack,
  submitting,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-ink-secondary">ระดับชั้นการศึกษาของคุณ</p>
      <div className="max-h-72 overflow-y-auto pr-1">
        {GROUPS.map((group) => (
          <div key={group} className="mb-3">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-muted">{group}</p>
            <div className="grid grid-cols-3 gap-2">
              {EDUCATION_LEVELS.filter((l) => l.group === group).map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => onChange(level.value)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm transition-colors",
                    value === level.value
                      ? "border-accent-primary bg-gradient-liquid text-white"
                      : "border-glass-border bg-canvas-elevated text-ink-secondary hover:text-ink-primary",
                  )}
                >
                  {level.value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <GlassButton type="button" variant="ghost" onClick={onBack} disabled={submitting}>
          ย้อนกลับ
        </GlassButton>
        <GlassButton type="button" onClick={onSubmit} disabled={!value || submitting}>
          {submitting ? "กำลังบันทึก..." : "เริ่มใช้งาน"}
        </GlassButton>
      </div>
    </div>
  );
}
