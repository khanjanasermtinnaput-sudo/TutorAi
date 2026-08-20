"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, BookMarked, Settings } from "lucide-react";
import { ChatSidebar, type SessionListItem } from "./ChatSidebar";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppShell({
  sessions,
  nickname,
  children,
}: {
  sessions: SessionListItem[];
  nickname: string | null;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setDrawerOpen(false), [pathname]);

  return (
    <div className="flex h-screen gap-3 p-3">
      {/* Desktop: sidebar always visible */}
      <div className="hidden md:block">
        <ChatSidebar sessions={sessions} />
      </div>

      {/* Mobile: slide-in drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-glass-scrim backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 p-3 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <ChatSidebar sessions={sessions} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden">
        <header className="glass-surface flex items-center justify-between rounded-lg px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="เมนู"
              onClick={() => setDrawerOpen(true)}
              className="text-ink-secondary hover:text-ink-primary md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-display font-semibold text-ink-primary">Tutor AI</span>
          </div>
          <div className="flex items-center gap-3">
            {nickname && <span className="hidden text-sm text-ink-secondary sm:inline">{nickname}</span>}
            <Link
              href="/settings"
              aria-label="ตั้งค่า"
              className="flex items-center gap-1.5 text-ink-secondary hover:text-ink-primary"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden text-sm sm:inline">ตั้งค่า</span>
            </Link>
            <Link
              href="/formulas"
              aria-label="สูตรของฉัน"
              className="flex items-center gap-1.5 text-ink-secondary hover:text-ink-primary"
            >
              <BookMarked className="h-5 w-5" />
              <span className="hidden text-sm sm:inline">สูตรของฉัน</span>
            </Link>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
