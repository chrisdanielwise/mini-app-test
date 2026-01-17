"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SEPARATOR (Institutional Apex v2026.1.20)
 * Strategy: Laminar Ingress & Optical Thinning.
 * Design: v9.9.1 Hardened Transparency (Stationary HUD Standard).
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
        // 📐 OPTICAL THINNING: Reduced mass for high-density oversight
        "shrink-0 opacity-10 transition-opacity duration-500",
        
        // 🌫️ LAMINAR FLOW: Pressure-balanced gradients
        orientation === "horizontal" 
          ? "h-[0.5px] w-full bg-gradient-to-r from-transparent via-white to-transparent" 
          : "h-full w-[0.5px] bg-gradient-to-b from-transparent via-white to-transparent",
          
        className
      )}
      {...props}
    />
  );
}

export { Separator };