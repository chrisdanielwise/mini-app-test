"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID SCROLL AREA (Institutional v16.16.12)
 * Logic: Momentum-based viewport with "Liquid" scrollbars.
 * Design: v9.9.1 Hardened Transparency.
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
        className="size-full rounded-[inherit] outline-none transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner className="bg-transparent" />
    </ScrollAreaPrimitive.Root>
  );
}

/**
 * 🌊 LIQUID SCROLLBAR
 * Logic: Fades in/out like water tension.
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  const { impact } = useHaptics();

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      // 🏁 TACTILE SYNC: Subtle feedback when engaging the scroll track
      onPointerDown={() => impact("light")}
      className={cn(
        "flex touch-none select-none transition-all duration-500 ease-in-out p-0.5",
        "data-[state=visible]:opacity-100 data-[state=hidden]:opacity-0",
        orientation === "vertical" && "h-full w-2 border-l border-white/5 bg-transparent",
        orientation === "horizontal" && "h-2 flex-col border-t border-white/5 bg-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb 
        data-slot="scroll-area-thumb" 
        className={cn(
          "relative flex-1 rounded-full transition-colors",
          "bg-foreground/10 hover:bg-primary/40 active:bg-primary/60",
          "backdrop-blur-md border border-white/10"
        )} 
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };