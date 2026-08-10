"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface GlassPillOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface GlassPillSelectorProps {
  options: GlassPillOption[];
  value: string | null;
  onChange: (id: string) => void;
  className?: string;
}

export function GlassPillSelector({ options, value, onChange, className }: GlassPillSelectorProps) {
  return (
    <div role="radiogroup" className={cn("flex gap-2 overflow-x-auto pb-1", className)}>
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <motion.button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className={cn(
              "glass-surface relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium",
              selected ? "text-white" : "text-ink-secondary",
            )}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
          >
            {selected && (
              <motion.div
                layoutId="pill-selected-fill"
                className="absolute inset-0 z-0 rounded-full bg-gradient-liquid opacity-90"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-[1] flex items-center gap-1.5">
              {opt.icon}
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
