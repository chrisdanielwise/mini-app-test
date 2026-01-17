"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ShieldAlert, Terminal, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ ALERT (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: p-4 padding and shrunken typography prevent layout blowout.
 */
const alertVariants = cva(
  cn(
    "relative w-full overflow-hidden rounded-xl border p-4 backdrop-blur-xl transition-all duration-500",
    "grid has-[>svg]:grid-cols-[calc(var(--spacing)*4.5)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start",
    "animate-in fade-in slide-in-from-top-2"
  ),
  {
    variants: {
      variant: {
        default: "bg-zinc-950/40 border-white/5 text-foreground shadow-2xl",
        destructive:
          "text-rose-500 bg-rose-500/5 border-rose-500/10 shadow-lg",
        protocol: 
          "bg-primary/5 border-primary/10 text-primary shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const { notification } = useHaptics();
  const { isReady } = useDeviceContext();

  // 🏁 TACTILE SYNC: Hardware-aware notification handshake
  React.useEffect(() => {
    if (!isReady) return;
    if (variant === "destructive") {
      notification("error");
    } else if (variant === "protocol") {
      notification("success");
    }
  }, [variant, notification, isReady]);

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {/* 🌫️ TACTICAL RADIANCE: Shrunken subsurface glow */}
      <div className={cn(
        "absolute -left-8 -top-8 size-20 blur-[40px] opacity-20 transition-opacity",
        variant === "destructive" ? "bg-rose-500" : "bg-primary"
      )} />

      {/* 📐 STATIONARY HUD ICON: Clinical size-3.5 */}
      <div className="col-start-1 mt-0.5">
        {props.children && React.Children.toArray(props.children).some(child => (child as any).type === "svg") 
          ? null 
          : <Activity className="size-3.5 opacity-40" />
        }
      </div>
      
      {props.children}
    </div>
  );
}

/**
 * 🛰️ ALERT_TITLE
 * Strategy: Technical Metadata Scale.
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 font-black uppercase italic tracking-widest text-[9px] md:text-[10px] leading-none",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ ALERT_DESCRIPTION
 * Strategy: Clinical Density Standard.
 */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 text-[8px] font-black uppercase tracking-[0.2em] italic opacity-30 leading-tight mt-1 px-0.5",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };