"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Terminal, Zap, Activity } from "lucide-react";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ CARD (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 * Fix: Tactical padding and hardened geometry prevent layout blowout.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  const { isMobile, isDesktop } = useDeviceContext();

  return (
    <div
      data-slot="card"
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
        "group relative flex flex-col overflow-hidden border transition-all duration-500",
        isDesktop ? "rounded-3xl p-1 shadow-2xl" : "rounded-2xl p-0.5 shadow-xl",
        
        // 🌫️ LAMINAR DEPTH: Stationary HUD aesthetic
        "border-white/5 bg-zinc-950/40 backdrop-blur-xl",
        
        // 🚀 KINETIC INGRESS: Clinical momentum
        "hover:border-primary/20 hover:bg-zinc-950/60 active:scale-[0.99]",
        
        className
      )}
      {...props}
    >
      {/* 🌫️ TACTICAL RADIANCE: Shrunken subsurface glow */}
      <div className="absolute -left-16 -top-16 size-32 rounded-full bg-primary/5 blur-[60px] opacity-40 group-hover:opacity-100 transition-opacity" />
      
      {/* 📐 STATIONARY HUD WATERMARK */}
      <Terminal className="absolute -bottom-4 -right-4 size-16 opacity-[0.02] -rotate-12 pointer-events-none transition-transform group-hover:scale-110" />
      
      <div className="relative z-10 flex flex-col h-full">
        {props.children}
      </div>
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { isMobile } = useDeviceContext();
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 p-5 md:p-8 pb-0 md:pb-0",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base md:text-lg font-black uppercase italic tracking-tighter leading-none text-foreground/80 transition-colors group-hover:text-primary",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Activity className="size-3 text-primary opacity-0 -translate-x-1 transition-all group-hover:opacity-40 group-hover:translate-x-0 group-hover:animate-pulse" />
        {props.children}
      </div>
    </div>
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-muted-foreground/20 text-[7.5px] md:text-[9px] font-black uppercase tracking-[0.3em] italic leading-tight mt-1",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  const { isMobile } = useDeviceContext();
  return (
    <div
      data-slot="card-content"
      className={cn("p-5 md:p-8 pt-4 md:pt-5", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center p-5 md:p-8 pt-0 md:pt-0 mt-auto",
        "border-t border-white/5",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};