"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID BREADCRUMB (Institutional v16.16.12)
 * Logic: Haptic-synced path stream with organic momentum.
 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        // 🏛️ Style Hardening: v9.5.0 Terminal Standard
        "flex flex-wrap items-center gap-1.5 md:gap-3",
        "text-[9px] font-black uppercase tracking-[0.3em] italic text-muted-foreground/30",
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5 md:gap-3 min-w-0 animate-in fade-in slide-in-from-left-2 duration-500", className)}
      {...props}
    />
  );
}

/**
 * 🌊 WATER LINK
 * Logic: Kinetic engagement with haptic confirmation.
 */
function BreadcrumbLink({
  asChild,
  className,
  onClick,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const { impact } = useHaptics();
  const Comp = asChild ? Slot : "a";

  const handleInteract = (e: React.MouseEvent<HTMLAnchorElement>) => {
    impact("light"); // 🏁 TACTILE SYNC: Feel the path jump
    if (onClick) onClick(e);
  };

  return (
    <Comp
      data-slot="breadcrumb-link"
      onClick={handleInteract}
      className={cn(
        "hover:text-primary hover:tracking-[0.4em] transition-all duration-500 truncate max-w-[100px] md:max-w-none outline-none",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER PAGE (Current Node)
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "text-foreground font-black tracking-tighter truncate max-w-[120px] md:max-w-none animate-pulse",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "opacity-10 [&>svg]:size-3 transition-opacity hover:opacity-100",
        className
      )}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-8 items-center justify-center rounded-lg bg-white/5 opacity-40 hover:opacity-100 transition-all active:scale-90",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">Expand Path</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};