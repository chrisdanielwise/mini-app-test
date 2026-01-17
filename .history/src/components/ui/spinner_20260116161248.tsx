"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SPINNER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Velocity & Optical Thinning.
 * Fix: Tactical sizes shrunken by 15% for high-density HUD oversight.
 */
const spinnerVariants = cva(
  "animate-spin shrink-0 transition-colors duration-500",
  {
    variants: {
      size: {
        // 📐 TACTICAL SCALE: Shrunken for HUD integration
        xs: "size-2.5",
        sm: "size-3.5",
        md: "size-5",
        lg: "size-8",
        xl: "size-12",
      },
      variant: {
        default: "text-primary/60",
        muted: "text-muted-foreground/10",
        white: "text-white/40",
        amber: "text-amber-500/50",
      }
    },
    defaultVariants: {
      size: "sm",
      variant: "default",
    },
  }
);

interface SpinnerProps 
  extends React.ComponentProps<"svg">, 
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, variant, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Hydrating_Node..."
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    />
  );
}

/**
 * 🛰️ LOADING_SCREEN
 * Strategy: Obsidian-OLED Depth & Stationary HUD Ingress.
 */
function LoadingScreen() {
  const { isReady } = useDeviceContext();

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-zinc-950/60 backdrop-blur-3xl">
      <div className="flex flex-col items-center gap-3 text-center">
        {/* 🌫️ LAMINAR RADIANCE: Subsurface signal leak */}
        <div className="relative flex items-center justify-center">
           <div className="absolute size-24 animate-pulse rounded-full bg-primary/5 blur-3xl" />
           <Spinner size="lg" className="relative z-10" />
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase italic tracking-[0.4em] text-primary/60 animate-pulse">
            Synchronizing_Link...
          </span>
          <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-muted-foreground/10">
            Node_Hydration_Active
          </span>
        </div>
      </div>

      {/* 📏 STATIONARY GRID ANCHOR */}
      <div className="absolute bottom-16 h-[0.5px] w-16 bg-white/10" />
    </div>
  );
}

export { Spinner, LoadingScreen };