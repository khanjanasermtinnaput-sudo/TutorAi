"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Sigma } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { FormulaToolbar } from "@/components/formula/FormulaToolbar";

export function ChatInput({ onSend, disabled }: { onSend: (message: string) => void; disabled: boolean }) {
  const [value, setValue] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Re-runs on every value change, whether from typing or from FormulaToolbar
  // splicing a snippet in directly, so both paths keep the textarea sized to content.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="glass-surface glass-surface-top flex flex-col gap-2 rounded-xl p-2">
      {toolsOpen && (
        <FormulaToolbar textareaRef={textareaRef} value={value} onChange={setValue} source="chat" className="px-1" />
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์คำถามของคุณ..."
          rows={1}
          disabled={disabled}
          className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-ink-primary outline-none placeholder:text-ink-muted"
        />
        <GlassButton
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => setToolsOpen((v) => !v)}
          aria-label="เครื่องมือพิมพ์สูตร"
          aria-pressed={toolsOpen}
        >
          <Sigma className="h-4 w-4" />
        </GlassButton>
        <GlassButton
          variant="primary"
          size="sm"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="ส่งข้อความ"
        >
          <Send className="h-4 w-4" />
        </GlassButton>
      </div>
    </div>
  );
}
