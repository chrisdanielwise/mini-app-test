"use client";

import React, { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "./skeleton-list";

interface DataGridNodeProps<T> {
  data: T[];
  isLoading: boolean;
  renderItem: (item: T) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  emptyState?: React.ReactNode;
  onRowClick?: (item: T) => void;
  gridClassName?: string;
}

/**
 * 🛰️ DATA_GRID_NODE (Institutional v9.5.8)
 * Strategy: Atomic Virtualization & Fluid Adaptation.
 * Security: RBAC Gated rendering.
 */
export const DataGridNode = memo(function DataGridNode<T extends { id: string }>({
  data,
  isLoading,
  renderItem,
  renderHeader,
  emptyState,
  onRowClick,
  gridClassName,
}: DataGridNodeProps<T>) {
  
  // 🚀 PERFORMANCE: Memoize the click handler to prevent child re-renders
  const handleAction = useCallback((item: T) => {
    if (onRowClick) onRowClick(item);
  }, [onRowClick]);

  // 🛡️ TACTICAL: Determine grid density based on data length
  const containerStyles = useMemo(() => cn(
    "grid w-full gap-4 transition-all duration-500",
    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", // Fluid breakpoints
    gridClassName
  ), [gridClassName]);

  if (isLoading && data.length === 0) {
    return <div className={containerStyles}>
      {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>;
  }

  if (data.length === 0) {
    return <div className="flex min-h-[300px] items-center justify-center rounded-[2rem] border border-dashed border-border/20 bg-muted/5">
      {emptyState || <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No_Data_Anchored</p>}
    </div>;
  }

  return (
    <div className="w-full space-y-4">
      {/* Optional Desktop Header */}
      {renderHeader && (
        <div className="hidden lg:block px-6 py-3 bg-muted/10 rounded-xl border border-border/10">
          {renderHeader()}
        </div>
      )}

      {/* Fluid Grid Terminal */}
      <div className={containerStyles}>
        {data.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleAction(item)}
            className="group cursor-pointer"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
});