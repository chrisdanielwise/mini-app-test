"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID DRAWER (Institutional v16.16.12)
 * Logic: Haptic-synced "Rising Tide" animation with momentum drag.
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
 * 🌊 WATER OVERLAY
 */
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER CONTENT
 * Logic: v9.9.1 Hardened Glassmorphism with organic corner radii.
 */
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  const { impact } = useHaptics();

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        onOpenAutoFocus={() => impact("medium")} // 🏁 TACTILE SYNC: Feel the snap
        className={cn(
          "group/drawer-content fixed z-50 flex flex-col bg-card/80 backdrop-blur-2xl border-white/10 shadow-2xl",
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          
          // 🌊 DIRECTIONAL FLOWS (Institutional Standard)
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:rounded-t-[2.5rem] data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:rounded-b-[2.5rem] data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-[85%] data-[vaul-drawer-direction=right]:border-l",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-[85%] data-[vaul-drawer-direction=left]:border-r",
          
          className
        )}
        {...props}
      >
        {/* 🌊 LIQUID HANDLE */}
        <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-foreground/10 group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

/**
 * 🏛️ INSTITUTIONAL BRANDING
 */
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn("flex flex-col gap-2 p-6 text-center", className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn("text-[14px] font-black uppercase italic tracking-[0.25em] text-primary", className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn("mt-auto flex flex-col gap-3 p-6", className)} {...props} />;
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