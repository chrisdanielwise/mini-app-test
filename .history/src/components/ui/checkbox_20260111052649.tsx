'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hapticFeedback } from '@/lib/telegram/webapp'

/**
 * 🛰️ CHECKBOX (Apex Tier)
 * Normalized: World-standard fluid scaling and institutional squircle geometry.
 * Optimized: Adaptive haptics and high-resiliency touch-targets for batch audits.
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  
  const handleToggle = (checked: boolean | 'indeterminate') => {
    // ⚡ TACTILE HANDSHAKE: Institutional confirmation
    hapticFeedback("light");
    if (props.onCheckedChange) props.onCheckedChange(checked);
  };

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      onCheckedChange={handleToggle}
      className={cn(
        // Viewport-Safe Geometry
        'peer size-5 md:size-6 shrink-0 rounded-md md:rounded-lg border transition-all duration-300 outline-none select-none',
        // State Physics: Checked
        'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/20',
        // State Physics: Unchecked
        'bg-muted/10 backdrop-blur-md border-border/40 hover:border-primary/40',
        // Interaction Handshake
        'focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-90 disabled:cursor-not-allowed disabled:opacity-20',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current animate-in zoom-in-50 duration-300"
      >
        <CheckIcon className="size-3.5 md:size-4 stroke-[4px]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }