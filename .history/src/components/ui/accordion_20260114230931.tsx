"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID ACCORDION (Institutional v16.16.12)
 * Logic: Haptic-synced organic unfolding with momentum physics.
 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

/**
 * 🌊 WATER ITEM
 * Logic: Highlight active vessel with glassmorphism radiance.
 */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b border-white/5 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "data-[state=open]:bg-white/[0.02] data-[state=open]:backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER TRIGGER
 * Logic: Kinetic engagement with haptic confirmation.
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { impact } = useHaptics();

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        onClick={() => impact("light")} // 🏁 TACTILE SYNC: Feel the surface break
        className={cn(
          "flex flex-1 items-center justify-between gap-4 py-6 text-left outline-none group transition-all duration-700",
          "text-[11px] font-black uppercase italic tracking-[0.2em] text-foreground/40",
          "data-[state=open]:text-primary data-[state=open]:tracking-[0.3em]",
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4 min-w-0">
          <Zap className="size-3.5 shrink-0 opacity-0 group-data-[state=open]:opacity-100 group-data-[state=open]:animate-pulse transition-opacity duration-700" />
          <span className="truncate">{children}</span>
        </div>
        <ChevronDownIcon className="size-4 shrink-0 text-foreground/20 transition-transform duration-700 group-hover:text-primary" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * 🌊 WATER CONTENT
 * Logic: Momentum-based height reveal with fade-ingress.
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
        "overflow-hidden text-[10px] font-bold leading-relaxed text-muted-foreground/50 tracking-widest italic",
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      )}
      {...props}
    >
      <div className={cn("pb-8 pt-0 px-7 animate-in fade-in slide-in-from-top-2 duration-700", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };