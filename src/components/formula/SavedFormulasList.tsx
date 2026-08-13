"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { InlineMath } from "@/components/InlineMath";

export interface SavedFormula {
  id: string;
  latex: string;
  label: string | null;
  source: string;
  created_at: string;
}

export function SavedFormulasList({ initialFormulas }: { initialFormulas: SavedFormula[] }) {
  const [formulas, setFormulas] = useState(initialFormulas);

  async function remove(id: string) {
    setFormulas((prev) => prev.filter((f) => f.id !== id));
    const res = await fetch(`/api/formulas/${id}`, { method: "DELETE" });
    if (!res.ok) {
      // Restore on failure — best-effort, re-fetching the exact original order isn't critical here.
      setFormulas(initialFormulas);
    }
  }

  if (formulas.length === 0) {
    return <p className="text-sm text-ink-secondary">ยังไม่มีสูตรที่บันทึกไว้</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {formulas.map((f) => (
        <GlassCard key={f.id} className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0">
            {f.label && <p className="mb-1 text-sm font-medium text-ink-secondary">{f.label}</p>}
            <InlineMath text={`$${f.latex}$`} className="text-ink-primary" />
          </div>
          <button
            type="button"
            aria-label="ลบสูตรนี้"
            onClick={() => remove(f.id)}
            className="shrink-0 text-ink-muted hover:text-error"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </GlassCard>
      ))}
    </div>
  );
}
