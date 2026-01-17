"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics"; // 🚀 Merged Hook

const toggleVariants = cva(
  // 🏛️ Institutional v9.9.1 CSS: Hardened typography and focus states
  "inline-flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted/10 text-muted-foreground/60 data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
        outline: "border border-border/40 bg-transparent shadow-sm hover:bg-muted/10 data-[state=on]:border-primary/40 data-[state=on]:bg-primary/5 data-[state=on]:text-primary",
        ghost: "hover:bg-muted/10 data-[state=on]:text-primary", // Added for subtle dashboard filters
      },
      size: {
        default: "h-10 px-4 min-w-10",
        sm: "h-8 px-2.5 min-w-8",
        lg: "h-12 px-6 min-w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * 🛰️ TACTICAL TOGGLE (v16.16.12)
 * Logic: Merged Hardware Haptics + Atomic State Sync.
 * Standard: v9.5.8 (Fluid Interactions).
 */
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, onPressedChange, ...props }, ref) => {
  const { selectionChange } = useHaptics();

  const handlePressedChange = React.useCallback((pressed: boolean) => {
    // 🏁 TACTILE SYNC: Institutional Standard v9.5.0
    selectionChange();
    onPressedChange?.(pressed);
  }, [onPressedChange, selectionChange]);

  return (
    <TogglePrimitive.Root
      ref={ref}
      data-slot="toggle"
      onPressedChange={handlePressedChange}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };