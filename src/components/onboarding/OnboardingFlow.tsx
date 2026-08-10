"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GlassModal } from "@/components/glass/GlassModal";
import { NicknameStep } from "./NicknameStep";
import { BirthdateStep } from "./BirthdateStep";
import { EducationLevelStep } from "./EducationLevelStep";
import { createClient } from "@/lib/supabase/client";

const STEP_TITLES = ["ยินดีต้อนรับสู่ Tutor AI", "วันเกิดของคุณ", "ระดับชั้นเรียน"];

export function OnboardingFlow({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        nickname,
        birth_date: birthDate,
        education_level: educationLevel,
        onboarding_completed: true,
      })
      .eq("id", userId);

    if (updateError) {
      setError("บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง");
      setSubmitting(false);
      return;
    }
    router.push("/chat");
    router.refresh();
  }

  return (
    <GlassModal open onOpenChange={() => {}} dismissible={false} title={STEP_TITLES[step]}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
        >
          {step === 0 && <NicknameStep value={nickname} onChange={setNickname} onNext={() => setStep(1)} />}
          {step === 1 && (
            <BirthdateStep value={birthDate} onChange={setBirthDate} onNext={() => setStep(2)} onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <EducationLevelStep
              value={educationLevel}
              onChange={setEducationLevel}
              onSubmit={handleSubmit}
              onBack={() => setStep(1)}
              submitting={submitting}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {error && <p className="mt-3 text-sm text-error">{error}</p>}
    </GlassModal>
  );
}
