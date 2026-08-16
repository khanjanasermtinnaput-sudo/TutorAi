"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface GlassChatBubbleProps {
  role: "user" | "assistant";
  children: React.ReactNode;
  className?: string;
  /** False for messages already present on load (chat history) — skips the
   * pop-in so a whole conversation doesn't animate in at once. */
  animateIn?: boolean;
}

/** AI bubble: deep glass surface, corner nearest the avatar pinched smaller
 * (asymmetric, like a droplet clinging to glass). User bubble: the liquid
 * gradient at reduced opacity so text stays readable, with a lighter blur. */
export function GlassChatBubble({ role, children, className, animateIn = true }: GlassChatBubbleProps) {
  const isUser = role === "user";
  const initial = animateIn ? { opacity: 0, y: 12, scale: 0.97 } : false;

  if (isUser) {
    // The gradient sits on its own layer at 85% opacity so the white text on
    // top stays fully legible — Tailwind's color-opacity modifier (`/85`)
    // only applies to solid background-color utilities, not background-image
    // gradients, so this needs a separate layered div rather than a class.
    return (
      <motion.div
        initial={initial}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 26 }}
        className={cn(
          "relative isolate max-w-[80%] self-end overflow-hidden rounded-[20px] rounded-br-md px-4 py-3 text-body-md text-white backdrop-blur-layer-3",
          className,
        )}
      >
        <div className="absolute inset-0 z-0 bg-gradient-liquid opacity-[0.85]" />
        <div className="relative z-[1]">{children}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className={cn(
        "glass-surface glass-surface-deep glass-scrim max-w-[80%] self-start rounded-[20px] rounded-bl-md px-4 py-3 text-body-md text-ink-primary",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
