"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ KBD (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Visibility.
 * Fix: Tactical text-[8px] and shrunken h-4.5 mass prevent layout blowout.
 */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  const { isDesktop, isReady } = useDeviceContext();

  return (
    <kbd
      data-slot="kbd"
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
        "pointer-events-none inline-flex h-4.5 min-w-4.5 select-none items-center justify-center gap-1 rounded-sm border transition-all duration-300",
        "bg-zinc-950/20 backdrop-blur-xl border-white/5",
        
        // 🏛️ INSTITUTIONAL TYPOGRAPHY
        "text-[8px] md:text-[9px] font-mono font-black uppercase tracking-[0.2em] text-muted-foreground/30",
        
        // 🌫️ LAMINAR ADAPTATION: HUD context logic
        "[[data-slot=tooltip-content]_&]:border-white/10 [[data-slot=tooltip-content]_&]:bg-white/5 [[data-slot=tooltip-content]_&]:text-primary/60",
        "[[data-slot=command-item]_&]:opacity-40",

        // 🛡️ HARDWARE BYPASS: Dimming for touch-only hardware
        !isDesktop && isReady && "opacity-0 scale-90",
        
        // 🚀 ICON SYNC
        "[&_svg:not([class*='size-'])]:size-2.5",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ KBD_GROUP
 * Strategy: Technical Logic Stream.
 */
function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-0.5", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };