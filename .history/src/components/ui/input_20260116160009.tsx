"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ INPUT (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Focus.
 * Fix: Tactical h-10/11 height and hardened radii prevent layout blowout.
 */
function Input({ className, type, onFocus, ...props }: React.ComponentProps<"input">) {
  const { selectionChange } = useHaptics();
  const { isMobile, isReady } = useDeviceContext();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
    if (isReady) selectionChange();
    if (onFocus) onFocus(e);
  };

  return (
    <input
      type={type}
      data-slot="input"
      onFocus={handleFocus}
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 10%
        "flex w-full min-w-0 border transition-all duration-500 outline-none",
        "bg-zinc-950/20 backdrop-blur-xl border-white/5",
        isMobile ? "h-10 rounded-lg px-3.5" : "h-11 rounded-xl px-4",
        
        // 🏛️ INSTITUTIONAL TYPOGRAPHY
        "text-[10px] md:text-[11px] font-black italic uppercase tracking-wider text-foreground",
        "placeholder:text-muted-foreground/10 placeholder:italic",
        
        // 🌫️ LAMINAR FOCUS: HUD light ingress
        "focus:bg-zinc-950/60 focus:border-primary/20 focus:ring-2 focus:ring-primary/5",
        "active:scale-[0.99]",

        // 🛡️ Error & Disabled States
        "aria-invalid:border-rose-500/30 aria-invalid:ring-rose-500/5",
        "disabled:cursor-not-allowed disabled:opacity-10 disabled:grayscale",
        
        // 📂 File Styling: Technical Metadata Standard
        "file:text-[8px] file:font-black file:uppercase file:italic file:tracking-widest",
        "file:border-0 file:bg-transparent file:text-primary/40",

        className
      )}
      {...props}
    />
  );
}

export { Input };