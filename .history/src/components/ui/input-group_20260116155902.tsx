"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ INPUT_GROUP (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Focus.
 * Fix: Tactical h-11 height and hardened radii prevent layout blowout.
 */
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  const { isMobile } = useDeviceContext();

  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 10%
        "relative flex w-full items-center border shadow-inner transition-all duration-500",
        "bg-zinc-950/20 backdrop-blur-xl border-white/5",
        isMobile ? "h-10 rounded-lg" : "h-11 rounded-xl",
        "has-[>textarea]:h-auto",

        // 🌫️ LAMINAR FOCUS: HUD light ingress
        "has-[[data-slot=input-group-control]:focus-visible]:bg-zinc-950/60",
        "has-[[data-slot=input-group-control]:focus-visible]:border-primary/20",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-primary/5",

        // 🛡️ Error State
        "has-[[aria-invalid=true]]:border-rose-500/30 has-[[aria-invalid=true]]:ring-rose-500/5",

        className
      )}
      {...props}
    />
  );
}

const addonVariants = cva(
  "text-muted-foreground/20 flex h-auto cursor-text items-center justify-center gap-2 py-2 text-[8px] md:text-[9px] font-black uppercase italic tracking-widest select-none transition-colors",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3.5",
        "inline-end": "order-last pr-3.5",
        "block-start": "order-first w-full justify-start px-3.5 pt-2.5",
        "block-end": "order-last w-full justify-start px-3.5 pb-2.5",
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
  const { isReady } = useDeviceContext();

  return (
    <Button
      variant={variant}
      onClick={() => isReady && selectionChange()}
      className={cn(
        "h-7 px-2.5 text-[7.5px] md:text-[8px] font-black uppercase italic tracking-widest rounded-lg hover:bg-primary/5 hover:text-primary active:scale-95",
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
        "flex-1 border-0 bg-transparent shadow-none rounded-none h-full focus-visible:ring-0 text-[10px] md:text-[11px] font-black italic uppercase tracking-wider px-3",
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
        "flex-1 border-0 bg-transparent shadow-none rounded-none resize-none py-2.5 focus-visible:ring-0 text-[10px] md:text-[11px] font-black italic uppercase tracking-wider px-3",
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