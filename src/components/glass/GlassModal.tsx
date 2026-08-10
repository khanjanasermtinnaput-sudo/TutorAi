"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { DropletTransition } from "./DropletTransition";
import { cn } from "@/lib/utils/cn";

export interface GlassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Set false for mandatory flows (e.g. onboarding) — blocks Escape/overlay-click dismissal. */
  dismissible?: boolean;
}

export function GlassModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  dismissible = true,
}: GlassModalProps) {
  const preventDismiss = (e: Event) => {
    if (!dismissible) e.preventDefault();
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-glass-scrim backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              onEscapeKeyDown={preventDismiss}
              onPointerDownOutside={preventDismiss}
              onInteractOutside={preventDismiss}
            >
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <DropletTransition className={cn("glass-surface glass-surface-top glass-scrim w-full max-w-md p-6", className)}>
                  <Dialog.Title className="font-display text-heading-md font-semibold text-ink-primary">
                    {title}
                  </Dialog.Title>
                  {description && (
                    <Dialog.Description className="mt-1 text-sm text-ink-secondary">{description}</Dialog.Description>
                  )}
                  <div className="mt-4">{children}</div>
                </DropletTransition>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
