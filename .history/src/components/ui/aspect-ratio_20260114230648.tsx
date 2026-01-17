"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "@/lib/utils";

/**
 * 🌊 FLUID ASPECT RATIO (Institutional v16.16.12)
 * Logic: Atmospheric framing for media and telemetry nodes.
 * Optimization: Forces v9.9.1 morphology on all children.
 */
function AspectRatio({
  className,
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={cn(
        // 🏛️ Style Hardening: Unified Geometry
        "relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]",
        "border border-white/5 bg-card/10 backdrop-blur-md",
        
        // 🚀 THE WATER ENGINE: Momentum Ingress
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        
        // 🎞️ Content Scaling
        "[&_img]:object-cover [&_img]:size-full [&_video]:object-cover [&_video]:size-full",
        "[&_img]:transition-transform [&_img]:duration-1000 hover:[&_img]:scale-110",
        
        className
      )}
      {...props}
    />
  );
}

export { AspectRatio };