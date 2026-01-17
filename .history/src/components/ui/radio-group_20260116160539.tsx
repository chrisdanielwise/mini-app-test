"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ RADIO_GROUP (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Logic Flow.
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

/**
 * 🛰️ RADIO_GROUP_ITEM
 * Strategy: Technical Logic Gate & Hardware Handshake.
 * Fix: Tactical size-4.5 mass prevents layout blowout.
 */
function RadioGroupItem({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const { selectionChange } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  const handleInteract = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
      if (isReady) selectionChange();
      if (onClick) onClick(e);
    },
    [onClick, selectionChange, isReady]
  );

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      onClick={handleInteract}
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 10%
        "aspect-square shrink-0 rounded-full border transition-all duration-300",
        "bg-zinc-950/20 backdrop-blur-xl border-white/5",
        isMobile ? "size-4.5" : "size-5",
        
        // 🚀 KINETIC INGRESS: Focus & Active states
        "hover:border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/5 focus-visible:outline-none",
        "data-[state=checked]:border-primary/40 data-[state=checked]:bg-primary/5",
        "disabled:cursor-not-allowed disabled:opacity-10",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center h-full w-full"
      >
        {/* 📐 TACTICAL INDICATOR: Shrunken for clinical precision */}
        <div className="size-2 rounded-full bg-primary/80 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] animate-in zoom-in-90 duration-200" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };