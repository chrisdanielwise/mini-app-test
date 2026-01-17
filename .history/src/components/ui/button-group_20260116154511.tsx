"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ BUTTON_GROUP (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Geometry Lock.
 * Fix: Tactical h-10/11 profiles and shrunken typography prevent layout blowout.
 */
const buttonGroupVariants = cva(
  cn(
    "flex w-fit items-stretch transition-all duration-500",
    "bg-zinc-950/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden",
    "[&>*]:z-0 [&>*]:relative [&>*]:border-0 [&>*]:shadow-none [&>*]:rounded-none",
    "focus-within:ring-2 focus-within:ring-primary/20"
  ),
  {
    variants: {
      orientation: {
        horizontal: "flex-row rounded-lg md:rounded-xl",
        vertical: "flex-col rounded-lg md:rounded-xl",
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
 * 🛰️ BUTTON_GROUP_TEXT
 * Strategy: Technical Metadata Node.
 */
function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";
  const { isMobile } = useDeviceContext();

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 px-3 bg-white/[0.02]",
        // 📐 TACTICAL HEIGHT: Institutional Standard
        isMobile ? "h-10 text-[8px]" : "h-11 text-[9px]",
        "font-black uppercase italic tracking-widest text-muted-foreground/30",
        "transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ BUTTON_GROUP_SEPARATOR
 * Strategy: Clinical Tension Break.
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
        "bg-white/5",
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