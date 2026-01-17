"use client";

import * as React from "react";
import { GripVerticalIcon, Activity } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ RESIZABLE_PANEL_GROUP
 * Strategy: Structural HUD Integrity.
 */
function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col transition-all duration-500",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ RESIZABLE_PANEL
 */
function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

/**
 * 🛰️ RESIZABLE_HANDLE
 * Strategy: Technical Boundary & Hardware Handshake.
 * Fix: Tactical size-3 iconography and hardened radii prevent layout blowout.
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  const { selectionChange } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
      onDragging={(isDragging) => isDragging && isReady && selectionChange()}
      className={cn(
        "relative flex w-0.5 items-center justify-center bg-white/5 transition-all duration-300",
        "hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20",
        "data-[panel-group-direction=vertical]:h-0.5 data-[panel-group-direction=vertical]:w-full",
        // 📐 MORPHOLOGY: Hide handles on XS hardware to prevent touch jitter
        isMobile && "pointer-events-none opacity-0",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div 
          className={cn(
            "z-50 flex h-7 w-3 items-center justify-center rounded-sm border border-white/5 bg-zinc-950/80 backdrop-blur-3xl shadow-2xl transition-all",
            "active:scale-95 active:bg-primary/10",
            "group-data-[panel-group-direction=vertical]:rotate-90"
          )}
        >
          <GripVerticalIcon className="size-2.5 text-primary/40 group-hover:text-primary transition-colors" />
        </div>
      )}
      
      {/* 🌫️ LAMINAR SIGNAL: Technical light leak on focus */}
      <div className="absolute inset-y-0 -left-1 w-2 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/5 to-transparent transition-opacity pointer-events-none" />
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };