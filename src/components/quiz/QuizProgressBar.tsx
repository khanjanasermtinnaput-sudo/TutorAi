"use client";

import { motion } from "framer-motion";

export function QuizProgressBar({ answered, total }: { answered: number; total: number }) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return (
    <div className="glass-surface w-full overflow-hidden rounded-full p-1">
      <div className="relative h-2 overflow-hidden rounded-full bg-canvas-elevated">
        <motion.div
          className="h-full rounded-full bg-gradient-liquid"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        />
      </div>
      <p className="mt-1 px-2 text-xs text-ink-muted">
        ตอบแล้ว {answered}/{total} ข้อ
      </p>
    </div>
  );
}
