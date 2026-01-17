"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ TACTICAL TEXTAREA (Institutional v16.16.12)
 * Logic: Auto-expanding with Institutional v9.9.1 Hardened Focus.
 * Feature: Optimized for TMA Keyboard Ingress.
 */
function Textarea({ className, onFocus, ...props }: React.ComponentProps<"textarea">) {
  const { impact } = useHaptics();

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      // 🏁 TACTILE SYNC: Subtle feedback when entering edit mode
      impact("light");
      if (onFocus) onFocus(e);
    },
    [impact, onFocus]
  );

  return (
    <textarea
      data-slot="textarea"
      onFocus={handleFocus}
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism & Typography
        "flex min-h-[120px] w-full rounded-2xl border border-border/10 bg-card/40 px-4 py-3",
        "text-[13px] font-bold leading-relaxed placeholder:text-muted-foreground/30",
        "transition-all outline-none backdrop-blur-md",
        "focus:border-primary/40 focus:bg-card/60 focus:ring-4 focus:ring-primary/5",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // 🚀 Modern CSS: Auto-expand logic (Standard 2026)
        "field-sizing-content max-h-[300px]", 
        className
      )}
      {...props}
    />
  );
}

export { Textarea };