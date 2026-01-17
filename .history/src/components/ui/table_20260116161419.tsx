"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ TABLE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Ingress.
 * Fix: Tactical containerization prevents viewport drift on mobile hardware.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto border transition-all duration-500 bg-zinc-950/20 backdrop-blur-3xl border-white/5 rounded-xl scrollbar-none"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-[11px] border-collapse", className)}
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
        "sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-3xl border-b border-white/5", 
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
      className={cn("divide-y divide-white/5", className)}
      {...props}
    />
  );
}

/**
 * 🛰️ TABLE_ROW
 * Strategy: Technical Selection & Hardware Handshake.
 */
function TableRow({ className, onClick, ...props }: React.ComponentProps<"tr">) {
  const { selectionChange } = useHaptics();
  const { isReady } = useDeviceContext();

  const handleRowClick = React.useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>) => {
      if (onClick) {
        if (isReady) selectionChange();
        onClick(e);
      }
    },
    [onClick, selectionChange, isReady]
  );

  return (
    <tr
      data-slot="table-row"
      onClick={handleRowClick}
      className={cn(
        "transition-all duration-300",
        "hover:bg-primary/5 active:bg-primary/10",
        "data-[state=selected]:bg-primary/5",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ TABLE_HEAD
 * Strategy: Technical Metadata Alignment.
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-9 px-4 text-left align-middle", // Shrunken from h-12
        "text-[8.5px] font-black uppercase italic tracking-[0.3em] text-muted-foreground/30",
        "whitespace-nowrap transition-colors",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ TABLE_CELL
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-11 px-4 align-middle font-black italic uppercase tracking-wider text-foreground/80 whitespace-nowrap",
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
        "bg-primary/5 border-t border-white/5 font-black text-primary italic",
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