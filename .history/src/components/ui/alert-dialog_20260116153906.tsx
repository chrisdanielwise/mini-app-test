"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ ALERT_DIALOG (Institutional Apex v2026.1.20)
 * Strategy: Tactical Slim Geometry & Stationary Membrane.
 * Fix: h-11 buttons and shrunken typography prevent layout blowout.
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
        "fixed inset-0 z-[300] bg-zinc-950/60 backdrop-blur-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-500",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  const { impact } = useHaptics();
  const { isMobile, safeArea, isReady } = useDeviceContext();

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        onOpenAutoFocus={() => isReady && impact("medium")}
        className={cn(
          "fixed left-[50%] top-[50%] z-[400] grid w-[92vw] translate-x-[-50%] translate-y-[-50%] border border-white/5 bg-zinc-950/80 backdrop-blur-2xl transition-all",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
          
          // 📐 TACTICAL RADIUS & PADDING
          isMobile ? "rounded-2xl p-6 gap-6" : "rounded-3xl p-8 gap-8 sm:max-w-md",
          className
        )}
        style={{
          paddingTop: isMobile ? `calc(1.5rem + ${safeArea.top}px * 0.2)` : "2rem",
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
  return <div className={cn("flex flex-col gap-2.5 text-center sm:text-left leading-none", className)} {...props} />;
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isMobile } = useDeviceContext();
  
  return (
    <div 
      className={cn(
        "flex gap-3",
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
      className={cn("text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground leading-none", className)}
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
      className={cn("text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 leading-relaxed italic", className)}
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
        "h-11 rounded-xl text-[9px] font-black uppercase italic tracking-widest shadow-lg active:scale-95 transition-all",
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
        "h-11 rounded-xl text-[9px] font-black uppercase italic tracking-widest border-white/5 bg-white/[0.01] text-muted-foreground/40",
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