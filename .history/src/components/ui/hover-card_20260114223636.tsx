"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID HOVER CARD (Institutional v16.16.12)
 * Logic: Haptic-synced ambient reveal with organic inflation.
 */
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

const HoverCardTrigger = HoverCardPrimitive.Trigger;

/**
 * 🌊 WATER CONTENT
 * Logic: Uses 700ms "Water Flow" timing with high-density glass.
 */
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 8, // 🚀 Increased offset for fluid depth
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  const { impact } = useHaptics();

  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        onPointerEnter={() => impact("light")} // 🏁 TACTILE SYNC: Micro-vibration on reveal
        className={cn(
          // 🏛️ Style Hardening: v9.9.1 Glassmorphism (Deep Blur)
          "z-50 w-64 rounded-2xl border border-white/10 bg-card/80 backdrop-blur-2xl p-4 shadow-2xl outline-none",
          
          // 🚀 THE WATER ENGINE: Cubic-Bezier Momentum
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          
          // 🌊 DIRECTIONAL INGRESS: Smoother slide-in for liquid feel
          "data-[side=bottom]:slide-in-from-top-4 data-[side=left]:slide-in-from-right-4 data-[side=right]:slide-in-from-left-4 data-[side=top]:slide-in-from-bottom-4",
          
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };