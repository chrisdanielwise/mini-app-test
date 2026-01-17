"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

/**
 * 🛰️ TACTICAL TOOLTIP (Institutional v16.16.12)
 * Logic: Environment-Aware Rendering (Suppressed on Mobile).
 * Design: v9.5.0 Glassmorphism + v9.9.1 Hardened Borders.
 */

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = ({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const { isMobile } = useDeviceContext();
  
  // 🛡️ TACTICAL GUARD: Suppress tooltips on mobile to prevent UI overlap
  // Mobile users rely on Haptic Feedback instead of hover text.
  if (isMobile) return <>{props.children}</>;

  return (
    <TooltipPrimitive.Root 
      data-slot="tooltip" 
      delayDuration={150} // Optimized for institutional scanning speed
      {...props} 
    />
  );
};

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        // 🏛️ Institutional v9.9.1 Styling
        "z-[100] w-fit overflow-hidden rounded-xl border border-border/40",
        "bg-card/95 px-3 py-1.5 backdrop-blur-xl", // Enhanced Glassmorphism
        "text-[10px] font-black uppercase tracking-widest text-foreground shadow-2xl",
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };