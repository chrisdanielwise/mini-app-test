"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics"; // 🚀 Merged Hook

/**
 * 🛰️ TACTICAL TABS (Institutional v16.16.12)
 * Logic: Haptic-Synced View Swapping + v9.9.1 Hardened Aesthetics.
 */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism
        "inline-flex h-12 w-full items-center justify-center rounded-2xl border border-border/10 bg-card/40 p-1.5 backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { selectionChange } = useHaptics();

  const handleTrigger = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // 🏁 TACTILE SYNC: Confirm view change to the merchant
      selectionChange();
      if (onClick) onClick(e);
    },
    [selectionChange, onClick]
  );

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      onClick={handleTrigger}
      className={cn(
        // 🏛️ Institutional Branding: Black, Uppercase, High Tracking
        "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5",
        "text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 transition-all",
        "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        // 🚀 Active State Strategy
        "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-2xl data-[state=active]:ring-1 data-[state=active]:ring-border/10",
        "[&_svg]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-4 ring-offset-background transition-all focus-visible:outline-none animate-in fade-in-50 duration-500", 
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };