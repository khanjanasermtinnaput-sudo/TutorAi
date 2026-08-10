"use client";

import { useState } from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface GlassFabProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon: React.ReactNode;
  label: string;
}

let rippleId = 0;

/** Floating action button — deepest shadow, most blur, and a droplet-style
 * ripple (an expanding, fading ring, not a flat Material ripple) on press. */
export function GlassFab({ icon, label, className, onClick, ...props }: GlassFabProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = rippleId++;
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((ripple) => ripple.id !== id)), 700);
    onClick?.(e);
  }

  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={handleClick}
      className={cn(
        "glass-surface glass-surface-top relative flex h-16 items-center gap-2 overflow-hidden rounded-full px-6 text-ink-primary",
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      {...props}
    >
      <span className="relative z-[2] flex items-center gap-2 font-display font-medium">
        {icon}
        {label}
      </span>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="pointer-events-none absolute z-[1] rounded-full bg-accent-primary/30"
            style={{ left: ripple.x, top: ripple.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 160, height: 160, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}
