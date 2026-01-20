"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ PAGINATION (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1.5 md:gap-2", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li {...props} />;
}

// ✅ FIX: TS2344 - Pulling size directly from buttonVariants to ensure constraint satisfaction
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<VariantProps<typeof buttonVariants>, "size"> &
  Omit<React.ComponentProps<"a">, "size">; // ✅ FIX: Omit size from 'a' to prevent TS2783

/**
 * 🛰️ PAGINATION_LINK
 * Strategy: Technical Logic Node & Hardware Handshake.
 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  onClick,
  ...props
}: PaginationLinkProps) {
  const { selectionChange } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  const handleInteract = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
    if (isReady) selectionChange();
    if (onClick) onClick(e);
  };

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      onClick={handleInteract}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: size as any, // ✅ FIX: TS2322 - Explicit cast for strict variant satisfaction
        }),
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
        "transition-all duration-300 select-none cursor-pointer",
        isMobile ? "size-8 rounded-lg" : "size-9 rounded-xl",
        
        // 🏛️ INSTITUTIONAL TYPOGRAPHY
        "text-[9px] font-black uppercase italic tracking-widest",
        
        // 🌫️ LAMINAR RADIANCE: HUD state logic
        isActive 
          ? "bg-primary/5 border-primary/20 text-primary shadow-lg shadow-primary/5" 
          : "text-muted-foreground/30 hover:bg-zinc-950/40 hover:text-foreground hover:backdrop-blur-xl",
        
        "active:scale-95",
        className
      )}
      {...props} // ✅ FIX: TS2783 - 'size' is no longer in props, so spread is safe
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1.5 px-3 md:pl-2.5 w-auto h-8 md:h-9", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-3.5" />
      <span className="hidden md:block">Prev</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1.5 px-3 md:pr-2.5 w-auto h-8 md:h-9", className)}
      {...props}
    >
      <span className="hidden md:block">Next</span>
      <ChevronRightIcon className="size-3.5" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex size-8 md:size-9 items-center justify-center text-muted-foreground/10", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-3.5" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};