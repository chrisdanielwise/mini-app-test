"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics"; // 🚀 Merged Hook

/**
 * 🛰️ TACTICAL SLIDER (Institutional v16.16.12)
 * Logic: Haptic-Synced Range Input with v9.5.0 Touch Targeting.
 * Standard: v9.9.1 Hardened Glassmorphism.
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
      // 🏁 TACTILE SYNC: Provides "Gear Ticks" during movement
      selectionChange();
      if (onValueChange) onValueChange(newValues);
    },
    [onValueChange, selectionChange]
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
        "relative flex w-full touch-none items-center select-none disabled:opacity-50",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-card/40 relative grow overflow-hidden rounded-full backdrop-blur-md border border-white/5 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      
      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className={cn(
            "block size-5 shrink-0 rounded-full border-2 border-primary bg-background shadow-xl transition-all",
            "hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };