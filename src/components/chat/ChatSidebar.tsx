"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createChatSession } from "@/app/(main)/actions";

export interface SessionListItem {
  id: string;
  title: string;
}

export function ChatSidebar({ sessions }: { sessions: SessionListItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="glass-surface glass-surface-deep flex h-full w-64 shrink-0 flex-col gap-2 rounded-lg p-3">
      <form action={createChatSession}>
        <button
          type="submit"
          className="glass-surface flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-primary hover:text-accent-primary"
        >
          <Plus className="h-4 w-4" />
          แชทใหม่
        </button>
      </form>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {sessions.map((s) => {
          const active = pathname === `/chat/${s.id}`;
          return (
            <Link
              key={s.id}
              href={`/chat/${s.id}`}
              className={cn(
                "flex items-center gap-2 truncate rounded-md px-3 py-2 text-sm",
                active ? "bg-gradient-liquid text-white" : "text-ink-secondary hover:text-ink-primary",
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{s.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
