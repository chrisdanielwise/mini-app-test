"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SCROLL_AREA (Institutional Apex v2026.1.20)
 * Strategy: Vertical Velocity & Laminar Surface Tension.
 * Fix: Tactical w-1.5 scrollbar prevents viewport obstruction.
 */
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root 
      data-slot="scroll-area" 
      className={cn("relative overflow-hidden", className)} 
      {...props}
    >
      <ScrollAreaPrimitive.Viewport 
        data-slot="scroll-area-viewport" 
        className="size-full rounded-[inherit] outline-none"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner className="bg-transparent" />
    </ScrollAreaPrimitive.Root>
  );
}

/**
 * 🛰️ LAMINAR_SCROLLBAR
 * Strategy: Technical Boundary & Hardware Handshake.
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
      onPointerDown={() => isReady && impact("light")}
      className={cn(
        "flex touch-none select-none transition-all duration-300 p-[1px]",
        "data-[state=visible]:opacity-100 data-[state=hidden]:opacity-0",
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 25%
        orientation === "vertical" && "h-full w-1.5 border-l border-white/5 bg-transparent",
        orientation === "horizontal" && "h-1.5 flex-col border-t border-white/5 bg-transparent",
        // 🛡️ MORPHOLOGY: Auto-hide tracks on XS hardware to maximize HUD utility
        isMobile && "opacity-0 pointer-events-none",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb 
        data-slot="scroll-area-thumb" 
        className={cn(
          "relative flex-1 rounded-sm transition-colors",
          "bg-white/5 hover:bg-primary/20 active:bg-primary/40",
          "backdrop-blur-3xl border border-white/5"
        )} 
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };