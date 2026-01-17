"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ EMPTY (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Ingress.
 * Fix: Tactical min-height and clinical radii prevent layout blowout.
 */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  const { isMobile } = useDeviceContext();

  return (
    <div
      data-slot="empty"
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 25%
        "flex w-full flex-col items-center justify-center gap-6 border transition-all duration-500",
        "bg-zinc-950/20 backdrop-blur-xl border-white/5 animate-in fade-in zoom-in-98",
        isMobile ? "min-h-[280px] rounded-xl p-6" : "min-h-[340px] rounded-2xl p-10",
        className
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  );
}

/**
 * 🛰️ EMPTY_MEDIA
 * Strategy: Stationary HUD Radiance.
 */
const emptyMediaVariants = cva(
  "relative flex shrink-0 items-center justify-center mb-2 transition-transform duration-500",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-12 rounded-xl bg-primary/5 text-primary/40 border border-primary/10 shadow-lg [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div data-slot="empty-media" className={cn(emptyMediaVariants({ variant, className }))} {...props}>
      {variant === "icon" && <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5 blur-xl" />}
      <div className="relative z-10 flex items-center justify-center w-full h-full">{props.children}</div>
    </div>
  );
}

/**
 * 🛰️ EMPTY_TITLE
 * Strategy: Technical Metadata Scale.
 */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-[11px] font-black uppercase italic tracking-[0.3em] text-foreground/60", className)}
      {...props}
    />
  );
}

/**
 * 🛰️ EMPTY_DESCRIPTION
 * Strategy: Clinical Density Standard.
 */
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn("max-w-[240px] text-[8.5px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic leading-tight text-center", className)}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex w-full max-w-xs flex-col items-center gap-4 animate-in slide-in-from-bottom-2 duration-500", className)}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};