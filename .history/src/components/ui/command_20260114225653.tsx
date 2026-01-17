"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon, Terminal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * 🌊 FLUID COMMAND (Institutional v16.16.12)
 * Logic: Neural Search with Momentum Ingress.
 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden bg-card/40 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 COMMAND DIALOG
 * Logic: High-density glass with Institutional v9.9.1 morphology.
 */
function CommandDialog({
  title = "System Command",
  description = "Filter telemetry and execute protocols...",
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
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-[92vw] translate-x-[-50%] translate-y-[-50%] overflow-hidden border border-white/10 bg-card/95 p-0 shadow-2xl backdrop-blur-3xl sm:max-w-xl md:rounded-[2.5rem]",
          className
        )}
      >
        <Command className="[&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:py-3 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-black [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:italic [&_[cmdk-group-heading]]:tracking-[0.3em] [&_[cmdk-group-heading]]:text-primary/40 [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-5 [&_[cmdk-item]]:py-4">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 🌊 WATER INPUT
 */
function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-16 items-center gap-4 border-b border-white/5 px-5"
    >
      <SearchIcon className="size-4 shrink-0 text-primary animate-pulse" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-full w-full bg-transparent text-[11px] font-black uppercase italic tracking-[0.2em] outline-none placeholder:text-muted-foreground/30 disabled:opacity-30",
          className
        )}
        {...props}
      />
      <Terminal className="size-4 shrink-0 opacity-20" />
    </div>
  );
}

/**
 * 🌊 NEURAL LIST
 */
function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[380px] overflow-y-auto overflow-x-hidden p-2 pb-6 scrollbar-hide",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 FLUID ITEM
 * Logic: Haptic-synced selection with "Well" scaling.
 */
function CommandItem({
  className,
  onSelect,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  const { impact, selectionChange } = useHaptics();

  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      onSelect={(value) => {
        impact("medium"); // 🏁 TACTILE SYNC: Action execution
        if (onSelect) onSelect(value);
      }}
      // @ts-ignore - CMDK custom data attributes
      onPointerEnter={() => selectionChange()} // 🏁 TACTILE HOVER: Tick as we scroll
      className={cn(
        "relative flex cursor-default select-none items-center gap-4 rounded-2xl outline-none transition-all duration-500",
        "text-[10px] font-black uppercase italic tracking-tighter",
        "data-[selected=true]:scale-[1.02] data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:shadow-2xl data-[selected=true]:shadow-primary/30",
        "data-[disabled=true]:opacity-20",
        className
      )}
      {...props}
    >
      <Zap className="size-3.5 shrink-0 opacity-20 group-data-[selected=true]:opacity-100" />
      <span className="flex-1">{props.children}</span>
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
        "ml-auto text-[9px] font-black uppercase tracking-[0.3em] opacity-30",
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
      className="py-16 text-center text-[10px] font-black uppercase italic tracking-[0.4em] opacity-20"
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
      className={cn("overflow-hidden py-2 text-foreground", className)}
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