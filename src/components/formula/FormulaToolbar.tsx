"use client";

import { FORMULA_SNIPPET_GROUPS, type FormulaSnippet } from "./formulaSnippets";
import { SaveFormulaButton } from "./SaveFormulaButton";
import { cn } from "@/lib/utils/cn";

export function FormulaToolbar({
  textareaRef,
  value,
  onChange,
  source,
  className,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
  /** Where this toolbar is mounted — tags formulas bookmarked directly from it. */
  source: "chat" | "quiz" | "manual";
  className?: string;
}) {
  function insertSnippet(snippet: FormulaSnippet) {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const next = value.slice(0, start) + snippet.insert + value.slice(end);
    onChange(next);

    const [selStartOffset, selEndOffset] = snippet.selectOffset ?? [snippet.insert.length, snippet.insert.length];
    const selStart = start + selStartOffset;
    const selEnd = start + selEndOffset;
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(selStart, selEnd);
    });
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {FORMULA_SNIPPET_GROUPS.map((group) => (
        <div key={group.label} className="flex items-center gap-1">
          {group.snippets.map((snippet) => (
            <button
              key={snippet.id}
              type="button"
              aria-label={snippet.ariaLabel}
              title={snippet.ariaLabel}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertSnippet(snippet)}
              className="glass-surface flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-sm text-ink-secondary transition-colors hover:text-accent-primary"
            >
              {snippet.label}
            </button>
          ))}
        </div>
      ))}
      <SaveFormulaButton text={value} source={source} className="ml-auto" />
    </div>
  );
}
