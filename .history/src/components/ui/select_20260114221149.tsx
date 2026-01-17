"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID SELECT (Institutional v16.16.12)
 * Logic: Haptic-synced logic gating with organic momentum.
 */
function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

/**
 * 🌊 WATER TRIGGER
 */
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  const { selectionChange } = useHaptics();

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      onClick={() => selectionChange()}
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism & Fluidity
        "flex w-fit items-center justify-between gap-2 rounded-xl border border-white/10 bg-card/40 backdrop-blur-md px-3 py-2 text-[11px] font-black uppercase italic tracking-widest transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "outline-none active:scale-95 focus:ring-4 focus:ring-primary/5 focus:border-primary/40",
        "disabled:opacity-40 data-[size=default]:h-10 data-[size=sm]:h-8",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-40 transition-transform duration-500 group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/**
 * 🌊 WATER CONTENT
 */
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-2xl border border-white/10 bg-card/90 backdrop-blur-2xl shadow-2xl",
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          position === "popper" && "data-[side=bottom]:translate-y-2 data-[side=top]:-translate-y-2",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

/**
 * 🌊 WATER ITEM
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const { impact } = useHaptics();

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      onPointerUp={() => impact("light")}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-3 pr-9 text-[11px] font-bold uppercase tracking-wider outline-none transition-colors focus:bg-primary/10 focus:text-primary data-[disabled]:opacity-40",
        className
      )}
      {...props}
    >
      <span className="absolute right-3 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

/**
 * 🏛️ INSTITUTIONAL UTILITIES
 */
function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label className={cn("px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40", className)} {...props} />;
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn("-mx-1 my-1.5 h-px bg-white/5", className)} {...props} />;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};