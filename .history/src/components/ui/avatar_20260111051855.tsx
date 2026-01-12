'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 🛰️ IDENTITY NODE (Apex Tier)
 * Normalized: Adaptive Squircle geometry and fluid typography.
 * Optimized: High-resiliency fallback states for Telegram profile sync.
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-9 md:size-11 shrink-0 overflow-hidden rounded-xl md:rounded-2xl',
        'border border-border/20 bg-card/40 backdrop-blur-3xl shadow-inner',
        'transition-all duration-500 hover:scale-105 active:scale-95',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-xl md:rounded-2xl bg-primary/10',
        'text-[10px] md:text-xs font-black uppercase italic tracking-widest text-primary',
        className,
      )}
      {...props}
    >
      {/* 🛡️ Institutional Fallback: Renders initials or system icon */}
      {props.children || <User className="h-4 w-4 md:h-5 md:w-5 opacity-40" />}
    </AvatarPrimitive.Fallback>
  )
}

export { Avatar, AvatarImage, AvatarFallback }