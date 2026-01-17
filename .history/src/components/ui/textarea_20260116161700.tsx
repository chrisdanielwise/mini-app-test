"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ TEXTAREA (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Ingress.
 * Fix: Tactical 11px typography and 80px min-height prevent layout blowout.
 */
function Textarea({ className, onFocus, ...props }: React.ComponentProps<"textarea">) {
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
      if (isReady) impact("light");
      if (onFocus) onFocus(e);
    },
    [impact, onFocus, isReady]
  );

  return (
    <textarea
      data-slot="textarea"
      onFocus={handleFocus}
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
        "flex w-full transition-all outline-none select-text",
        "bg-zinc-950/20 backdrop-blur-3xl border border-white/5",
        isMobile ? "min-h-[80px] rounded-xl px-3 py-2.5" : "min-h-[100px] rounded-2xl px-4 py-3",
        
        // 🏛️ INSTITUTIONAL TYPOGRAPHY
        "text-[11px] font-black uppercase italic tracking-widest leading-relaxed",
        "placeholder:text-muted-foreground/10 placeholder:font-black placeholder:uppercase",
        "text-foreground/80",

        // 🚀 KINETIC FOCUS: v2026 Laminar Radiance
        "focus:bg-zinc-950/40 focus:border-primary/20 focus:ring-2 focus:ring-primary/5",
        "disabled:cursor-not-allowed disabled:opacity-10",
        
        // 📏 DYNAMIC SIZING: 2026 Native Expansion
        "field-sizing-content max-h-[240px] resize-none", 
        className
      )}
      {...props}
    />
  );
}

export { Textarea };