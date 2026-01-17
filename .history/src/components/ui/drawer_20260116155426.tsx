"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ DRAWER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Hardware-Fluid Handshake.
 */
function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
}

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

/**
 * 🛰️ DRAWER_OVERLAY
 * Strategy: Obsidian-OLED Depth (Laminar Backdrop).
 */
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-[400] bg-zinc-950/60 backdrop-blur-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-500",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ DRAWER_CONTENT
 * Strategy: Stationary HUD Membrane & Safe-Area Clamping.
 */
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  const { impact } = useHaptics();
  const { safeArea, isReady } = useDeviceContext();

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        onOpenAutoFocus={() => isReady && impact("medium")}
        className={cn(
          "group/drawer-content fixed z-[500] flex flex-col bg-zinc-950/80 backdrop-blur-3xl border-white/5 shadow-2xl transition-all duration-500",
          
          // 📐 DIRECTIONAL FLOW RECALIBRATION
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:rounded-t-2xl data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:rounded-b-2xl data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-[85%] md:w-[400px] data-[vaul-drawer-direction=right]:border-l",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-[85%] md:w-[400px] data-[vaul-drawer-direction=left]:border-r",
          
          className
        )}
        style={{
          // 🛡️ TACTICAL CLEARANCE: Clamping hardware home indicators
          paddingBottom: `calc(1rem + ${safeArea.bottom}px)`,
          paddingTop: `calc(1rem + ${safeArea.top}px * 0.2)`
        } as React.CSSProperties}
        {...props}
      >
        {/* 📐 TACTICAL HANDLE: Technical Slim Standard */}
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-white/10 group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

/**
 * 🛰️ DRAWER_HEADER
 * Strategy: Technical Metadata Surface.
 */
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn("flex flex-col gap-1.5 p-5 text-center leading-none", className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn("text-base font-black uppercase italic tracking-tighter text-foreground", className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] italic", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn("mt-auto flex flex-col gap-3 p-5", className)} {...props} />;
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};