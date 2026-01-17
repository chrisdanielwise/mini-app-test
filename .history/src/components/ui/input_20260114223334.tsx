"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID INPUT (Institutional v16.16.12)
 * Logic: Haptic-synced focus engagement with organic momentum.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Input({ className, type, onFocus, ...props }: React.ComponentProps<"input">) {
  const { selectionChange } = useHaptics();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // 🏁 TACTILE SYNC: Feel the "activation" of the field
    selectionChange();
    if (onFocus) onFocus(e);
  };

  return (
    <input
      type={type}
      data-slot="input"
      onFocus={handleFocus}
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Base
        "flex h-11 w-full min-w-0 rounded-xl border border-white/10 bg-card/20 px-4 py-2",
        "text-sm font-bold tracking-tight text-foreground placeholder:text-foreground/20",
        "backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        
        // 🌊 WATER FOCUS: The field "fills" with light and expands slightly
        "focus:bg-card/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 focus:outline-none",
        "active:scale-[0.99]",

        // 🛡️ Error & Disabled States
        "aria-invalid:border-destructive/50 aria-invalid:ring-destructive/10",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale",
        
        // 📂 File Styling
        "file:text-xs file:font-black file:uppercase file:italic file:tracking-widest",
        "file:border-0 file:bg-transparent file:text-primary",

        className
      )}
      {...props}
    />
  );
}

export { Input };