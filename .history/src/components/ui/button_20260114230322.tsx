"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID BUTTON VARIANTS (Institutional v16.16.12)
 * Logic: Momentum-based scaling with v9.9.1 Glassmorphism.
 */
const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap select-none outline-none",
    "font-black uppercase italic tracking-[0.2em] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "disabled:pointer-events-none disabled:opacity-20 active:scale-90 shrink-0",
    "[&_svg:not([class*='size-'])]:size-4 md:[&_svg:not([class*='size-'])]:size-5"
  ),
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_0_20px_rgba(var(--destructive-rgb),0.3)] hover:bg-destructive/90",
        outline:
          "border border-white/10 bg-card/30 backdrop-blur-md hover:bg-primary/10 hover:border-primary/40 hover:text-primary",
        secondary:
          "bg-white/5 text-foreground border border-white/5 backdrop-blur-sm hover:bg-white/10",
        ghost:
          "hover:bg-primary/5 hover:text-primary hover:tracking-[0.3em]",
        link: 
          "text-primary underline-offset-4 hover:underline not-italic font-bold p-0 h-auto",
      },
      size: {
        default: "h-11 md:h-12 px-6 text-[10px] md:text-xs rounded-xl md:rounded-2xl",
        sm: "h-9 md:h-10 px-4 text-[9px] md:text-[10px] rounded-lg md:rounded-xl",
        lg: "h-14 md:h-16 px-10 text-[11px] md:text-sm rounded-2xl md:rounded-[2.5rem] tracking-[0.3em]",
        icon: "size-11 md:size-12 rounded-xl md:rounded-2xl",
        'icon-sm': "size-9 md:size-10 rounded-lg md:rounded-xl",
        'icon-lg': "size-14 md:size-16 rounded-2xl md:rounded-[2.5rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * 🌊 FLUID BUTTON
 * Logic: Haptic-synced kinetic trigger.
 * Optimization: Role-aware scaling for Merchant ingress.
 */
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
  const Comp = asChild ? Slot : "button";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 🏁 TACTILE HANDSHAKE: Institutional confirmation logic
    if (haptic === "success") {
      notification("success");
    } else {
      impact(haptic as any);
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