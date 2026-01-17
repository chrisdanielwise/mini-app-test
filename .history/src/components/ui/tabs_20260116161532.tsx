"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ TABS (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Switching.
 */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

/**
 * 🛰️ TABS_LIST
 * Strategy: High-Density Signal Rail.
 */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { isMobile } = useDeviceContext();

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
        "inline-flex w-full items-center justify-center border transition-all duration-300",
        "bg-zinc-950/20 backdrop-blur-3xl border-white/5",
        isMobile ? "h-10 rounded-xl p-1" : "h-11 rounded-2xl p-1.5",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ TABS_TRIGGER
 * Strategy: Technical Selection & Hardware Handshake.
 */
function TabsTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { selectionChange } = useHaptics();
  const { isReady } = useDeviceContext();

  const handleTrigger = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
      if (isReady) selectionChange();
      if (onClick) onClick(e);
    },
    [selectionChange, onClick, isReady]
  );

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      onClick={handleTrigger}
      className={cn(
        // 🏛️ INSTITUTIONAL TYPOGRAPHY: 9px Technical Standard
        "inline-flex flex-1 items-center justify-center gap-2 px-3 py-1.5 transition-all duration-200",
        "text-[9px] font-black uppercase italic tracking-[0.25em] text-muted-foreground/30",
        "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-10",
        
        // 🚀 KINETIC ACTIVE STATE
        "data-[state=active]:bg-zinc-950 data-[state=active]:text-primary data-[state=active]:shadow-2xl data-[state=active]:rounded-lg",
        "data-[state=active]:ring-1 data-[state=active]:ring-white/5",
        
        "[&_svg]:size-3.5",
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
        "mt-2 ring-offset-background transition-all focus-visible:outline-none animate-in fade-in-0 slide-in-from-bottom-1 duration-300", 
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };