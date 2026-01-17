"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ CHECKBOX (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Logic Gating.
 * Fix: Tactical sizing and shrunken iconography prevent layout blowout.
 */
function Checkbox({
  className,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const { impact } = useHaptics();
  const { isMobile, isDesktop, isReady } = useDeviceContext();

  const handleToggle = (checked: boolean | "indeterminate") => {
    // 🛡️ HARDWARE HANDSHAKE: Prevent logic jitter before hydration
    if (isReady) {
      impact("light");
    }
    if (onCheckedChange) onCheckedChange(checked);
  };

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      onCheckedChange={handleToggle}
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
        "peer shrink-0 border backdrop-blur-xl transition-all duration-500 outline-none select-none",
        isDesktop ? "size-5 rounded-lg" : "size-4.5 rounded-md",
        
        // 🌫️ LAMINAR DEPTH: Stationary HUD aesthetic
        "border-white/5 bg-zinc-950/40",
        
        // 🚀 KINETIC INGRESS: State Physics
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        "data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/20",
        
        // 🏎️ Interaction Momentum
        "hover:border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/10 active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-10 disabled:grayscale",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {/* 📐 TACTICAL INGRESS: Shrunken stroke for clinical precision */}
        <CheckIcon className="size-3 md:size-3.5 stroke-[3.5px] animate-in zoom-in-95 duration-300" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };