"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 🌊 FLUID KBD (Institutional v16.16.12)
 * Logic: Environment-aware shortcut indicators.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Base
        "pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1.5 rounded-md border border-white/10 bg-card/40 px-1.5",
        "text-[10px] font-black uppercase tracking-widest text-foreground/50 backdrop-blur-md transition-all duration-500",
        
        // 🌊 CONTEXTUAL ADAPTATION: Water Flow logic for tooltips
        "[[data-slot=tooltip-content]_&]:border-white/20 [[data-slot=tooltip-content]_&]:bg-white/10 [[data-slot=tooltip-content]_&]:text-white",
        
        // 🚀 ICON SYNC
        "[&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 KBD GROUP
 */
function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };