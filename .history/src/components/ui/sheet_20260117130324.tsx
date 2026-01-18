"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SHEET (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Ingress.
 */
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

/**
 * 🛰️ SHEET_OVERLAY
 * Strategy: Obsidian-OLED Depth (Laminar Backdrop).
 */
function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // 🛡️ Increased Z-Index to 600 to sit ABOVE the NavGuard/Header
        "fixed inset-0 z-[600] bg-black/80 backdrop-blur-sm transition-all duration-400",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ SHEET_CONTENT
 * Strat}egy: Stationary HUD Membrane & Hardware Handshake.
 * 🏗️ Fix: Synchronized with RootLayout Global Buffer.
 * 📐 Displacement: var(--tg-safe-top) + 18px buffer.
 */


/**
 * 🛰️ SHEET_HEADER
 */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-5 leading-none", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn("text-base font-black uppercase italic tracking-tighter text-primary flex items-center gap-2", className)}
      {...props}
    >
      <Activity className="size-3.5 opacity-40 animate-pulse" />
      {props.children}
    </SheetPrimitive.Title>
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn("text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic leading-tight", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
};