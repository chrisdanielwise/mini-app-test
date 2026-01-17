"use client";

import * as React from "react";
import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ FIELD_SET (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Flow.
 * Fix: Tactical gap-5 and clinical radii prevent layout blowout.
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-5 transition-all duration-500",
        "has-[[data-slot=checkbox-group]]:gap-3 has-[[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ FIELD_LEGEND
 * Strategy: Technical Metadata Scale.
 */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-2.5 font-black uppercase italic tracking-widest text-primary/40 leading-none",
        "data-[variant=legend]:text-[11px]",
        "data-[variant=label]:text-[9px]",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ FIELD
 */
const fieldVariants = cva(
  "group/field flex w-full gap-3 transition-all duration-500",
  {
    variants: {
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-row items-center justify-between",
        responsive: "flex-col md:flex-row md:items-center md:justify-between",
      },
    },
    defaultVariants: { orientation: "vertical" },
  }
);

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

/**
 * 🛰️ FIELD_LABEL
 * Strategy: High-Density Technical Surface.
 */
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { isMobile } = useDeviceContext();

  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label relative flex w-fit gap-2.5 transition-all duration-300",
        "text-[9px] font-black uppercase italic tracking-widest text-foreground/60 leading-none",
        "has-[[data-slot=field]]:w-full has-[[data-slot=field]]:flex-col",
        "has-[[data-slot=field]]:bg-zinc-950/20 has-[[data-slot=field]]:backdrop-blur-md has-[[data-slot=field]]:border has-[[data-slot=field]]:border-white/5",
        isMobile ? "has-[[data-slot=field]]:rounded-xl has-[[data-slot=field]]:p-4" : "has-[[data-slot=field]]:rounded-2xl has-[[data-slot=field]]:p-5",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary/20 has-data-[state=checked]:text-primary",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ FIELD_DESCRIPTION
 * Strategy: Clinical Density Standard.
 */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-[8.5px] font-black uppercase tracking-widest text-muted-foreground/20 leading-tight mt-1",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ FIELD_ERROR
 * Strategy: High-Visibility Technical Reveal.
 */
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) return children;
    if (!errors) return null;
    const firstError = errors.find((e) => e?.message);
    return firstError?.message || null;
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "text-[8px] font-black uppercase italic tracking-wider text-rose-500/80 mt-1.5 animate-in fade-in slide-in-from-top-0.5 duration-300",
        className
      )}
      {...props}
    >
      {content}
    </div>
  );
}

/**
 * 🛰️ FIELD_SEPARATOR
 */
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      className={cn("relative h-px w-full bg-white/5 my-2", className)}
      {...props}
    >
      {children && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-950 px-2 text-[7.5px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic">
          {children}
        </span>
      )}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSeparator,
  FieldSet,
};