"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { User, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ AVATAR (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 * Fix: Tactical size scaling and shrunken typography prevent layout blowout.
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  const { impact } = useHaptics();
  const { isMobile, isDesktop, isReady } = useDeviceContext();

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      onClick={() => isReady && impact("light")}
      className={cn(
        // 📐 MORPHOLOGY SCALE: High-density sizing
        "relative flex shrink-0 overflow-hidden select-none border backdrop-blur-xl shadow-2xl transition-all duration-500",
        isDesktop ? "size-11 rounded-xl" : "size-9 rounded-lg",
        
        // 🌫️ LAMINAR DEPTH: Stationary HUD aesthetic
        "border-white/5 bg-zinc-950/40",
        
        // 🚀 KINETIC INGRESS: Clinical momentum
        "hover:border-primary/20 hover:bg-zinc-950/60 active:scale-95",
        
        className
      )}
      {...props}
    >
      {/* Subsurface Signal (Stationary Layer) */}
      <Activity className="absolute inset-0 size-full opacity-[0.03] p-2 pointer-events-none" />
      {props.children}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover animate-in fade-in duration-700", className)}
      {...props}
    />
  );
}

/**
 * 🛰️ AVATAR_FALLBACK
 * Strategy: Technical Metadata Hub.
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-primary/5",
        // 🏛️ Institutional Typography Scale
        "text-[7.5px] md:text-[9px] font-black uppercase italic tracking-[0.3em] text-primary/40",
        "animate-in zoom-in-95 duration-500",
        className
      )}
      {...props}
    >
      {props.children || <User className="size-3.5 md:size-4 opacity-20" />}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarImage, AvatarFallback };