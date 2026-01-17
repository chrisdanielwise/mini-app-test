"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ MENUBAR (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Rail.
 */
function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  const { isMobile } = useDeviceContext();

  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex items-center gap-1 border transition-all duration-300 shadow-2xl",
        "bg-zinc-950/40 backdrop-blur-xl border-white/5",
        isMobile ? "h-9 rounded-lg p-0.5" : "h-10 rounded-xl p-1",
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
 * 🛰️ MENUBAR_TRIGGER
 * Strategy: Technical Hit-zone & Hardware Handshake.
 */
function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  const { selectionChange } = useHaptics();
  const { isReady, isDesktop } = useDeviceContext();

  const handlePointerEnter = () => {
    // 🛡️ TACTICAL BYPASS: Tick only on precision-pointer hardware
    if (isReady && isDesktop) selectionChange();
  };

  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      onPointerEnter={handlePointerEnter}
      className={cn(
        "flex cursor-default select-none items-center rounded-md px-3 h-full",
        "text-[9px] font-black uppercase italic tracking-widest transition-all duration-200",
        "outline-none text-muted-foreground/40 focus:bg-primary/5 focus:text-primary data-[state=open]:bg-primary/10 data-[state=open]:text-primary",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ MENUBAR_CONTENT
 * Strategy: Stationary HUD Membrane.
 */
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 6,
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
          "z-[500] min-w-[10rem] overflow-hidden rounded-xl border border-white/5 bg-zinc-950/90 p-1 shadow-2xl backdrop-blur-3xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out duration-300",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

/**
 * 🛰️ MENUBAR_ITEM
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
  const { isReady } = useDeviceContext();

  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      onSelect={() => isReady && impact("light")}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5 outline-none transition-all",
        "text-[9px] font-black uppercase italic tracking-widest text-muted-foreground/40",
        "focus:bg-primary/5 focus:text-primary data-[disabled]:opacity-10 data-[inset]:pl-8",
        variant === "destructive" && "text-rose-500 focus:bg-rose-500/10",
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
  return <MenubarPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-white/5", className)} {...props} />;
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-[7.5px] font-mono tracking-widest opacity-10 uppercase", className)} {...props} />;
}

function MenubarLabel({ className, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.Label 
      className={cn("px-2.5 py-1.5 text-[7.5px] font-black uppercase tracking-[0.4em] opacity-20 italic data-[inset]:pl-8", className)} 
      {...props} 
    />
  );
}

/**
 * 🛰️ MENUBAR_SUB_CONTENT
 */
function MenubarSubContent({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        "z-[501] min-w-[9rem] overflow-hidden rounded-lg border border-white/5 bg-zinc-950/95 p-1 shadow-2xl backdrop-blur-3xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out duration-300",
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
        "flex cursor-default select-none items-center rounded-md px-2.5 py-1.5 text-[9px] font-black uppercase italic tracking-widest outline-none",
        "focus:bg-primary/5 focus:text-primary data-[state=open]:bg-primary/10",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3 opacity-20" />
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