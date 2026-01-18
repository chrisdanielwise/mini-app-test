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
        "fixed inset-0 z-[400] bg-zinc-950/60 backdrop-blur-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ SHEET_CONTENT
 * Strategy: Stationary HUD Membrane & Hardware Handshake.
 * Fix: Removed 0.2x safe-area multiplier to prevent notch collision.
 * Fix: Integrated internal scroll-containment for high-density menu navigation.
 */
function SheetContent({
  className,
  children,
  side = "right",
  onOpenAutoFocus,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  const { impact } = useHaptics();
  const { isReady, safeArea } = useDeviceContext();

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        onOpenAutoFocus={(e) => {
          if (isReady) impact("light");
          if (onOpenAutoFocus) onOpenAutoFocus(e);
        }}
        className={cn(
          "fixed z-[500] flex flex-col bg-zinc-950/80 backdrop-blur-3xl shadow-2xl transition-all duration-400",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          
          // 📐 DIRECTIONAL FLOW RECALIBRATION
          side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l border-white/5 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
          side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r border-white/5 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
          side === "top" && "inset-x-0 top-0 h-auto border-b border-white/5 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" && "inset-x-0 bottom-0 h-auto border-t border-white/5 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom rounded-t-2xl",
          className
        )}
        style={{
          // 🛡️ TACTICAL FIX: 1:1 Hardware Safe-Area integration for notch clearance
         paddingTop: `${safeArea.top}px`, 
          paddingBottom: `${safeArea.bottom}px`,
        } as React.CSSProperties}
        {...props}
      >
        {/* 🌊 LAMINAR RESERVOIR: Allows internal scrolling for long navigation stacks */}
        <div className="flex-1 overflow-y-auto scrollbar-none overscroll-contain">
          {children}
        </div>

        {/* ✖️ TACTICAL CLOSE: Positioned dynamically to clear hardware features */}
        <SheetPrimitive.Close 
         className="absolute right-4 rounded-lg p-2 bg-white/5 opacity-40 hover:opacity-100 transition-all"
          style={{ top: `calc(${safeArea.top}px + 8px)` }}
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

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