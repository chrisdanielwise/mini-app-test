"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID DROPDOWN MENU
 * Logic: Haptic-synced contextual nodes.
 */
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * 🌊 WATER CONTENT
 * Logic: Momentum-based inflation with deep glassmorphism.
 */
function DropdownMenuContent({
  className,
  sideOffset = 8, // 🚀 Increased offset for fluid depth
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          // 🏛️ Style Hardening: v9.9.1 Glassmorphism
          "z-50 min-w-[10rem] overflow-hidden rounded-2xl border border-white/10 bg-card/90 p-1.5 shadow-2xl backdrop-blur-2xl",
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-4 data-[side=top]:slide-in-from-bottom-4",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * 🌊 WATER ITEM
 * Logic: Haptic-synced selection confirmation.
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  onSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  const { impact } = useHaptics();

  const handleSelect = (e: Event) => {
    impact("light"); // 🏁 TACTILE SYNC: Feel the action register
    if (onSelect) onSelect(e);
  };

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      onSelect={handleSelect}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold outline-none transition-colors",
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
function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return <DropdownMenuPrimitive.Label className={cn("px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 data-[inset]:pl-8", className)} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className={cn("-mx-1.5 my-1.5 h-px bg-white/5", className)} {...props} />;
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-[10px] font-black uppercase tracking-widest opacity-40", className)} {...props} />;
}

/**
 * 🌊 WATER SUB-TRIGGER / CONTENT
 */
function DropdownMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-lg px-3 py-2 text-[12px] font-bold outline-none focus:bg-primary/10 data-[state=open]:bg-primary/10",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3.5 opacity-40" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-white/10 bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out duration-500",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};