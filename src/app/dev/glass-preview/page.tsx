"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Sparkles, Calculator, FlaskConical, Atom } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassModal } from "@/components/glass/GlassModal";
import { GlassFab } from "@/components/glass/GlassFab";
import { GlassChatBubble } from "@/components/glass/GlassChatBubble";
import { GlassPillSelector } from "@/components/glass/GlassPillSelector";

const SUBJECTS = [
  { id: "math", label: "คณิตศาสตร์", icon: <Calculator className="h-4 w-4" /> },
  { id: "physics", label: "ฟิสิกส์", icon: <Atom className="h-4 w-4" /> },
  { id: "chem", label: "เคมี", icon: <FlaskConical className="h-4 w-4" /> },
];

export default function GlassPreviewPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState<string | null>("math");

  return (
    <main className="min-h-screen bg-canvas p-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-heading-lg font-bold text-ink-primary">Liquid Glass Preview</h1>
            <p className="text-ink-secondary">/dev/glass-preview — debug-only, not linked from the app nav.</p>
          </div>
          <GlassButton
            variant="glass"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            data-testid="theme-toggle"
          >
            Theme: {theme} (resolved: {resolvedTheme})
          </GlassButton>
        </header>

        <section>
          <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">GlassCard depths</h2>
          <div className="grid grid-cols-3 gap-4">
            <GlassCard depth="deep" className="p-4 text-ink-primary">deep</GlassCard>
            <GlassCard depth="mid" className="p-4 text-ink-primary">mid</GlassCard>
            <GlassCard depth="top" className="p-4 text-ink-primary">top</GlassCard>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">GlassCard tints (quiz answers)</h2>
          <div className="grid grid-cols-2 gap-4">
            <GlassCard tint="success" className="p-4 text-ink-primary">ถูกต้อง! คำตอบคือ B</GlassCard>
            <GlassCard tint="error" className="p-4 text-ink-primary">ไม่ถูกต้อง คำตอบที่ถูกคือ C</GlassCard>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">GlassButton</h2>
          <div className="flex flex-wrap items-center gap-3">
            <GlassButton variant="primary">Primary</GlassButton>
            <GlassButton variant="glass">Glass</GlassButton>
            <GlassButton variant="ghost">Ghost</GlassButton>
            <GlassButton variant="primary" disabled>
              Disabled
            </GlassButton>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">GlassModal (droplet morph)</h2>
          <GlassButton onClick={() => setModalOpen(true)}>เปิด Modal</GlassButton>
          <GlassModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="ตัวอย่าง Modal"
            description="สาธิตการเปิดแบบ droplet morph"
          >
            <p className="text-ink-secondary">เนื้อหาใน modal นี้ใช้ทดสอบ animation เท่านั้น</p>
            <GlassButton className="mt-4" onClick={() => setModalOpen(false)}>
              ปิด
            </GlassButton>
          </GlassModal>
        </section>

        <section>
          <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">GlassPillSelector</h2>
          <GlassPillSelector options={SUBJECTS} value={subject} onChange={setSubject} />
        </section>

        <section>
          <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">GlassChatBubble</h2>
          <div className="flex flex-col gap-3">
            <GlassChatBubble role="assistant">สวัสดีครับ วันนี้อยากเรียนเรื่องอะไรดี?</GlassChatBubble>
            <GlassChatBubble role="user">อยากทบทวนเรื่องอนุพันธ์ครับ</GlassChatBubble>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">GlassFab</h2>
          <div className="relative h-24">
            <div className="absolute bottom-0 right-0">
              <GlassFab icon={<Sparkles className="h-5 w-5" />} label="สร้างข้อสอบ" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
