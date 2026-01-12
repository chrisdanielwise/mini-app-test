'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/src/lib/utils'

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:bg-muted text-muted-foreground data-[state=on]:bg-primary/10 data-[state=on]:text-primary',
        outline:
          'border border-border bg-transparent shadow-sm hover:bg-muted data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-primary',
      },
      size: {
        default: 'h-10 px-3 min-w-10',
        sm: 'h-8 px-2 min-w-8 text-xs',
        lg: 'h-12 px-4 min-w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }