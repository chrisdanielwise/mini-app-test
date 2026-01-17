"use client";

import { memo } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/lib/hooks/use-toast";

/**
 * 🛰️ TOASTER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & State-Locked Rendering.
 * Fix: Tactical metadata scale prevents layout flash on high-speed hardware.
 */
export const Toaster = memo(function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast 
          key={id} 
          {...props} 
          // 📐 GEOMETRY LOCK: Shrunken radii for clinical precision
          className="rounded-xl border-white/5 bg-zinc-950/90 p-3.5 shadow-2xl backdrop-blur-3xl"
        >
          <div className="grid gap-1">
            {title && (
              <ToastTitle className="text-[10.5px] font-black uppercase italic tracking-[0.2em] text-primary/80">
                {title}
              </ToastTitle>
            )}
            {description && (
              <ToastDescription className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/20 italic leading-tight">
                {description}
              </ToastDescription>
            )}
          </div>
          {action}
          <ToastClose className="rounded-md opacity-20 hover:opacity-100 transition-all active:scale-90" />
        </Toast>
      ))}
      
      {/* 🚀 TACTICAL VIEWPORT: Logic moved to component for cleaner oversight */}
      <ToastViewport />
    </ToastProvider>
  );
});