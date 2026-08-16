"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Surface depth — deeper layers blur more, top layers less but with a bigger shadow (§2.1.4). */
  depth?: "deep" | "mid" | "top";
  tint?: "none" | "success" | "error" | "warning" | "accent";
  /** Adds a dark scrim under content when a surface needs guaranteed WCAG AA contrast (§2.4). */
  scrim?: boolean;
  radius?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
}

const DEPTH_CLASS: Record<NonNullable<GlassCardProps["depth"]>, string> = {
  deep: "glass-surface-deep",
  mid: "",
  top: "glass-surface-top",
};

const RADIUS_CLASS: Record<NonNullable<GlassCardProps["radius"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { depth = "mid", tint = "none", scrim = false, radius = "lg", className, children, ...motionProps },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "glass-surface",
        DEPTH_CLASS[depth],
        RADIUS_CLASS[radius],
        tint === "success" && "glass-tint-success",
        tint === "error" && "glass-tint-error",
        tint === "warning" && "glass-tint-warning",
        tint === "accent" && "glass-tint-accent",
        scrim && "glass-scrim",
        className,
      )}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      {...motionProps}
    >
      <div className="relative z-[2]">{children}</div>
    </motion.div>
  );
});
