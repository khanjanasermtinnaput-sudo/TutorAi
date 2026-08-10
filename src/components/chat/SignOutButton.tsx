"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      aria-label="ออกจากระบบ"
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-secondary hover:text-ink-primary"
    >
      <LogOut className="h-4 w-4" />
      ออกจากระบบ
    </button>
  );
}
