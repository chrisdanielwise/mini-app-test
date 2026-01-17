"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🌊 FLUID IDENTITY NODE (Institutional v16.16.12)
 * Logic: Atmospheric glass vessel for user credentials.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Base
        "relative flex size-10 md:size-12 shrink-0 overflow-hidden select-none border border-white/10 bg-card/40 backdrop-blur-3xl shadow-2xl",
        "rounded-2xl md:rounded-[1.5rem]", // 🌊 Master Squircle morphology
        
        // 🚀 THE WATER ENGINE: Cubic-Bezier Momentum
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:scale-110 hover:border-primary/40 hover:shadow-primary/10 active:scale-95",
        
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover animate-in fade-in duration-1000", className)}
      {...props}
    />
  );
}

/**
 * 🌊 WATER FALLBACK
 * Logic: System-node representation for Telegram/Ghost identities.
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
        "text-[10px] md:text-xs font-black uppercase italic tracking-[0.2em] text-primary/80",
        "animate-in zoom-in-50 duration-500",
        className
      )}
      {...props}
    >
      {/* 🛡️ Institutional Fallback */}
      {props.children || <User className="size-4 md:size-5 opacity-30 animate-pulse" />}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarImage, AvatarFallback };