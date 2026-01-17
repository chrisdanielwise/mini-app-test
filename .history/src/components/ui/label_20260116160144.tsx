"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ LABEL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Peer-Sync Logic.
 * Fix: Tactical 9px typography prevents layout blowout in high-density HUDs.
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { isMobile } = useDeviceContext();

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // 📐 INSTITUTIONAL SCALE: Clinical metadata standard
        "flex items-center gap-1.5 select-none",
        "text-[9px] font-black uppercase italic tracking-[0.25em] leading-none",
        "text-muted-foreground/30 transition-all duration-300",
        
        // 🌫️ LAMINAR PEER-SYNC: Active node radiance
        "peer-focus:text-primary peer-focus:tracking-[0.3em] peer-placeholder-shown:text-muted-foreground/10",
        
        // 🛡️ HARDWARE BYPASS: Safe-area accessibility
        isMobile ? "min-h-4" : "min-h-5",
        
        // 🛡️ State Hardening
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-10",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-10",
        
        className
      )}
      {...props}
    />
  );
}

export { Label };