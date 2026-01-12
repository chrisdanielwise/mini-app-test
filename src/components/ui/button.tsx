"use client";

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { hapticFeedback } from '@/lib/telegram/webapp';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 md:[&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-95 select-none font-black uppercase italic tracking-widest",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90',
        destructive:
          'bg-rose-500 text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600',
        outline:
          'border border-border/40 bg-card/40 backdrop-blur-md hover:bg-muted/10 hover:border-primary/20 hover:text-primary',
        secondary:
          'bg-muted/30 text-foreground backdrop-blur-md hover:bg-muted/50 border border-border/10',
        ghost:
          'hover:bg-primary/5 hover:text-primary',
        link: 'text-primary underline-offset-4 hover:underline not-italic font-bold',
      },
      size: {
        default: 'h-11 md:h-12 px-6 py-2 text-[10px] md:text-xs rounded-xl md:rounded-2xl',
        sm: 'h-9 md:h-10 px-4 text-[9px] md:text-[10px] rounded-lg md:rounded-xl gap-1.5',
        lg: 'h-14 md:h-16 px-10 text-[11px] md:text-sm rounded-2xl md:rounded-[2rem] tracking-[0.2em]',
        icon: 'size-11 md:size-12 rounded-xl md:rounded-2xl',
        'icon-sm': 'size-9 md:size-10 rounded-lg md:rounded-xl',
        'icon-lg': 'size-14 md:size-16 rounded-2xl md:rounded-[2rem]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

/**
 * ⚡ BUTTON (Apex Tier)
 * Normalized: World-standard fluid typography and institutional squircle geometry.
 * Optimized: Adaptive haptics and kinetic touch-targets for Merchant ingress.
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  haptic = "light",
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    haptic?: "light" | "medium" | "heavy" | "success";
  }) {
  const Comp = asChild ? Slot : 'button'

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger institutional haptic handshake
    hapticFeedback(haptic as any);
    if (props.onClick) props.onClick(e as any);
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    />
  )
}

export { Button, buttonVariants }