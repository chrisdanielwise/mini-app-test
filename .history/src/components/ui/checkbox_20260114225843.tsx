"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID CHECKBOX (Institutional v16.16.12)
 * Logic: Haptic-synced logic gating with "Liquid Ingress" animation.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Checkbox({
  className,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const { impact } = useHaptics();

  const handleToggle = (checked: boolean | "indeterminate") => {
    // 🏁 TACTILE SYNC: Feel the logic gate snap into place
    impact("light");
    if (onCheckedChange) onCheckedChange(checked);
  };

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      onCheckedChange={handleToggle}
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Squircle
        "peer size-5 md:size-6 shrink-0 rounded-xl border border-white/10 bg-card/40 backdrop-blur-md",
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] outline-none select-none",
        
        // 🌊 WATER FLOW: State Physics (Checked)
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        "data-[state=checked]:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]",
        
        // 🚀 Interaction Momentum
        "hover:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 active:scale-90",
        "disabled:cursor-not-allowed disabled:opacity-20 disabled:grayscale",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {/* 🌊 LIQUID INGRESS: Check icon scales from the center depth */}
        <CheckIcon className="size-3.5 md:size-4 stroke-[4px] animate-in zoom-in-50 duration-500 ease-out" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };