"use client";

import * as React from "react";
import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/**
 * 🌊 FLUID FIELDSET
 * Logic: Group-aware vertical flow with liquid spacing.
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-8 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "has-[[data-slot=checkbox-group]]:gap-4 has-[[data-slot=radio-group]]:gap-4",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER LEGEND
 * Logic: v9.5.0 Hardened Terminal Typography.
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
        "mb-4 font-black uppercase italic tracking-[0.2em] text-primary/80",
        "data-[variant=legend]:text-[13px]",
        "data-[variant=label]:text-[11px]",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER FIELD
 */
const fieldVariants = cva(
  "group/field flex w-full gap-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
  {
    variants: {
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-row items-center justify-between",
        responsive: "flex-col @md/field-group:flex-row @md/field-group:items-center @md/field-group:justify-between",
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
 * 🌊 WATER FIELD LABEL
 * Logic: Interactive glass surface with checked state radiance.
 */
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label relative flex w-fit gap-3 transition-all duration-500",
        "has-[[data-slot=field]]:w-full has-[[data-slot=field]]:flex-col has-[[data-slot=field]]:rounded-2xl",
        "has-[[data-slot=field]]:bg-card/20 has-[[data-slot=field]]:backdrop-blur-md has-[[data-slot=field]]:border has-[[data-slot=field]]:border-white/5",
        "has-data-[state=checked]:bg-primary/10 has-data-[state=checked]:border-primary/40",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER FIELD DESCRIPTION
 */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-[11px] font-bold tracking-tight text-muted-foreground/40 leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER FIELD ERROR
 * Logic: High-visibility validation reveal.
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
        "text-[10px] font-black uppercase italic tracking-wider text-destructive animate-in fade-in slide-in-from-top-1 duration-500",
        className
      )}
      {...props}
    >
      {content}
    </div>
  );
}

/**
 * 🌊 WATER SEPARATOR
 */
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      className={cn("relative -my-1 h-px w-full bg-gradient-to-r from-transparent via-border/20 to-transparent", className)}
      {...props}
    >
      {children && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
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
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
};