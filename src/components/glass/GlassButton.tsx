"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

const VARIANT_CLASS: Record<NonNullable<GlassButtonProps["variant"]>, string> = {
  primary: "bg-gradient-liquid text-white border border-white/20 shadow-glass-elevated",
  glass: "glass-surface text-ink-primary",
  ghost: "bg-transparent text-ink-secondary hover:text-ink-primary",
};

const SIZE_CLASS: Record<NonNullable<GlassButtonProps["size"]>, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(function GlassButton(
  { variant = "primary", size = "md", className, children, disabled, ...motionProps },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-display font-medium",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      {...motionProps}
    >
      <span className="relative z-[2]">{children}</span>
    </motion.button>
  );
});
