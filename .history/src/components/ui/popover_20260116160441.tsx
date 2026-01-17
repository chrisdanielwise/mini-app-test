"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ POPOVER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 */
function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * 🛰️ POPOVER_CONTENT
 * Strategy: Stationary HUD Membrane & Hardware Handshake.
 * Fix: Tightened 300ms timing and hardened radii prevent layout jitter.
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 6, 
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        onOpenAutoFocus={() => {
          // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
          if (isReady) impact("light");
        }}
        className={cn(
          // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
          "z-[500] w-72 overflow-hidden border shadow-2xl outline-none transition-all",
          "bg-zinc-950/90 backdrop-blur-3xl border-white/5",
          isMobile ? "rounded-xl p-3.5" : "rounded-2xl p-5",
          
          // 🚀 KINETIC INGRESS: High-velocity transition (300ms)
          "duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
          
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };