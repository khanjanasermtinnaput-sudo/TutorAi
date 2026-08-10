"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sparkles, Calculator, FlaskConical, Atom } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassModal } from "@/components/glass/GlassModal";
import { GlassFab } from "@/components/glass/GlassFab";
import { GlassChatBubble } from "@/components/glass/GlassChatBubble";
import { GlassPillSelector } from "@/components/glass/GlassPillSelector";
import { QuizQuestionCard } from "@/components/quiz/QuizQuestionCard";
import { QuizProgressBar } from "@/components/quiz/QuizProgressBar";
import { KeyPointsSummary } from "@/components/topic/KeyPointsSummary";
import { FormulaList } from "@/components/topic/FormulaList";
import { FrequentlyTestedList } from "@/components/topic/FrequentlyTestedBadge";

const SUBJECTS = [
  { id: "math", label: "คณิตศาสตร์", icon: <Calculator className="h-4 w-4" /> },
  { id: "physics", label: "ฟิสิกส์", icon: <Atom className="h-4 w-4" /> },
  { id: "chem", label: "เคมี", icon: <FlaskConical className="h-4 w-4" /> },
];

export default function GlassPreviewPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState<string | null>("math");
  const [quizAnswer, setQuizAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  // next-themes can't know the theme during SSR — rendering theme/resolvedTheme
  // before mount would print different text server vs. client and trigger a
  // hydration mismatch. Wait one paint so both renders agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen p-8">
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
            {mounted ? `Theme: ${theme} (resolved: ${resolvedTheme})` : "Theme: —"}
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
          <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">Quiz components</h2>
          <div className="flex flex-col gap-4">
            <QuizProgressBar answered={3} total={10} />
            <QuizQuestionCard
              mode="answer"
              index={0}
              questionText="อนุพันธ์ของ $x^2$ คืออะไร"
              choices={{ A: "$x$", B: "$2x$", C: "$x^2$", D: "$2$" }}
              selected={quizAnswer}
              onSelect={setQuizAnswer}
            />
            <QuizQuestionCard
              mode="review"
              index={1}
              questionText="2 + 2 เท่ากับเท่าไร"
              choices={{ A: "3", B: "4", C: "5", D: "6" }}
              correctChoice="B"
              userAnswer="C"
              explanation="บวกเลข 2 กับ 2 ทีละหลัก ได้ผลลัพธ์เป็น 4 ตามหลักการบวกจำนวนเต็มพื้นฐาน"
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-heading-md font-semibold text-ink-primary">Topic deep-dive components</h2>
          <div className="flex flex-col gap-4">
            <KeyPointsSummary points={["อนุพันธ์คืออัตราการเปลี่ยนแปลงของฟังก์ชัน ณ จุดหนึ่ง", "เขียนแทนด้วยสัญลักษณ์ $f'(x)$ หรือ $\\frac{dy}{dx}$"]} />
            <FormulaList
              formulas={[
                { name: "กฎกำลัง", formula: "$\\frac{d}{dx}x^n = nx^{n-1}$", when_to_use: "ใช้หาอนุพันธ์ของพจน์ที่มีเลขชี้กำลัง" },
              ]}
            />
            <FrequentlyTestedList items={["โจทย์หาอนุพันธ์ของฟังก์ชันประกอบ มักออกสอบเพราะทดสอบความเข้าใจ chain rule"]} />
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
