"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-10 outline-none focus-visible:ring-1 focus-visible:ring-primary/20 whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        // 📐 LAMINAR DEPTH: v2026 Obsidian standard
        default: "bg-transparent text-muted-foreground/30 hover:bg-white/5 data-[state=on]:bg-primary/5 data-[state=on]:text-primary",
        outline: "border border-white/5 bg-transparent shadow-sm hover:bg-white/5 data-[state=on]:border-primary/20 data-[state=on]:bg-primary/5 data-[state=on]:text-primary",
        ghost: "hover:bg-white/5 data-[state=on]:text-primary data-[state=on]:bg-white/5",
      },
      size: {
        // 📐 TACTICAL SCALE: Shrunken by 15%
        sm: "h-8 px-2.5 text-[8.5px] rounded-lg",
        default: "h-9 px-4 text-[9px] rounded-xl",
        lg: "h-11 px-6 text-[10.5px] rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * 🛰️ TOGGLE (Institutional Apex v2026.1.20)
 * Strategy: Technical Selection & Hardware Handshake.
 */
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, onPressedChange, ...props }, ref) => {
  const { selectionChange } = useHaptics();
  const { isReady } = useDeviceContext();

  const handlePressedChange = React.useCallback((pressed: boolean) => {
    // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
    if (isReady) selectionChange();
    onPressedChange?.(pressed);
  }, [onPressedChange, selectionChange, isReady]);

  return (
    <TogglePrimitive.Root
      ref={ref}
      data-slot="toggle"
      onPressedChange={handlePressedChange}
      className={cn(
        "font-black uppercase italic tracking-[0.2em]", // 🏛️ Institutional Branding
        toggleVariants({ variant, size, className })
      )}
      {...props}
    />
  );
});

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };