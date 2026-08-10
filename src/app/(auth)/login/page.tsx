"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (signInError) {
      setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <GlassCard depth="top" radius="xl" className="w-full max-w-sm p-8 text-center">
        <h1 className="font-display text-heading-lg font-bold text-ink-primary">Tutor AI</h1>
        <p className="mt-2 text-body-md text-ink-secondary">ติวเตอร์ AI ส่วนตัวของคุณ</p>
        <GlassButton onClick={signInWithGoogle} disabled={loading} className="mt-8 w-full">
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย Gmail"}
        </GlassButton>
        {error && <p className="mt-3 text-sm text-error">{error}</p>}
      </GlassCard>
    </main>
  );
}
