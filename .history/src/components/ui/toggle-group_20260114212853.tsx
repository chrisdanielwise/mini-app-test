"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";
import { useHaptics } from "@/lib/hooks/use-haptics"; // 🚀 Merged Hook

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

/**
 * 🛰️ TACTICAL TOGGLE GROUP (v16.16.12)
 * Logic: Grouped Mode Switching with Hardware Bridging.
 * Standard: v9.5.0 Institutional Layout.
 */
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => {
  // 🛡️ MEMOIZED CONTEXT: Prevents redundant sub-node calculations
  const contextValue = React.useMemo(() => ({ variant, size }), [variant, size]);

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      className={cn(
        "flex items-center gap-1.5 w-fit rounded-2xl border border-border/10 bg-card/40 p-1 backdrop-blur-md", 
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={contextValue}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

/**
 * 🛰️ TOGGLE GROUP ITEM
 * Logic: Integrated Selection Haptics for mode confirmation.
 */
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);
  const { selectionChange } = useHaptics();

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      onClick={() => selectionChange()} // 🏁 Hardware feedback on mode selection
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        // 🏛️ Style Hardening: v9.5.8 Fluidity
        "rounded-[10px] px-4 font-black transition-all",
        "data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };