"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ BUTTON (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: h-11 standard and shrunken typography prevent layout blowout.
 */
const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none outline-none",
    "font-black uppercase italic tracking-widest transition-all duration-500",
    "disabled:pointer-events-none disabled:opacity-10 active:scale-95 shrink-0",
    "[&_svg:not([class*='size-'])]:size-3.5 md:[&_svg:not([class*='size-'])]:size-4"
  ),
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90",
        destructive:
          "bg-rose-500 text-white shadow-lg hover:bg-rose-600",
        outline:
          "border border-white/5 bg-zinc-950/40 backdrop-blur-xl hover:bg-white/5 hover:border-primary/20 hover:text-primary",
        secondary:
          "bg-white/5 text-foreground/60 border border-white/5 backdrop-blur-md hover:bg-white/10",
        ghost:
          "hover:bg-primary/5 hover:text-primary",
        link: 
          "text-primary underline-offset-4 hover:underline not-italic font-black p-0 h-auto",
      },
      size: {
        // 📐 TACTICAL SCALE: 44px (h-11) is the new Global Standard
        default: "h-11 px-5 text-[9px] rounded-xl",
        sm: "h-9 px-3.5 text-[7.5px] rounded-lg",
        lg: "h-14 px-8 text-[11px] rounded-2xl tracking-[0.3em]",
        icon: "size-11 rounded-xl",
        'icon-sm': "size-9 rounded-lg",
        'icon-lg': "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  haptic = "light",
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    haptic?: "light" | "medium" | "heavy" | "success";
  }) {
  const { impact, notification } = useHaptics();
  const { isReady } = useDeviceContext();
  const Comp = asChild ? Slot : "button";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 🛡️ HARDWARE HANDSHAKE: Prevent haptic jitter before hydration
    if (isReady) {
      if (haptic === "success") {
        notification("success");
      } else {
        impact(haptic as any);
      }
    }
    
    if (onClick) onClick(e);
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    />
  );
}

export { Button, buttonVariants };