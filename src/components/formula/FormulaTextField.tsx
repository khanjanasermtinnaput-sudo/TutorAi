"use client";

import { useRef } from "react";
import { FormulaToolbar } from "./FormulaToolbar";
import { InlineMath } from "@/components/InlineMath";

export function FormulaTextField({
  id,
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  minLength,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
  minLength?: number;
  error?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-secondary">
        {label}
      </label>
      <textarea
        id={id}
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border border-glass-border bg-canvas-elevated px-3 py-2 text-ink-primary outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      />
      <FormulaToolbar textareaRef={textareaRef} value={value} onChange={onChange} source="manual" className="mt-1.5" />
      {value.trim() && (
        <div className="glass-surface mt-1.5 rounded-md px-3 py-2 text-sm text-ink-primary">
          <span className="mr-2 text-xs text-ink-muted">ตัวอย่าง:</span>
          <InlineMath text={value} />
        </div>
      )}
      <div className="mt-1 flex items-center justify-between">
        {error ? (
          <p className="text-xs text-error">{error}</p>
        ) : (
          <span />
        )}
        {typeof minLength === "number" && (
          <span className="text-xs text-ink-muted">
            {value.length}/{minLength} ตัวอักษรขั้นต่ำ
          </span>
        )}
      </div>
    </div>
  );
}
