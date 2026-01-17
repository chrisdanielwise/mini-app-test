"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🌊 FLUID BADGE (Institutional v16.16.12)
 * Logic: Kinetic signal markers with atmospheric radiance.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center border w-fit whitespace-nowrap shrink-0 gap-1.5 select-none transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]",
        secondary:
          "border-white/5 bg-white/5 text-muted-foreground backdrop-blur-md hover:bg-white/10",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive shadow-[0_0_15px_rgba(var(--destructive-rgb),0.1)]",
        outline:
          "border-white/10 bg-card/40 text-foreground/70 backdrop-blur-2xl italic font-black hover:border-primary/40 hover:text-primary",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
      },
      size: {
        sm: "text-[8px] rounded-md px-1.5 py-0.5 tracking-[0.15em]",
        default: "text-[9px] rounded-xl px-2.5 py-1 tracking-[0.25em]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  showPulse = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    showPulse?: boolean;
  }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {showPulse && (
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <Zap className="relative size-2 fill-current" />
        </span>
      )}
      <span className="font-black uppercase italic leading-none">
        {props.children}
      </span>
    </Comp>
  );
}

export { Badge, badgeVariants };