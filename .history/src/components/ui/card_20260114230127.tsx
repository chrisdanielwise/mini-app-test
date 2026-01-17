"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Terminal, Zap } from "lucide-react";

/**
 * 🌊 FLUID CARD (Institutional v16.16.12)
 * Logic: Atmospheric data node with organic momentum.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism
        "group relative flex flex-col gap-6 overflow-hidden border border-white/5 bg-card/30 shadow-2xl backdrop-blur-3xl",
        "rounded-[2rem] md:rounded-[2.5rem]", // Organic morphology
        
        // 🚀 THE WATER ENGINE: Cubic-Bezier Momentum
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:scale-[1.01] hover:bg-card/40 hover:border-primary/20 hover:shadow-primary/5",
        
        className
      )}
      {...props}
    >
      {/* 🌊 AMBIENT RADIANCE: Subsurface light leak */}
      <div className="absolute -left-24 -top-24 size-48 rounded-full bg-primary/5 blur-[100px] transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />
      
      {/* Blueprint Subliminal Branding */}
      <Terminal className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.02] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
      
      <div className="relative z-10 flex flex-col h-full">
        {props.children}
      </div>
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 md:gap-2 p-6 md:p-10 pb-0 md:pb-0",
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
        "text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none text-foreground/90 transition-colors group-hover:text-primary",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <Zap className="size-3.5 text-primary opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:animate-pulse" />
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
        "text-muted-foreground/40 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] italic leading-relaxed",
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
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end mt-1",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 md:p-10 pt-4 md:pt-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center p-6 md:p-10 pt-0 md:pt-0 mt-auto",
        "border-t border-white/5 [.border-t]:mt-2",
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