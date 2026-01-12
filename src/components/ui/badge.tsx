'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center border px-2 py-0.5 w-fit whitespace-nowrap shrink-0 gap-1.5 transition-all duration-300 overflow-hidden select-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/10',
        secondary:
          'border-border/40 bg-muted/30 text-muted-foreground backdrop-blur-md',
        destructive:
          'border-rose-500/20 bg-rose-500/10 text-rose-500 shadow-xl shadow-rose-500/5 animate-pulse',
        outline:
          'border-border/40 bg-card/40 text-foreground backdrop-blur-3xl italic font-black',
        success:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 italic font-black shadow-lg shadow-emerald-500/5',
      },
      size: {
        sm: 'text-[7px] md:text-[8px] rounded-md md:rounded-lg tracking-[0.15em] px-1.5',
        default: 'text-[8px] md:text-[9px] rounded-lg md:rounded-xl tracking-[0.2em] md:tracking-[0.3em] px-2.5 py-1',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

/**
 * 🛰️ STATUS BADGE (Apex Tier)
 * Normalized: World-standard fluid typography and institutional squircle geometry.
 * Optimized: Kinetic status pulses and high-resiliency micro-tracking.
 */
function Badge({
  className,
  variant,
  size,
  asChild = false,
  showPulse = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { 
    asChild?: boolean;
    showPulse?: boolean;
  }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {showPulse && <Zap className="size-2 md:size-2.5 fill-current animate-pulse" />}
      <span className="font-black uppercase italic leading-none">
        {props.children}
      </span>
    </Comp>
  )
}

export { Badge, badgeVariants }