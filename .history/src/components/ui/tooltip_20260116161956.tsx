"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ TOOLTIP (Institutional Apex v2026.1.20)
 * Strategy: Environment-Aware Logic Gating.
 * Fix: Tactical suppression on XS/SM tiers prevents safe-area collision.
 */
const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = ({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const { isMobile } = useDeviceContext();
  
  // 🛡️ HARDWARE GUARD: Mobile users receive Haptics via triggers instead of hover.
  if (isMobile) return <>{props.children}</>;

  return (
    <TooltipPrimitive.Root 
      data-slot="tooltip" 
      delayDuration={200} // Institutional scanning speed
      {...props} 
    />
  );
};

const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * 🛰️ TOOLTIP_CONTENT
 * Strategy: Stationary HUD Membrane.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass standard
        "z-[1000] w-fit overflow-hidden rounded-lg border shadow-2xl transition-all",
        "bg-zinc-950/90 backdrop-blur-3xl border-white/5",
        "px-2.5 py-1.5",
        
        // 🏛️ APEX TYPOGRAPHY
        "text-[9px] font-black uppercase italic tracking-[0.2em] text-primary/80 leading-none",
        
        // 🚀 KINETIC INGRESS: High-velocity 200ms sync
        "animate-in fade-in-0 zoom-in-98 duration-200",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-98",
        "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1",
        "data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };