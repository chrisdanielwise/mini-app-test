"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/**
 * 🌊 FLUID BUTTON GROUP (Institutional v16.16.12)
 * Logic: Unified focus vessel with organic segment transitions.
 */
const buttonGroupVariants = cva(
  cn(
    "flex w-fit items-stretch transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "bg-card/30 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden",
    "[&>*]:z-0 [&>*]:relative [&>*]:border-0 [&>*]:shadow-none [&>*]:rounded-none",
    "focus-within:ring-4 focus-within:ring-primary/5"
  ),
  {
    variants: {
      orientation: {
        horizontal: "flex-row rounded-xl md:rounded-2xl",
        vertical: "flex-col rounded-xl md:rounded-2xl",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

/**
 * 🌊 WATER GROUP TEXT
 * Logic: Institutional label node for segmented data.
 */
function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 px-4 bg-white/5",
        "h-11 md:h-12 text-[10px] font-black uppercase italic tracking-[0.2em] text-foreground/40",
        "transition-colors duration-500",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER GROUP SEPARATOR
 * Logic: Gradient tension break between segments.
 */
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-gradient-to-b from-transparent via-white/10 to-transparent",
        "data-[orientation=vertical]:w-px data-[orientation=vertical]:h-auto",
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-auto",
        className
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};