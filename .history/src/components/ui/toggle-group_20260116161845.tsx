"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

/**
 * 🛰️ TOGGLE_GROUP (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Rail.
 * Fix: Tactical h-10 footprint prevents layout blowout in dense HUDs.
 */
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => {
  const { isMobile } = useDeviceContext();
  
  const contextValue = React.useMemo(() => ({ variant, size }), [variant, size]);

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
        "flex items-center gap-1 w-fit border transition-all duration-300",
        "bg-zinc-950/20 backdrop-blur-3xl border-white/5",
        isMobile ? "h-9 rounded-xl p-0.5" : "h-10 rounded-2xl p-1",
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
 * 🛰️ TOGGLE_GROUP_ITEM
 * Strategy: Technical Selection & Hardware Handshake.
 */
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);
  const { selectionChange } = useHaptics();
  const { isReady } = useDeviceContext();

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      onClick={() => isReady && selectionChange()}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        // 🏛️ INSTITUTIONAL TYPOGRAPHY
        "rounded-lg px-3.5 text-[9px] font-black uppercase italic tracking-[0.2em] transition-all",
        "text-muted-foreground/30 hover:text-foreground hover:bg-white/5",
        
        // 🚀 KINETIC ACTIVE STATE
        "data-[state=on]:bg-zinc-950 data-[state=on]:text-primary data-[state=on]:shadow-2xl",
        "data-[state=on]:ring-1 data-[state=on]:ring-white/5",
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