"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ ITEM_GROUP
 * Strategy: High-Density Signal Stream.
 */
function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col gap-0.5", className)}
      {...props}
    />
  );
}

/**
 * 🛰️ ITEM_SEPARATOR
 */
function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      className={cn("mx-4 h-[0.5px] bg-white/5 opacity-10", className)}
      {...props}
    />
  );
}

const itemVariants = cva(
  "group/item relative flex items-center gap-3.5 border border-transparent transition-all duration-300 outline-none select-none",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-zinc-950/40 hover:backdrop-blur-xl hover:border-white/5",
        outline: "border-white/5 bg-zinc-950/20 backdrop-blur-md hover:bg-zinc-950/60",
        muted: "bg-zinc-950/10 opacity-30 hover:opacity-100",
      },
      size: {
        // 📐 TACTICAL SCALE: Compression for high-density HUDs
        default: "py-3 px-4 rounded-xl",
        sm: "py-2 px-3 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * 🛰️ ITEM (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Hardware-Fluid Handshake.
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
  const { isReady } = useDeviceContext();
  const Comp = asChild ? Slot : "div";

  const handleInteract = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReady) selectionChange();
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
 * 🛰️ ITEM_MEDIA
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
        "flex shrink-0 items-center justify-center transition-all duration-300 group-hover/item:scale-105",
        variant === "icon" && "size-8 rounded-lg bg-primary/5 text-primary border border-primary/10 [&_svg]:size-3.5",
        variant === "image" && "size-10 rounded-lg overflow-hidden border border-white/5",
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
      className={cn("flex flex-1 flex-col gap-0 min-w-0 leading-tight", className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("text-[11px] font-black uppercase italic tracking-widest text-foreground/80 truncate", className)}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("text-[8.5px] font-black uppercase tracking-wider text-muted-foreground/20 italic line-clamp-1", className)}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-actions" className={cn("flex items-center gap-1.5 shrink-0", className)} {...props} />;
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