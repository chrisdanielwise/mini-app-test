"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ ASPECT_RATIO (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Geometry Lock.
 * Fix: rounded-xl/2xl and clinical borders prevent visual blowout.
 */
function AspectRatio({
  className,
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  const { isMobile } = useDeviceContext();

  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical Radius Standard
        "relative overflow-hidden",
        isMobile ? "rounded-xl" : "rounded-2xl",
        
        // 🌫️ LAMINAR DEPTH: Stationary HUD aesthetic
        "border border-white/5 bg-zinc-950/40 backdrop-blur-xl",
        
        // 🚀 KINETIC INGRESS: Momentum physics
        "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        
        // 🎞️ MEDIA HANDSHAKE: Data-dense scaling
        "[&_img]:object-cover [&_img]:size-full [&_video]:object-cover [&_video]:size-full",
        "[&_img]:transition-all [&_img]:duration-700 hover:[&_img]:scale-105 hover:[&_img]:opacity-80",
        
        className
      )}
      {...props}
    />
  );
}

export { AspectRatio };