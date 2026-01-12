'use client'

import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { SearchIcon, Terminal, Zap } from 'lucide-react'
import { hapticFeedback } from '@/lib/telegram/webapp'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * 🛰️ NEURAL SEARCH (Apex Tier)
 * Normalized: World-standard fluid typography and institutional squircle geometry.
 * Optimized: Adaptive haptics and touch-safe targets for rapid node navigation.
 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'bg-card/40 text-foreground flex h-full w-full flex-col overflow-hidden transition-all duration-500',
        className,
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = 'System Command',
  description = 'Filter telemetry and execute protocols...',
  children,
  className,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          'overflow-hidden p-0 w-[92vw] sm:max-w-xl rounded-2xl md:rounded-[3rem] border border-border/40 bg-card/95 backdrop-blur-3xl shadow-2xl', 
          className
        )}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[cmdk-group-heading]]:text-primary/40 [&_[cmdk-group-heading]]:font-black [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:italic [&_[cmdk-group-heading]]:tracking-[0.3em] [&_[cmdk-group-heading]]:text-[8px] [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-4 [&_[cmdk-item]]:rounded-xl md:[&_[cmdk-item]]:rounded-2xl">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-14 md:h-16 items-center gap-3 border-b border-border/10 px-4"
    >
      <SearchIcon className="size-4 shrink-0 text-primary animate-pulse" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'placeholder:text-muted-foreground/40 flex h-full w-full bg-transparent py-3 text-[10px] md:text-xs font-black uppercase tracking-widest italic outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
      <Terminal className="size-4 shrink-0 text-muted-foreground/20" />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'max-h-[350px] scroll-py-2 overflow-x-hidden overflow-y-auto px-2 pb-4',
        className,
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-12 text-center text-[10px] font-black uppercase tracking-[0.4em] italic opacity-20"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'text-foreground overflow-hidden py-2',
        className,
      )}
      {...props}
    />
  )
}

function CommandItem({
  className,
  onSelect,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      onSelect={(value) => {
        hapticFeedback("light");
        if (onSelect) onSelect(value);
      }}
      className={cn(
        "relative flex cursor-default items-center gap-3 select-none outline-none transition-all duration-300",
        "text-[10px] md:text-xs font-black uppercase italic tracking-tighter",
        "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:scale-[1.02] data-[selected=true]:shadow-xl data-[selected=true]:shadow-primary/20",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-20",
        className,
      )}
      {...props}
    >
      <Zap className="size-3 md:size-3.5 shrink-0 opacity-20 group-data-[selected=true]:opacity-100" />
      {props.children}
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'ml-auto text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] opacity-40',
        className,
      )}
      {...props}
    />
  )
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
}