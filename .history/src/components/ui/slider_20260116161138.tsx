"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SLIDER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Target.
 * Fix: Tactical h-1.5 track and hardened radii prevent layout blowout.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const { selectionChange } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  // 🛡️ Logic to determine thumb count
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min],
    [value, defaultValue, min]
  );

  const handleValueChange = React.useCallback(
    (newValues: number[]) => {
      // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
      if (isReady) selectionChange();
      if (onValueChange) onValueChange(newValues);
    },
    [onValueChange, selectionChange, isReady]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onValueChange={handleValueChange}
      className={cn(
        "relative flex w-full touch-none items-center select-none disabled:opacity-10",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-32 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-zinc-950/40 relative grow overflow-hidden backdrop-blur-3xl border border-white/5",
          isMobile 
            ? "rounded-sm data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1" 
            : "rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-primary/60 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      
      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className={cn(
            "block shrink-0 border border-primary/40 bg-zinc-950 shadow-2xl transition-all",
            "hover:bg-primary/10 active:scale-90 focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:outline-none",
            "disabled:pointer-events-none disabled:opacity-50",
            // 📐 GEOMETRY LOCK: Tactical hit-zones
            isMobile ? "size-5 rounded-md" : "size-4 rounded-lg"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };