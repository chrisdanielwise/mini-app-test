"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ShieldAlert, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID ALERT (Institutional v16.16.12)
 * Logic: Haptic-ready signal node with organic ingress.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
const alertVariants = cva(
  cn(
    "relative w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border p-6 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "grid has-[>svg]:grid-cols-[calc(var(--spacing)*6)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-4 gap-y-1 items-start",
    "animate-in fade-in slide-in-from-top-4"
  ),
  {
    variants: {
      variant: {
        default: "bg-card/30 border-white/5 text-foreground shadow-2xl",
        destructive:
          "text-destructive bg-destructive/5 border-destructive/20 shadow-[0_0_40px_rgba(var(--destructive-rgb),0.1)]",
        protocol: 
          "bg-primary/5 border-primary/20 text-primary shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]",
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

  // 🏁 TACTILE SYNC: Trigger haptic notification based on alert severity
  React.useEffect(() => {
    if (variant === "destructive") {
      notification("error");
    } else if (variant === "protocol") {
      notification("success");
    }
  }, [variant, notification]);

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {/* 🌊 AMBIENT RADIANCE: Subsurface light leak */}
      <div className={cn(
        "absolute -left-12 -top-12 size-32 blur-[60px] opacity-40 transition-opacity duration-1000",
        variant === "destructive" ? "bg-destructive" : "bg-primary"
      )} />

      {/* Blueprint Subliminal Branding */}
      <div className="absolute -bottom-4 -right-4 h-20 w-20 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform">
        {variant === "destructive" ? <ShieldAlert className="-rotate-12" /> : <Terminal />}
      </div>
      
      {props.children}
    </div>
  );
}

/**
 * 🏛️ INSTITUTIONAL TYPOGRAPHY
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 font-black uppercase italic tracking-[0.2em] text-[11px] md:text-xs leading-none",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest italic opacity-50 leading-relaxed px-0.5",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };