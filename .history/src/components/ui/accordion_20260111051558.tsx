'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hapticFeedback } from '@/lib/telegram/webapp'

/**
 * 🛰️ ACCORDION PROTOCOL (Apex Tier)
 * Normalized: World-standard fluid typography and touch-safe targets.
 * Optimized: Adaptive haptics and kinetic expansion for high-resiliency data disclosure.
 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        'border-b border-border/10 last:border-b-0 transition-colors', 
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        onClick={() => hapticFeedback("light")}
        className={cn(
          'focus-visible:ring-primary/20 flex flex-1 items-center justify-between gap-4 rounded-xl py-5 md:py-6 text-left transition-all outline-none group',
          'text-[10px] md:text-xs font-black uppercase tracking-widest italic text-foreground/80 hover:text-primary',
          'disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:text-primary',
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Zap className="h-3 w-3 shrink-0 opacity-0 group-data-[state=open]:opacity-100 group-data-[state=open]:animate-pulse transition-opacity" />
          <span className="truncate">{children}</span>
        </div>
        <ChevronDownIcon className="text-muted-foreground/40 pointer-events-none size-4 shrink-0 transition-transform duration-300 group-hover:text-primary" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-[10px] md:text-xs font-medium leading-relaxed text-muted-foreground/70 tracking-tight italic",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      )}
      {...props}
    >
      <div className={cn('pt-0 pb-6 md:pb-8 px-1', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }