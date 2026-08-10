"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid a hydration mismatch: resolvedTheme is unknown during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      aria-label="สลับโหมดมืด/สว่าง"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="glass-surface flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary hover:text-ink-primary"
    >
      {mounted && resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
