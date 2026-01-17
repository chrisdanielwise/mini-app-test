"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ DIALOG (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Ingress.
 * Fix: Tactical p-6 padding and h-10 close nodes prevent layout blowout.
 */
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

/**
 * 🛰️ DIALOG_OVERLAY
 * Strategy: Obsidian-OLED Depth (Laminar Backdrop).
 */
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
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
 * 🛰️ DIALOG_CONTENT
 * Strategy: Stationary HUD Membrane & Hardware Handshake.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  const { impact } = useHaptics();
  const { isMobile, safeArea, isReady } = useDeviceContext();

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        onOpenAutoFocus={() => isReady && impact("medium")}
        className={cn(
          "fixed top-[50%] left-[50%] z-[500] grid w-full translate-x-[-50%] translate-y-[-50%] border border-white/5 bg-zinc-950/80 shadow-2xl backdrop-blur-3xl transition-all duration-500",
          
          // 📐 MORPHOLOGY RECALIBRATION
          isMobile ? "max-w-[calc(100%-1.5rem)] rounded-2xl p-6 gap-6" : "sm:max-w-lg rounded-3xl p-8 gap-8",
          
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
          className
        )}
        style={{
            // 🛡️ TACTICAL CLEARANCE: Clearing hardware notches
            marginTop: isMobile ? `calc(${safeArea.top}px * 0.2)` : "0px"
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-2 bg-white/5 opacity-20 transition-all hover:opacity-100 active:scale-95 focus:outline-none">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * 🛰️ DIALOG_HEADER
 * Strategy: Technical Metadata Surface.
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 text-center sm:text-left leading-none", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-2", className)}
      {...props}
    >
      <Activity className="size-3.5 text-primary opacity-40 animate-pulse" />
      {props.children}
    </DialogPrimitive.Title>
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] italic leading-tight", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};