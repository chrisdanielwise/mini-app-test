"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ TACTICAL TABLE (Institutional v16.16.12)
 * Logic: Sticky Ingress + Fluid Containerization.
 * Design: v9.9.1 Glassmorphism & v9.5.0 Institutional Typography.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-2xl border border-border/10 bg-card/20 backdrop-blur-sm shadow-2xl"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-[13px] border-collapse", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        // 🚀 Sticky Header Standard: Ensures column titles persist on scroll
        "sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border/10", 
        className
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("divide-y divide-border/5", className)}
      {...props}
    />
  );
}

function TableRow({ className, onClick, ...props }: React.ComponentProps<"tr">) {
  const { selectionChange } = useHaptics();

  const handleRowClick = React.useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>) => {
      if (onClick) {
        selectionChange(); // 🏁 TACTILE SYNC: Confirm selection
        onClick(e);
      }
    },
    [onClick, selectionChange]
  );

  return (
    <tr
      data-slot="table-row"
      onClick={handleRowClick}
      className={cn(
        "transition-all duration-200",
        "hover:bg-primary/[0.03] active:bg-primary/[0.05]",
        "data-[state=selected]:bg-primary/[0.07]",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-4 text-left align-middle",
        "text-[10px] font-black uppercase italic tracking-[0.2em] text-muted-foreground/60",
        "whitespace-nowrap transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-4 align-middle font-bold tracking-tight text-foreground/90 whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-primary/[0.02] border-t border-border/10 font-black text-primary italic",
        className
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
};