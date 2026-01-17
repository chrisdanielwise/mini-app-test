"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID SHEET (Institutional v16.16.12)
 * Logic: Organic momentum with cubic-bezier telemetry.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

/**
 * 🌊 WATER OVERLAY
 */
function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER CONTENT
 * Morphing Strategy: Uses the 700ms "Water Flow" timing.
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

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        onOpenAutoFocus={(e) => {
          impact("light"); // 🏁 TACTILE SYNC: Feel the sheet anchor
          if (onOpenAutoFocus) onOpenAutoFocus(e);
        }}
        className={cn(
          // 🏛️ Style Hardening: v9.9.1 Glassmorphism & Fluidity
          "fixed z-50 flex flex-col gap-4 bg-card/80 backdrop-blur-2xl shadow-2xl",
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          
          // 🌊 DIRECTIONAL FLOWS
          side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l border-white/5 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
          side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r border-white/5 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
          side === "top" && "inset-x-0 top-0 h-auto border-b border-white/5 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" && "inset-x-0 bottom-0 h-auto border-t border-white/5 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom rounded-t-[2.5rem]",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-6 top-6 rounded-xl p-2 bg-foreground/5 opacity-70 transition-all hover:opacity-100 active:scale-90 focus:outline-none">
          <XIcon className="size-5" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

/**
 * 🌊 INSTITUTIONAL TYPOGRAPHY
 */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-2 p-6", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn("text-[14px] font-black uppercase italic tracking-[0.2em] text-primary", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn("text-[12px] font-bold opacity-60 leading-relaxed", className)}
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