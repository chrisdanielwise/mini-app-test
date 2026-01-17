"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID POPOVER (Institutional v16.16.12)
 * Logic: Haptic-synced context anchoring with organic inflation.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * 🌊 WATER CONTENT
 * Logic: Uses 700ms "Water Flow" timing for state transitions.
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 8, // 🚀 Increased offset for fluid depth
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const { impact } = useHaptics();

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        onOpenAutoFocus={(e) => {
          impact("light"); // 🏁 TACTILE SYNC: Feel the bubble "pop" into view
        }}
        className={cn(
          // 🏛️ Style Hardening: v9.9.1 Glassmorphism (High Density)
          "z-50 w-72 rounded-2xl border border-white/10 bg-card/90 backdrop-blur-2xl p-4 shadow-2xl outline-none",
          
          // 🚀 THE WATER ENGINE: Cubic-Bezier Momentum
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          
          // 🌊 DIRECTIONAL INGRESS
          "data-[side=bottom]:slide-in-from-top-4 data-[side=left]:slide-in-from-right-4 data-[side=right]:slide-in-from-left-4 data-[side=top]:slide-in-from-bottom-4",
          
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };