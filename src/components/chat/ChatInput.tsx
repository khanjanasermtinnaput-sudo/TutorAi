"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";

export function ChatInput({ onSend, disabled }: { onSend: (message: string) => void; disabled: boolean }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="glass-surface glass-surface-top flex items-end gap-2 rounded-xl p-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
        }}
        onKeyDown={handleKeyDown}
        placeholder="พิมพ์คำถามของคุณ..."
        rows={1}
        disabled={disabled}
        className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-ink-primary outline-none placeholder:text-ink-muted"
      />
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
  );
}
