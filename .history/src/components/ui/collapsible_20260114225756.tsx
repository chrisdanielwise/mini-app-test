"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID COLLAPSIBLE (Institutional v16.16.12)
 * Logic: Haptic-synced organic unfolding.
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/**
 * 🌊 WATER TRIGGER
 * Logic: Tactile confirmation on state shift.
 */
function CollapsibleTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  const { impact } = useHaptics();

  const handleInteract = (e: React.MouseEvent<HTMLButtonElement>) => {
    impact("light"); // 🏁 TACTILE SYNC: Micro-tick on expansion
    if (onClick) onClick(e);
  };

  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      onClick={handleInteract}
      className={cn(
        "group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-500",
        "hover:bg-primary/5 active:scale-[0.98] outline-none",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER CONTENT
 * Logic: Momentum-based height reveal with fade-ingress.
 */
function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        // 🚀 THE WATER ENGINE: Cubic-Bezier Momentum for Height
        "overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "data-[state=closed]:animate-out data-[state=open]:animate-in",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2",
        className
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };