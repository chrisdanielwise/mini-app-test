"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID INPUT GROUP
 * Logic: Unified focus vessel with organic light ingress.
 */
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Vessel
        "relative flex w-full items-center rounded-2xl border border-white/10 bg-card/20 backdrop-blur-md shadow-inner",
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "h-11 has-[>textarea]:h-auto",

        // 🌊 WATER FOCUS: The entire vessel glows when a control is engaged
        "has-[[data-slot=input-group-control]:focus-visible]:bg-card/40",
        "has-[[data-slot=input-group-control]:focus-visible]:border-primary/40",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-4",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-primary/5",

        // 🛡️ Error State
        "has-[[aria-invalid=true]]:border-destructive/50 has-[[aria-invalid=true]]:ring-destructive/10",

        className
      )}
      {...props}
    />
  );
}

const addonVariants = cva(
  "text-foreground/40 flex h-auto cursor-text items-center justify-center gap-2 py-2 text-[11px] font-black uppercase italic tracking-widest select-none transition-colors",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-4",
        "inline-end": "order-last pr-4",
        "block-start": "order-first w-full justify-start px-4 pt-3",
        "block-end": "order-last w-full justify-start px-4 pb-3",
      },
    },
    defaultVariants: { align: "inline-start" },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof addonVariants>) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(addonVariants({ align }), className)}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button")) {
          e.currentTarget.parentElement?.querySelector("input")?.focus();
        }
      }}
      {...props}
    />
  );
}

function InputGroupButton({
  className,
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { selectionChange } = useHaptics();
  return (
    <Button
      variant={variant}
      onClick={() => selectionChange()}
      className={cn(
        "h-8 px-3 text-[10px] font-black uppercase italic tracking-tighter rounded-xl hover:bg-primary/10",
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 border-0 bg-transparent shadow-none rounded-none h-full focus-visible:ring-0",
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 border-0 bg-transparent shadow-none rounded-none resize-none py-3 focus-visible:ring-0",
        className
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
};