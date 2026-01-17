"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * 🛰️ DROPDOWN_MENU_CONTENT
 * Strategy: Stationary HUD Membrane & Vertical Velocity.
 */
function DropdownMenuContent({
  className,
  sideOffset = 6, 
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-[500] min-w-[10rem] overflow-hidden rounded-xl border border-white/5 bg-zinc-950/90 p-1 shadow-2xl backdrop-blur-3xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out duration-300",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * 🛰️ DROPDOWN_MENU_ITEM
 * Strategy: High-Density Technical Row & Hardware Handshake.
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
  const { isReady } = useDeviceContext();

  const handleSelect = (e: Event) => {
    if (isReady) impact("light");
    if (onSelect) onSelect(e);
  };

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      onSelect={handleSelect}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2.5 rounded-md px-2.5 py-1.5 outline-none transition-all",
        "text-[9px] font-black uppercase italic tracking-widest text-muted-foreground/40",
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
function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Label 
      className={cn("px-2.5 py-1.5 text-[7.5px] font-black uppercase tracking-[0.4em] opacity-20 italic data-[inset]:pl-8", className)} 
      {...props} 
    />
  );
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-white/5", className)} {...props} />;
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-[7.5px] font-mono tracking-widest opacity-10 uppercase", className)} {...props} />;
}

/**
 * 🛰️ SUB-TRIGGER / CONTENT
 */
function DropdownMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-md px-2.5 py-1.5 text-[9px] font-black uppercase italic tracking-widest outline-none",
        "focus:bg-primary/10 data-[state=open]:bg-primary/10 focus:text-primary",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3 opacity-20" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
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