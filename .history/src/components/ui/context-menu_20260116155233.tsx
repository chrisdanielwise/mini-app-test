"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

/**
 * 🛰️ CONTEXT_MENU_CONTENT
 * Strategy: Stationary HUD Membrane & Hardware-Fluid Handshake.
 */
function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  const { impact } = useHaptics();
  const { isReady } = useDeviceContext();

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        onUpdate={() => isReady && impact("light")}
        className={cn(
          "z-[500] min-w-[10rem] overflow-hidden rounded-xl border border-white/5 bg-zinc-950/90 p-1 shadow-2xl backdrop-blur-3xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out duration-300",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

/**
 * 🛰️ CONTEXT_MENU_ITEM
 * Strategy: High-Density Technical Row.
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
  const { isReady } = useDeviceContext();

  const handleSelect = (e: Event) => {
    if (isReady) selectionChange();
    if (onSelect) onSelect(e);
  };

  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      onSelect={handleSelect}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2.5 rounded-md px-2.5 py-1.5 outline-none transition-colors",
        "text-[9px] font-black uppercase italic tracking-widest",
        "focus:bg-primary/10 focus:text-primary data-[disabled]:opacity-10 data-[inset]:pl-8",
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
function ContextMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.Label 
      className={cn("px-2.5 py-1.5 text-[7.5px] font-black uppercase tracking-[0.4em] opacity-20 italic data-[inset]:pl-8", className)} 
      {...props} 
    />
  );
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return <ContextMenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-white/5", className)} {...props} />;
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-[7.5px] font-mono tracking-widest opacity-10 uppercase", className)} {...props} />;
}

/**
 * 🛰️ SUB-TRIGGER / CONTENT
 */
function ContextMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-md px-2.5 py-1.5 text-[9px] font-black uppercase italic tracking-widest outline-none",
        "focus:bg-primary/10 data-[state=open]:bg-primary/10 focus:text-primary",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3 opacity-20" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(
        "z-[501] min-w-[9rem] overflow-hidden rounded-lg border border-white/5 bg-zinc-950/95 p-1 shadow-2xl backdrop-blur-3xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out duration-300",
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