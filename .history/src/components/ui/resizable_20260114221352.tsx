"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID PANEL GROUP
 * Logic: Coordinated transition for nested water-flow nodes.
 */
function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 FLUID PANEL
 */
function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

/**
 * 🌊 WATER HANDLE
 * Logic: Haptic-synced drag with ambient light ingress.
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  const { selectionChange, impact } = useHaptics();

  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      // 🏁 TACTILE SYNC: Hardware feedback when the user grabs or moves the boundary
      onDragging={(isDragging) => isDragging && selectionChange()}
      className={cn(
        "relative flex w-px items-center justify-center bg-white/5 transition-all duration-300",
        "hover:bg-primary/20 active:bg-primary/40",
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div 
          className={cn(
            "z-10 flex h-6 w-4 items-center justify-center rounded-full border border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl transition-transform active:scale-90",
            "group-data-[panel-group-direction=vertical]:rotate-90"
          )}
        >
          <GripVerticalIcon className="size-3 text-primary opacity-60" />
        </div>
      )}
      
      {/* 🌊 AMBIENT LIGHT LEAK: The "Water Surface" effect */}
      <div className="absolute inset-y-0 -left-1 w-2 opacity-0 hover:opacity-100 bg-gradient-to-r from-primary/5 to-transparent transition-opacity pointer-events-none" />
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };