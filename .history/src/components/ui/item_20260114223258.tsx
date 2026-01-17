"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID ITEM GROUP
 */
function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col gap-1", className)}
      {...props}
    />
  );
}

/**
 * 🌊 WATER ITEM SEPARATOR
 */
function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      className={cn("mx-4 opacity-5 bg-gradient-to-r from-transparent via-border to-transparent", className)}
      {...props}
    />
  );
}

const itemVariants = cva(
  "group/item relative flex items-center gap-4 rounded-2xl border border-transparent transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-card/40 hover:backdrop-blur-md hover:border-white/5",
        outline: "border-white/10 bg-card/20 backdrop-blur-sm hover:bg-card/40",
        muted: "bg-muted/30 opacity-60 hover:opacity-100",
      },
      size: {
        default: "p-4",
        sm: "py-3 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * 🌊 WATER ITEM
 * Logic: Haptic-synced interaction with water-flow momentum.
 */
function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const { selectionChange } = useHaptics();
  const Comp = asChild ? Slot : "div";

  const handleInteract = (e: React.MouseEvent<HTMLDivElement>) => {
    selectionChange(); // 🏁 TACTILE SYNC
    if (onClick) onClick(e);
  };

  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      onClick={handleInteract}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  );
}

/**
 * 🌊 ITEM MEDIA
 * Logic: v9.9.1 Hardened Glassmorphism for icons/images.
 */
function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "icon" | "image" }) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        "flex shrink-0 items-center justify-center transition-transform duration-500 group-hover/item:scale-110",
        variant === "icon" && "size-10 rounded-xl bg-primary/10 text-primary border border-primary/20",
        variant === "image" && "size-12 rounded-xl overflow-hidden border border-white/10",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🏛️ INSTITUTIONAL CONTENT NODES
 */
function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex flex-1 flex-col gap-0.5 min-w-0", className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("text-[13px] font-black uppercase italic tracking-wider text-foreground/90", className)}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("text-[11px] font-bold text-muted-foreground/60 leading-relaxed line-clamp-2 text-balance", className)}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-actions" className={cn("flex items-center gap-2 shrink-0", className)} {...props} />;
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
};