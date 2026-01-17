"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>;
export type ToastActionElement = React.ReactElement<typeof ToastPrimitives.Action>;

const ToastProvider = ToastPrimitives.Provider;

/**
 * 🛰️ TOAST_VIEWPORT
 * Strategy: Hardware-Safe Buffering.
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => {
  const { safeArea, isMobile } = useDeviceContext();
  
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed bottom-0 right-0 z-[1000] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[380px]",
        className
      )}
      style={{
        // 🛡️ TACTICAL CLEARANCE: Clamping hardware home indicators + HUD
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 6rem)` : "1.5rem",
        paddingRight: isMobile ? "1rem" : "1.5rem"
      } as React.CSSProperties}
      {...props}
    />
  );
});
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

/**
 * 🛰️ TOAST_ROOT
 * Strategy: Obsidian-OLED Depth & Kinetic Ingress.
 */
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-3 overflow-hidden rounded-xl border p-4 shadow-2xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-white/5 bg-zinc-950/90 text-foreground backdrop-blur-3xl",
        destructive: "border-rose-500/20 bg-rose-500/5 text-rose-500 backdrop-blur-3xl",
        success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 backdrop-blur-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(
      toastVariants({ variant }), 
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-100",
      "data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full sm:data-[state=open]:slide-in-from-right-full",
      className
    )}
    {...props}
  />
));
Toast.displayName = ToastPrimitives.Root.displayName;

/**
 * 🛰️ TOAST_ACTION
 * Strategy: Technical Selection Trigger.
 */
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3",
      "text-[8px] font-black uppercase tracking-[0.25em] transition-all hover:bg-white/10 active:scale-95",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-muted-foreground/20 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-[10.5px] font-black uppercase italic tracking-[0.2em] text-primary/80 flex items-center gap-2",
      className
    )}
    {...props}
  >
    <Activity className="size-3 opacity-30" />
    {props.children}
  </ToastPrimitives.Title>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/20 italic leading-tight mt-1",
      className
    )}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};