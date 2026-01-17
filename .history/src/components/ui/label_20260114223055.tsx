"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/**
 * 🌊 FLUID LABEL (Institutional v16.16.12)
 * Logic: Peer-aware identity anchoring.
 * Design: v9.5.0 Hardened Terminal Branding.
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // 🏛️ Style Hardening: v9.5.0 Branding Standard
        "flex items-center gap-2 select-none",
        "text-[10px] font-black uppercase italic tracking-[0.2em] leading-none",
        "text-foreground/50 transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        
        // 🌊 PEER REACTIVITY: Glows when the associated input is active
        "peer-focus:text-primary peer-placeholder-shown:text-foreground/30",
        
        // 🛡️ State Hardening
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-30",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-30",
        
        className
      )}
      {...props}
    />
  );
}

export { Label };