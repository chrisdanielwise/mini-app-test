"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID ALERT DIALOG (Institutional v16.16.12)
 * Logic: Haptic-synced modal anchoring with organic inflation.
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
    impact("light"); // 🏁 TACTILE SYNC: Feel the surface break
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

/**
 * 🌊 WATER OVERLAY
 */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-md",
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
 * Logic: v9.9.1 Hardened Glassmorphism with Cubic-Bezier momentum.
 */
function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  const { impact } = useHaptics();

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        onOpenAutoFocus={() => impact("medium")} // 🏁 TACTILE SYNC: Feel the focus lock
        className={cn(
          // 🏛️ Style Hardening: v9.9.1 Glassmorphism
          "fixed left-[50%] top-[50%] z-50 grid w-[94vw] translate-x-[-50%] translate-y-[-50%] gap-8 border border-white/10 bg-card/80 p-8 shadow-2xl backdrop-blur-3xl sm:max-w-lg",
          "rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden",
          
          // 🚀 THE WATER ENGINE: 700ms Momentum
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

/**
 * 🏛️ INSTITUTIONAL BRANDING
 */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-3 text-center sm:text-left", className)} {...props} />;
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none text-primary", className)}
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
      className={cn("text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] leading-relaxed text-muted-foreground/60 italic", className)}
      {...props}
    />
  );
}

/**
 * 🌊 KINETIC ACTIONS
 */
function AlertDialogAction({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  const { notification } = useHaptics();

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    notification("success"); // 🏁 TACTILE SYNC: Confirm Protocol Execution
    if (onClick) onClick(e);
  };

  return (
    <AlertDialogPrimitive.Action
      onClick={handleAction}
      className={cn(
        buttonVariants({ variant: "default" }),
        "h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest italic",
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
        "h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest italic border-white/10",
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
  AlertDialogFooter: (props: any) => <div className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4 mt-6", props.className)} {...props} />,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};