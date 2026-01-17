"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SELECT (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 */
function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

/**
 * 🛰️ SELECT_TRIGGER
 * Strategy: Technical Hit-zone & Hardware Handshake.
 * Fix: Tactical h-9 height and shrunken metadata scale prevent layout blowout.
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
  const { isReady, isMobile } = useDeviceContext();

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      onClick={() => isReady && selectionChange()}
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 10%
        "flex w-fit items-center justify-between gap-2.5 border transition-all duration-300",
        "bg-zinc-950/20 backdrop-blur-xl border-white/5",
        "text-[9px] font-black uppercase italic tracking-widest text-muted-foreground/60",
        "outline-none active:scale-95 focus:ring-2 focus:ring-primary/5 focus:border-primary/20",
        isMobile ? "h-9 rounded-lg px-3" : "h-10 rounded-xl px-4",
        "disabled:opacity-10",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-3.5 opacity-20 transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/**
 * 🛰️ SELECT_CONTENT
 * Strategy: Stationary HUD Membrane.
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
          "relative z-[500] min-w-[10rem] overflow-hidden border shadow-2xl transition-all",
          "bg-zinc-950/90 backdrop-blur-3xl border-white/5",
          "rounded-xl duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
          position === "popper" && "data-[side=bottom]:translate-y-1.5 data-[side=top]:-translate-y-1.5",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

/**
 * 🛰️ SELECT_ITEM
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const { impact } = useHaptics();
  const { isReady } = useDeviceContext();

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      onPointerUp={() => isReady && impact("light")}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-3 pr-9 outline-none transition-all",
        "text-[9px] font-black uppercase tracking-widest text-muted-foreground/40",
        "focus:bg-primary/5 focus:text-primary data-[disabled]:opacity-10",
        className
      )}
      {...props}
    >
      <span className="absolute right-3 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-3 text-primary animate-in zoom-in-50" />
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
  return (
    <SelectPrimitive.Label 
      className={cn("px-3 py-1 text-[7.5px] font-black uppercase tracking-[0.4em] opacity-10 italic", className)} 
      {...props} 
    />
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-white/5", className)} {...props} />;
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