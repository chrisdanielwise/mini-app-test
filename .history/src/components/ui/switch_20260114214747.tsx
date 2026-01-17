"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics"; // 🚀 Merged Hook

/**
 * 🛰️ TACTICAL SWITCH (Institutional v16.16.12)
 * Logic: Haptic-Synced Logic Gating with v9.5.0 Touch Targeting.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Switch({
  className,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const { selectionChange } = useHaptics();

  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      // 🏁 TACTILE SYNC: Institutional Standard v9.5.0
      selectionChange();
      if (onCheckedChange) onCheckedChange(checked);
    },
    [onCheckedChange, selectionChange]
  );

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      onCheckedChange={handleCheckedChange}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all outline-none",
        "focus-visible:ring-4 focus-visible:ring-primary/10",
        "disabled:cursor-not-allowed disabled:opacity-40",
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Track
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-card/60 data-[state=unchecked]:backdrop-blur-md",
        "border border-white/5",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-white shadow-xl ring-0 transition-transform",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          "data-[state=unchecked]:bg-foreground/80"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };