"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { cn } from "@/lib/utils/cn";
import { createChatSession, deleteChatSession } from "@/app/(main)/actions";

export interface SessionListItem {
  id: string;
  title: string;
}

export function ChatSidebar({ sessions }: { sessions: SessionListItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="glass-surface glass-surface-deep flex h-full w-64 shrink-0 flex-col gap-2 rounded-lg p-3">
      <form action={createChatSession}>
        <GlassButton
          type="submit"
          variant="glass"
          size="sm"
          className="w-full justify-start gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-primary hover:text-accent-primary"
        >
          <Plus className="h-4 w-4" />
          แชทใหม่
        </GlassButton>
      </form>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {sessions.map((s) => {
          const active = pathname === `/chat/${s.id}`;
          return (
            <div key={s.id} className="group relative flex items-center">
              <Link
                href={`/chat/${s.id}`}
                className={cn(
                  "flex flex-1 items-center gap-2 truncate rounded-md py-2 pl-3 pr-8 text-sm",
                  active ? "bg-gradient-liquid text-white" : "text-ink-secondary hover:text-ink-primary",
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{s.title}</span>
              </Link>
              <form
                action={deleteChatSession}
                className="absolute right-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <input type="hidden" name="sessionId" value={s.id} />
                <input type="hidden" name="redirectTo" value={active ? "/chat" : ""} />
                <button
                  type="submit"
                  aria-label="ลบแชท"
                  onClick={(e) => {
                    if (!confirm("ลบแชทนี้หรือไม่? ข้อความทั้งหมดจะถูกลบถาวร")) e.preventDefault();
                  }}
                  className={cn(
                    "rounded p-1 hover:text-error",
                    active ? "text-white/80" : "text-ink-muted",
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
