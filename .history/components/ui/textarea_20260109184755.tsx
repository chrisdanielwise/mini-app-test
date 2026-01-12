import * as React from 'react'
import { cn } from '@/src/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-24 w-full rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 text-sm font-medium transition-all outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 disabled:cursor-not-allowed disabled:opacity-50 field-sizing-content',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }