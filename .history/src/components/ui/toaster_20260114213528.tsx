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
import { useDeviceContext } from "../providers/device-provider";
import { useToast } from "@/lib/hooks/use-toast";

/**
 * 🛰️ TACTICAL TOASTER (Institutional v16.16.12)
 * Logic: Merged Environment-Aware Positioning + v9.9.1 Hardened Aesthetics.
 * Standard: v9.5.0 Branding (Italic/Black/Tracking).
 */
export const Toaster = memo(function Toaster() {
  const { toasts } = useToast();
  const { isMobile } = useDeviceContext();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast 
          key={id} 
          {...props} 
          className="rounded-2xl border border-border/10 bg-card/95 p-4 shadow-2xl backdrop-blur-2xl"
        >
          <div className="grid gap-1">
            {title && (
              <ToastTitle className="text-[11px] font-black uppercase italic tracking-widest text-primary">
                {title}
              </ToastTitle>
            )}
            {description && (
              <ToastDescription className="text-[10px] font-bold leading-relaxed opacity-60">
                {description}
              </ToastDescription>
            )}
          </div>
          {action}
          <ToastClose className="rounded-lg opacity-40 hover:opacity-100 transition-opacity" />
        </Toast>
      ))}
      
      {/* 🚀 TACTICAL VIEWPORT: Adapts to TMA Safe Areas */}
      <ToastViewport className={isMobile ? "bottom-[var(--tg-safe-bottom,20px)] pb-24" : "bottom-6 right-6"} />
    </ToastProvider>
  );
});