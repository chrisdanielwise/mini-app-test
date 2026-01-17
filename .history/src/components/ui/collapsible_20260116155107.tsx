"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ COLLAPSIBLE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 * Fix: Tactical py-2.5 triggers and shrunken metadata scale prevent layout blowout.
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/**
 * 🛰️ COLLAPSIBLE_TRIGGER
 * Strategy: Technical Hit-zone (h-10/11 standard) & Haptic Handshake.
 */
function CollapsibleTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  const { impact } = useHaptics();
  const { isReady } = useDeviceContext();

  const handleInteract = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 🛡️ HARDWARE HANDSHAKE: Prevent haptic jitter before hydration
    if (isReady) impact("light");
    if (onClick) onClick(e);
  };

  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      onClick={handleInteract}
      className={cn(
        "group flex w-full items-center justify-between transition-all duration-300 outline-none",
        // 📐 TACTICAL RADIUS & PADDING
        "rounded-lg px-3 py-2.5 text-[9px] md:text-[10px] font-black uppercase italic tracking-widest",
        "text-muted-foreground/30 hover:text-primary hover:bg-primary/5 active:scale-95",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ COLLAPSIBLE_CONTENT
 * Strategy: Momentum-based clinical reveal.
 */
function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down",
        "text-[8px] font-black leading-relaxed text-muted-foreground/20 uppercase tracking-[0.2em] italic",
        className
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };