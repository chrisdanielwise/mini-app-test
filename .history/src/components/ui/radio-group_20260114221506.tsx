"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID RADIO GROUP
 * Logic: Grid-based logic gating with consistent vertical flow.
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-4", className)}
      {...props}
    />
  );
}

/**
 * 🌊 WATER RADIO ITEM
 * Logic: Haptic-synced selection with ambient depth.
 */
function RadioGroupItem({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const { selectionChange } = useHaptics();

  const handleInteract = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // 🏁 TACTILE SYNC: Hardware feedback when the logic gate shifts
      selectionChange();
      if (onClick) onClick(e);
    },
    [onClick, selectionChange]
  );

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      onClick={handleInteract}
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism
        "aspect-square size-5 shrink-0 rounded-full border border-white/10 bg-card/40 backdrop-blur-md",
        "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/5 focus-visible:outline-none",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary/10",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        {/* 🌊 FLUID INDICATOR: Expands like a drop of liquid */}
        <div className="size-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] animate-in zoom-in-50 duration-300" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };