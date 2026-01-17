"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ HOVER_CARD (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 * Note: Hover events are prioritized for Desktop tiers (> 1024px).
 */
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

const HoverCardTrigger = HoverCardPrimitive.Trigger;

/**
 * 🛰️ HOVER_CARD_CONTENT
 * Strategy: Stationary HUD Membrane & Hardware Handshake.
 */
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 6, 
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  const { impact } = useHaptics();
  const { isDesktop, isReady } = useDeviceContext();

  // 🛡️ TACTICAL BYPASS: Prevent accidental reveal on Mobile hardware
  if (!isDesktop && isReady) return null;

  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        onPointerEnter={() => isReady && impact("light")}
        className={cn(
          "z-[500] w-64 overflow-hidden rounded-xl border border-white/5 bg-zinc-950/90 p-3.5 shadow-2xl backdrop-blur-3xl outline-none",
          
          // 🚀 KINETIC INGRESS: High-velocity transition (300ms)
          "transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
          
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };