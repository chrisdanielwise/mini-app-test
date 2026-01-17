"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// 🛡️ TYPE DEFINITIONS: Resolves ts(2304)
export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>;
export type ToastActionElement = React.ReactElement<typeof ToastPrimitives.Action>;

const ToastProvider = ToastPrimitives.Provider;

/**
 * 🛰️ TOAST VIEWPORT (Institutional v16.16.13)
 * Positioned to clear the TMA Navigation Hub.
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]",
      "pb-[calc(var(--tg-safe-bottom,0px)+5.5rem)] sm:pb-4", // Added safety clearance
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border p-5 shadow-2xl transition-all",
  {
    variants: {
      variant: {
        default: "border-border/10 bg-card/95 text-foreground backdrop-blur-2xl",
        destructive: "border-rose-500/30 bg-rose-500/10 text-rose-500 backdrop-blur-2xl",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 backdrop-blur-2xl",
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
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full",
      className
    )}
    {...props}
  />
));
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-transparent px-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-muted/10 active:scale-95",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

// 🛡️ FIX: EXPLICIT TOAST CLOSE (Resolves ts(2552) Close collision)
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1 text-muted-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-[11px] font-black uppercase italic tracking-[0.15em]", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-[10px] font-bold opacity-60 leading-relaxed", className)}
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