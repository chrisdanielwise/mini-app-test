"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID PAGINATION (Institutional v16.16.12)
 * Logic: Haptic-synced stream navigation.
 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
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
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<"button">, "size"> &
  React.ComponentProps<"a">;

/**
 * 🌊 WATER LINK
 * Logic: Selection haptics with cubic-bezier scaling.
 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  onClick,
  ...props
}: PaginationLinkProps) {
  const { selectionChange } = useHaptics();

  const handleInteract = (e: React.MouseEvent<HTMLAnchorElement>) => {
    selectionChange(); // 🏁 TACTILE SYNC
    if (onClick) onClick(e);
  };

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      onClick={handleInteract}
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        "rounded-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "text-[11px] font-black uppercase italic tracking-widest",
        isActive 
          ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]" 
          : "hover:bg-card/40 hover:backdrop-blur-md opacity-60 hover:opacity-100",
        "active:scale-90",
        className
      )}
      {...props}
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
      className={cn("gap-1 px-3 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span className="hidden sm:block">Prev</span>
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
      className={cn("gap-1 px-3 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon className="size-4" />
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
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center opacity-40", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
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