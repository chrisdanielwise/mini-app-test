"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

/**
 * 🌊 FLUID SEPARATOR (Institutional v16.16.12)
 * Logic: Gradient Ingress to maintain visual "Water Flow."
 * Design: v9.9.1 Hardened Transparency.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        // 🏛️ Style Hardening: Subtle Depth over Solid Lines
        "shrink-0 opacity-20 transition-all duration-700",
        
        // 🌊 HORIZONTAL FLOW: Fades at ends to prevent "Boxy" look
        orientation === "horizontal" 
          ? "h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" 
          : "h-full w-[1px] bg-gradient-to-b from-transparent via-border to-transparent",
          
        className
      )}
      {...props}
    />
  );
}

export { Separator };