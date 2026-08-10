"use client";

import { GlassPillSelector } from "@/components/glass/GlassPillSelector";

export interface Subject {
  id: string;
  name: string;
}

export function SubjectSelector({
  subjects,
  value,
  onChange,
}: {
  subjects: Subject[];
  value: string | null;
  onChange: (subjectId: string) => void;
}) {
  return (
    <GlassPillSelector
      options={subjects.map((s) => ({ id: s.id, label: s.name }))}
      value={value}
      onChange={onChange}
      className="px-1"
    />
  );
}
