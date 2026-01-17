"use client";

import React, { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { SkeletonCard } from "./skeleton-card";

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
 * 🌊 FLUID DATA GRID (Institutional v16.16.12)
 * Logic: Momentum-based entry with High-Density Ingress.
 * Design: v9.9.1 Hardened Glassmorphism.
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
  const { selectionChange } = useHaptics();

  // 🚀 PERFORMANCE: Memoize the click handler with Haptic Ingress
  const handleAction = useCallback((item: T) => {
    selectionChange(); // 🏁 TACTILE SYNC: Feel the node engagement
    if (onRowClick) onRowClick(item);
  }, [onRowClick, selectionChange]);

  // 🛡️ TACTICAL: Fluid Grid Logic with Atmospheric Tension
  const containerStyles = useMemo(() => cn(
    "grid w-full gap-5",
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    "animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]",
    gridClassName
  ), [gridClassName]);

  if (isLoading && data.length === 0) {
    return (
      <div className={containerStyles}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="opacity-40 grayscale animate-pulse">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center rounded-[2.5rem] border border-white/5 bg-card/5 backdrop-blur-md">
        {emptyState || (
          <div className="flex flex-col items-center gap-2">
            <div className="size-1 bg-primary/40 rounded-full animate-ping" />
            <p className="text-[10px] font-black uppercase italic tracking-[0.3em] opacity-30">
              Zero_Data_Anchored
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* 🌊 FLUID HEADER: Fades into the background surface */}
      {renderHeader && (
        <div className="hidden lg:block px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
          {renderHeader()}
        </div>
      )}

      {/* 🌊 LIQUID GRID TERMINAL */}
      <div className={containerStyles}>
        {data.map((item, index) => (
          <div 
            key={item.id} 
            onClick={() => handleAction(item)}
            style={{ animationDelay: `${index * 40}ms` }} // 🚀 Staggered Ingress
            className={cn(
              "group relative cursor-pointer outline-none transition-all duration-500",
              "hover:scale-[1.02] active:scale-95"
            )}
          >
            {/* 🌊 AMBIENT RADIANCE: Subtle glow on hover */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none rounded-full" />
            
            <div className="relative z-10">
              {renderItem(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});