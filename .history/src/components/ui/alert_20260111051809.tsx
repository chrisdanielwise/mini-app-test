"use client";

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ShieldAlert, Terminal, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-2xl md:rounded-[2.5rem] border backdrop-blur-3xl p-4 md:p-6 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-4 gap-y-1 items-start transition-all duration-500 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-card/40 border-border/40 text-foreground shadow-sm',
        destructive:
          'text-rose-500 bg-rose-500/5 border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.05)] *:data-[slot=alert-description]:text-rose-500/70',
        protocol: 
          'bg-primary/5 border-primary/20 text-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.05)] *:data-[slot=alert-description]:text-primary/70',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * 🛰️ ALERT TELEMETRY (Apex Tier)
 * Normalized: World-standard fluid typography and institutional glass geometry.
 * Optimized: Adaptive safe-zones and high-resiliency status signaling.
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {/* Blueprint Subliminal Branding */}
      <div className="absolute -bottom-4 -right-4 h-16 w-16 opacity-[0.03] pointer-events-none">
        {variant === 'destructive' ? <ShieldAlert className="-rotate-12" /> : <Terminal />}
      </div>
      {props.children}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-black uppercase italic tracking-tighter text-[11px] md:text-xs leading-none',
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground/60 col-start-2 grid justify-items-start gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest italic leading-relaxed px-0.5',
        className,
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }