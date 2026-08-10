"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const DROPLET_RADIUS = "42% 58% 63% 37% / 41% 44% 56% 59%";
const SETTLED_RADIUS = "24px 24px 24px 24px / 24px 24px 24px 24px";

export interface DropletTransitionProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  settledRadius?: string;
}

/** Wraps a modal/panel's mount so its shape starts as an asymmetric droplet
 * and settles into a normal rounded rect (§2.1.6) — an 8-token border-radius
 * string animated corner-by-corner via Framer Motion's complex-value mixer. */
export function DropletTransition({ children, settledRadius = SETTLED_RADIUS, ...motionProps }: DropletTransitionProps) {
  return (
    <motion.div
      initial={{ borderRadius: DROPLET_RADIUS, opacity: 0, scale: 0.85 }}
      animate={{ borderRadius: settledRadius, opacity: 1, scale: 1 }}
      exit={{ borderRadius: DROPLET_RADIUS, opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 320, damping: 24, borderRadius: { duration: 0.25 } }}
      style={{ overflow: "hidden" }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
