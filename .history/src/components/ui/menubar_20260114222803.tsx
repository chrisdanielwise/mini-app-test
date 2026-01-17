"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID MENUBAR (Institutional v16.16.12)
 * Logic: Haptic-synced command rail with organic flow.
 */
function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Rail
        "flex h-10 items-center gap-1 rounded-xl border border-white/5 bg-card/30 p-1 backdrop-blur-xl shadow-2xl",
        className
      )}
      {...props}
    />
  );
}

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
const MenubarSub = MenubarPrimitive.Sub;

/**
 * 🌊 WATER TRIGGER
 */
function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  const { selectionChange } = useHaptics();

  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      onPointerEnter={() => selectionChange()} // 🏁 TACTILE HOVER: Tick as we slide across the rail
      className={cn(
        "flex cursor-default select-none items-center rounded-lg px-3 py-1.5",
        "text-[11px] font-black uppercase italic tracking-widest transition-all duration-300",
        "outline-none focus:bg-primary/10 focus:text-primary data-[state=open]:bg-primary/10 data-[state=open]:text-primary",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER CONTENT
 */
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-white/10 bg-card/90 p-1.5 shadow-2xl backdrop-blur-2xl",
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-4",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

/**
 * 🌊 WATER ITEM
 */
function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  const { impact } = useHaptics();

  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      onSelect={() => impact("light")} // 🏁 TACTILE SELECT
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-2 text-[12px] font-bold outline-none transition-colors",
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
function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return <MenubarPrimitive.Separator className={cn("-mx-1 my-1.5 h-px bg-white/5", className)} {...props} />;
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-[10px] font-black uppercase tracking-widest opacity-40", className)} {...props} />;
}

function MenubarLabel({ className, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }) {
  return <MenubarPrimitive.Label className={cn("px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 data-[inset]:pl-8", className)} {...props} />;
}

/**
 * 🌊 WATER SUB-CONTENT
 */
function MenubarSubContent({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out duration-500",
        className
      )}
      {...props}
    />
  );
}

function MenubarSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-lg px-2 py-1.5 text-[12px] font-bold outline-none focus:bg-primary/10 data-[state=open]:bg-primary/10",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3.5 opacity-40" />
    </MenubarPrimitive.SubTrigger>
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};