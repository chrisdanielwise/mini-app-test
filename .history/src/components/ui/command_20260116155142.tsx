"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon, Terminal, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * 🛰️ COMMAND (Institutional Apex v2026.1.20)
 * Strategy: Vertical Velocity & Laminar Membrane Separation.
 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden bg-zinc-950/40 backdrop-blur-xl transition-all duration-500",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ COMMAND_DIALOG
 * Strategy: Stationary HUD Membrane.
 */
function CommandDialog({
  title = "System_Command",
  description = "Execute_Tactical_Protocol",
  children,
  className,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  const { isMobile } = useDeviceContext();

  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "fixed left-[50%] top-[50%] z-[500] w-[94vw] translate-x-[-50%] translate-y-[-50%] overflow-hidden border border-white/5 bg-zinc-950/80 p-0 shadow-2xl backdrop-blur-3xl sm:max-w-xl transition-all",
          isMobile ? "rounded-2xl" : "rounded-3xl",
          className
        )}
      >
        <Command className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2.5 [&_[cmdk-group-heading]]:text-[7.5px] [&_[cmdk-group-heading]]:font-black [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:italic [&_[cmdk-group-heading]]:tracking-[0.4em] [&_[cmdk-group-heading]]:text-primary/30 [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 🛰️ COMMAND_INPUT
 * Strategy: Tactical h-11/12 standard.
 */
function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  const { isMobile } = useDeviceContext();

  return (
    <div
      data-slot="command-input-wrapper"
      className={cn(
        "flex items-center gap-3 border-b border-white/5 px-4 transition-all",
        isMobile ? "h-11" : "h-13"
      )}
    >
      <SearchIcon className="size-3.5 shrink-0 text-primary/40" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-full w-full bg-transparent text-[9px] md:text-[10px] font-black uppercase italic tracking-widest outline-none placeholder:text-muted-foreground/10 disabled:opacity-30",
          className
        )}
        {...props}
      />
      <Terminal className="size-3.5 shrink-0 opacity-10" />
    </div>
  );
}

/**
 * 🛰️ COMMAND_LIST
 */
function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[320px] overflow-y-auto overflow-x-hidden p-1.5 pb-4 scrollbar-hide",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ COMMAND_ITEM
 * Strategy: High-Density Node Selection & Hardware Handshake.
 */
function CommandItem({
  className,
  onSelect,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  const { impact, selectionChange } = useHaptics();
  const { isReady } = useDeviceContext();

  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      onSelect={(value) => {
        if (isReady) impact("medium");
        if (onSelect) onSelect(value);
      }}
      // @ts-ignore - CMDK custom data attributes
      onPointerEnter={() => isReady && selectionChange()}
      className={cn(
        "relative flex cursor-default select-none items-center gap-3 rounded-lg outline-none transition-all duration-300",
        "text-[9px] font-black uppercase italic tracking-tight text-muted-foreground/40",
        "data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary data-[selected=true]:scale-[0.99] shadow-inner",
        "data-[disabled=true]:opacity-10",
        className
      )}
      {...props}
    >
      <Activity className="size-3 shrink-0 opacity-20 group-data-[selected=true]:opacity-100 group-data-[selected=true]:animate-pulse" />
      <span className="flex-1 truncate">{props.children}</span>
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-[7.5px] font-black uppercase tracking-[0.2em] opacity-10 font-mono",
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-12 text-center text-[8px] font-black uppercase italic tracking-[0.4em] opacity-10"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn("overflow-hidden py-1 text-foreground", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
};