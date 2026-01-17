"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ BREADCRUMB (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 * Fix: Shrunken tracking and clinical typography prevent layout blowout.
 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" className="leading-none" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        // 📐 INSTITUTIONAL SCALE: High-density pathing
        "flex flex-wrap items-center gap-2 md:gap-4",
        "text-[7.5px] md:text-[8.5px] font-black uppercase tracking-[0.2em] italic text-muted-foreground/20",
        "transition-all duration-500",
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
      className={cn("inline-flex items-center gap-2 md:gap-4 min-w-0 animate-in fade-in slide-in-from-left-1 duration-500", className)}
      {...props}
    />
  );
}

/**
 * 🛰️ BREADCRUMB_LINK
 * Strategy: Kinetic Engagement & Hardware Handshake.
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
  const { isReady } = useDeviceContext();
  const Comp = asChild ? Slot : "a";

  const handleInteract = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isReady) impact("light");
    if (onClick) onClick(e);
  };

  return (
    <Comp
      data-slot="breadcrumb-link"
      onClick={handleInteract}
      className={cn(
        "hover:text-primary transition-colors truncate max-w-[80px] md:max-w-none outline-none cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ BREADCRUMB_PAGE (Current Node)
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "text-foreground font-black tracking-tighter truncate max-w-[100px] md:max-w-none flex items-center gap-1.5",
        className
      )}
      {...props}
    >
      <Activity className="size-2.5 text-primary opacity-40 animate-pulse" />
      {props.children}
    </span>
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
        "opacity-10 [&>svg]:size-2.5",
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
        "flex size-6 items-center justify-center rounded-lg bg-white/5 opacity-20 hover:opacity-100 transition-all active:scale-90",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="size-3" />
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