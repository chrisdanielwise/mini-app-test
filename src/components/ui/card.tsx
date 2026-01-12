"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Terminal, Zap } from 'lucide-react';

/**
 * 🛰️ CARD (Apex Tier)
 * Normalized: World-standard fluid typography and institutional squircle geometry.
 * Optimized: Adaptive safe-zones and glass-depth for high-resiliency data nodes.
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'group relative flex flex-col gap-6 overflow-hidden transition-all duration-500',
        'rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl',
        'hover:border-primary/20 hover:shadow-primary/5',
        className,
      )}
      {...props}
    >
      {/* Blueprint Subliminal Branding */}
      <Terminal className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.02] -rotate-12 pointer-events-none" />
      {props.children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 md:gap-2 p-5 md:p-8 pb-0 md:pb-0',
        'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none text-foreground group-hover:text-primary transition-colors',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Zap className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
        {props.children}
      </div>
    </div>
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        'text-muted-foreground/60 text-[9px] md:text-[10px] font-bold uppercase tracking-widest italic leading-relaxed px-0.5',
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end mt-1',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('p-5 md:p-8 pt-0 md:pt-0', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center p-5 md:p-8 pt-0 md:pt-0 mt-auto',
        'border-t border-transparent [.border-t]:border-border/10 [.border-t]:mt-2',
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}