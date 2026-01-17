"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

// 🏛️ Institutional Contexts
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SWITCH (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Toggle.
 * Fix: Tactical h-5.5 mass prevents layout blowout in high-density HUDs.
 */
function Switch({
  className,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const { selectionChange } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
      if (isReady) selectionChange();
      if (onCheckedChange) onCheckedChange(checked);
    },
    [onCheckedChange, selectionChange, isReady]
  );

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      onCheckedChange={handleCheckedChange}
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-white/5 transition-all outline-none",
        isMobile ? "h-5 w-9" : "h-5.5 w-10",
        
        // 🌫️ LAMINAR DEPTH: Obsidian depth logic
        "data-[state=unchecked]:bg-zinc-950/40 data-[state=unchecked]:backdrop-blur-xl",
        "data-[state=checked]:bg-primary/80 data-[state=checked]:border-primary/20",
        
        "focus-visible:ring-2 focus-visible:ring-primary/10",
        "disabled:cursor-not-allowed disabled:opacity-10",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isMobile ? "size-4" : "size-4.5",
          // 🚀 KINETIC TRANSLATION: Technical offsets
          isMobile 
            ? "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5" 
            : "data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0.5",
          "data-[state=unchecked]:bg-muted-foreground/40"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };