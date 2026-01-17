"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 ALERT_DIALOG_MEMBRANE (Institutional Apex v2026.1.15)
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({ 
  className, 
  onClick, 
  ...props 
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  const { impact } = useHaptics();

  const handleTrigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    impact("light");
    if (onClick) onClick(e);
  };

  return (
    <AlertDialogPrimitive.Trigger 
      data-slot="alert-dialog-trigger" 
      onClick={handleTrigger}
      className={className}
      {...props} 
    />
  );
}

const AlertDialogPortal = AlertDialogPrimitive.Portal;

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-700",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🚀 KINETIC CONTENT ENGINE
 * Strategy: Uses safeArea from DeviceContext to ensure no overlap with hardware notches.
 */
function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  const { impact } = useHaptics();
  const { isMobile, safeArea } = useDeviceContext();

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        onOpenAutoFocus={() => impact("medium")}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-[94vw] translate-x-[-50%] translate-y-[-50%] gap-8 border border-white/10 bg-card/80 p-8 shadow-2xl backdrop-blur-3xl sm:max-w-lg transition-all",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]",
          
          // 🧪 MORPHOLOGY RECALIBRATION
          isMobile ? "rounded-[3rem] p-10" : "rounded-[3.5rem] p-12",
          className
        )}
        style={{
          marginTop: isMobile ? `calc(${safeArea.top}px / 2)` : "0px",
          marginBottom: isMobile ? `calc(${safeArea.bottom}px / 2)` : "0px"
        }}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-4 text-center sm:text-left", className)} {...props} />;
}

/**
 * ✅ FIXED: Separated from the export object to resolve parsing colon error.
 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isMobile } = useDeviceContext();
  
  return (
    <div 
      className={cn(
        "flex gap-4 mt-8",
        isMobile ? "flex-col" : "flex-row justify-end",
        className
      )} 
      {...props} 
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] opacity-40 leading-relaxed italic", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  const { notification } = useHaptics();

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    notification("success");
    if (onClick) onClick(e);
  };

  return (
    <AlertDialogPrimitive.Action
      onClick={handleAction}
      className={cn(
        buttonVariants({ variant: "default" }),
        "h-16 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] italic shadow-apex-primary",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  const { impact } = useHaptics();

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    impact("light");
    if (onClick) onClick(e);
  };

  return (
    <AlertDialogPrimitive.Cancel
      onClick={handleCancel}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-16 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] italic border-white/5 bg-white/[0.02] text-muted-foreground/60",
        className
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};