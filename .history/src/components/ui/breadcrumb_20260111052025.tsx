'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal, Terminal } from 'lucide-react'
import { hapticFeedback } from '@/lib/telegram/webapp'
import { cn } from '@/lib/utils'

/**
 * 🛰️ TELEMETRY BREADCRUMB (Apex Tier)
 * Normalized: World-standard fluid typography and institutional path-tracking.
 * Optimized: Adaptive wrapping and haptic-ready navigation nodes for mobile staff.
 */
function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-1 md:gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] italic text-muted-foreground/40',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1 md:gap-2 min-w-0', className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      data-slot="breadcrumb-link"
      onClick={() => hapticFeedback("light")}
      className={cn(
        'hover:text-primary transition-colors duration-300 truncate max-w-[80px] md:max-w-none', 
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        'text-foreground font-black tracking-tighter truncate max-w-[100px] md:max-w-none', 
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3 md:[&>svg]:size-3.5 opacity-20', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-6 md:size-9 items-center justify-center opacity-40 hover:opacity-100 transition-opacity', className)}
      {...props}
    >
      <MoreHorizontal className="size-3 md:size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}