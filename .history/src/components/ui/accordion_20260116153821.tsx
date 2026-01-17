"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ ACCORDION (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: py-3.5 triggers and shrunken typography prevent layout blowout.
 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

/**
 * 🛰️ ACCORDION_ITEM
 * Strategy: Laminar Membrane Separation.
 */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b border-white/5 transition-all duration-500",
        "data-[state=open]:bg-zinc-950/40 data-[state=open]:backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ ACCORDION_TRIGGER
 * Strategy: Tactical hit-zones (h-11 standard) & Haptic Handshake.
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { impact } = useHaptics();
  const { isReady } = useDeviceContext();

  const handleTrigger = () => {
    if (isReady) impact("light");
  };

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        onClick={handleTrigger}
        className={cn(
          "flex flex-1 items-center justify-between gap-3 py-3.5 text-left outline-none group transition-all",
          "text-[9px] font-black uppercase italic tracking-widest text-muted-foreground/20",
          "data-[state=open]:text-primary data-[state=open]:tracking-[0.2em]",
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Activity className="size-3 shrink-0 opacity-0 group-data-[state=open]:opacity-100 group-data-[state=open]:animate-pulse text-primary transition-all duration-500" />
          <span className="truncate">{children}</span>
        </div>
        <ChevronDownIcon className="size-3.5 shrink-0 opacity-20 transition-all group-hover:opacity-100 group-hover:text-primary" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * 🛰️ ACCORDION_CONTENT
 * Strategy: Momentum-based height reveal with clinical line-height.
 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-[8px] font-black leading-relaxed text-muted-foreground/30 uppercase tracking-[0.2em] italic",
        "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      )}
      {...props}
    >
      <div className={cn("pb-5 pt-0 px-6 animate-in fade-in slide-in-from-top-1 duration-500", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };