"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 🌊 FLUID EMPTY CONTAINER
 * Logic: Atmospheric ingress for zero-data states.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-h-[400px] w-full flex-col items-center justify-center gap-8 rounded-[2rem] border border-white/5 bg-card/10 p-8 text-center backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in fade-in zoom-in-95",
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
      className={cn("flex max-w-sm flex-col items-center gap-3", className)}
      {...props}
    />
  );
}

/**
 * 🌊 WATER MEDIA
 * Logic: Localized light-leak behind the icon.
 */
const emptyMediaVariants = cva(
  "relative flex shrink-0 items-center justify-center mb-4 transition-transform duration-700 hover:scale-110",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-16 rounded-2xl bg-primary/5 text-primary border border-primary/10 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] [&_svg]:size-8",
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
      {variant === "icon" && <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5 blur-2xl" />}
      <div className="relative z-10 flex items-center justify-center w-full h-full">{props.children}</div>
    </div>
  );
}

/**
 * 🌊 INSTITUTIONAL TYPOGRAPHY
 */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-[14px] font-black uppercase italic tracking-[0.2em] text-foreground/90", className)}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn("max-w-[280px] text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-relaxed", className)}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex w-full max-w-sm flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-1000", className)}
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