"use client";

import { useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { GlassModal } from "@/components/glass/GlassModal";
import { InlineMath } from "@/components/InlineMath";
import { extractLatexSnippets } from "@/lib/formula/extractLatexSnippets";
import { cn } from "@/lib/utils/cn";

export function SaveFormulaButton({
  text,
  source,
  className,
}: {
  text: string;
  source: "chat" | "quiz" | "manual";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [savedLatex, setSavedLatex] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<string | null>(null);
  const [failedLatex, setFailedLatex] = useState<string | null>(null);

  const snippets = extractLatexSnippets(text);
  if (snippets.length === 0) return null;

  async function save(latex: string) {
    setSaving(latex);
    setFailedLatex(null);
    try {
      const res = await fetch("/api/formulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex, source }),
      });
      if (res.ok) {
        setSavedLatex((prev) => new Set(prev).add(latex));
      } else {
        setFailedLatex(latex);
      }
    } catch {
      setFailedLatex(latex);
    } finally {
      setSaving(null);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="บันทึกสูตร"
        title="บันทึกสูตร"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1 text-xs text-ink-muted transition-colors hover:text-accent-primary",
          className,
        )}
      >
        <Bookmark className="h-3.5 w-3.5" />
        บันทึกสูตร
      </button>
      <GlassModal
        open={open}
        onOpenChange={setOpen}
        title="บันทึกสูตร"
        description="เลือกสูตรที่ต้องการบันทึกไว้ในคลังของคุณ"
      >
        <div className="flex flex-col gap-2">
          {snippets.map((latex) => {
            const isSaved = savedLatex.has(latex);
            return (
              <div key={latex} className="glass-surface flex flex-col gap-1 rounded-md p-3">
                <div className="flex items-center justify-between gap-3">
                  <InlineMath text={`$${latex}$`} className="text-ink-primary" />
                  <button
                    type="button"
                    disabled={isSaved || saving === latex}
                    onClick={() => save(latex)}
                    className="shrink-0 text-sm font-medium text-accent-primary disabled:text-success"
                  >
                    {isSaved ? <Check className="h-4 w-4" /> : saving === latex ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                </div>
                {failedLatex === latex && <p className="text-xs text-error">บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง</p>}
              </div>
            );
          })}
        </div>
      </GlassModal>
    </>
  );
}
