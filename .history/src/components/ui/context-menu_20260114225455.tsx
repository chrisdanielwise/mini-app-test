"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID CONTEXT MENU
 * Logic: Haptic-synced point-of-contact ingress.
 */
const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

/**
 * 🌊 WATER CONTENT
 * Logic: Momentum-based inflation from coordinates.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  const { impact } = useHaptics();

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        onUpdate={() => impact("light")} // 🏁 TACTILE SYNC: Micro-tick on surface break
        className={cn(
          // 🏛️ Style Hardening: v9.9.1 Glassmorphism (Deep Blur)
          "z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-white/10 bg-card/90 p-1.5 shadow-2xl backdrop-blur-2xl",
          
          // 🚀 THE WATER ENGINE: Cubic-Bezier Momentum
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100",
          
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

/**
 * 🌊 WATER ITEM
 * Logic: Tactile confirmation on logic gate closure.
 */
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  onSelect,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  const { selectionChange } = useHaptics();

  const handleSelect = (e: Event) => {
    selectionChange(); // 🏁 TACTILE SYNC: Feel the action register
    if (onSelect) onSelect(e);
  };

  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      onSelect={handleSelect}
      className={cn(
        "relative flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-bold outline-none transition-colors",
        "focus:bg-primary/10 focus:text-primary data-[disabled]:opacity-40 data-[inset]:pl-8",
        variant === "destructive" && "text-destructive focus:bg-destructive/10",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🏛️ INSTITUTIONAL UTILITIES
 */
function ContextMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean }) {
  return <ContextMenuPrimitive.Label className={cn("px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 data-[inset]:pl-8", className)} {...props} />;
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return <ContextMenuPrimitive.Separator className={cn("-mx-1.5 my-1.5 h-px bg-white/5", className)} {...props} />;
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-[10px] font-black uppercase tracking-widest opacity-30", className)} {...props} />;
}

/**
 * 🌊 WATER SUB-TRIGGER / CONTENT
 */
function ContextMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-lg px-3 py-2 text-[12px] font-bold outline-none focus:bg-primary/10 data-[state=open]:bg-primary/10",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3.5 opacity-40" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        className
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};