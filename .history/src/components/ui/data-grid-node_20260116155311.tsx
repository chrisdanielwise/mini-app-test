"use client";

import React, { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

// 🛠️ Atomic UI Components
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
 * 🛰️ DATA_GRID_NODE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Density.
 * Fix: Staggered ingress (40ms) and clinical radii prevent layout blowout.
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
  const { screenSize, isReady } = useDeviceContext();

  // 🏁 TACTILE SYNC: Hardware-aware engagement
  const handleAction = useCallback((item: T) => {
    if (isReady) selectionChange();
    if (onRowClick) onRowClick(item);
  }, [onRowClick, selectionChange, isReady]);

  // 📐 MORPHOLOGY RECALIBRATION: Mapping 6-tier density
  const gridDensity = useMemo(() => {
    switch (screenSize) {
      case 'xs': return "grid-cols-1 gap-4";
      case 'sm': return "grid-cols-2 gap-4";
      case 'md': return "grid-cols-2 lg:grid-cols-3 gap-5";
      case 'lg': return "grid-cols-3 gap-6";
      case 'xl': return "grid-cols-4 gap-6";
      case 'xxl': return "grid-cols-5 gap-8";
      default: return "grid-cols-1 gap-4";
    }
  }, [screenSize]);

  const containerStyles = useMemo(() => cn(
    "grid w-full animate-in fade-in slide-in-from-bottom-2 duration-500",
    gridDensity,
    gridClassName
  ), [gridDensity, gridClassName]);

  if (isLoading && data.length === 0) {
    return (
      <div className={containerStyles}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="opacity-10 grayscale animate-pulse">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-xl">
        {emptyState || (
          <div className="flex flex-col items-center gap-3">
            <div className="size-1 bg-primary/20 rounded-full animate-ping" />
            <p className="text-[8.5px] font-black uppercase italic tracking-[0.4em] text-muted-foreground/30">
              Zero_Data_Anchored
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* 🛡️ HUD HEADER: Stationary metadata surface */}
      {renderHeader && (
        <div className="hidden md:block px-5 py-3 rounded-xl border border-white/5 bg-zinc-950/40 backdrop-blur-md">
          {renderHeader()}
        </div>
      )}

      {/* 🚀 LAMINAR GRID TERMINAL */}
      <div className={containerStyles}>
        {data.map((item, index) => (
          <div 
            key={item.id} 
            onClick={() => handleAction(item)}
            style={{ animationDelay: `${index * 30}ms` }} // 📐 Precision Stagger
            className={cn(
              "group relative cursor-pointer outline-none transition-all duration-300",
              "active:scale-95"
            )}
          >
            {/* 🌫️ TACTICAL RADIANCE: Shrunken subsurface glow */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-40 blur-xl transition-opacity pointer-events-none rounded-full" />
            
            <div className="relative z-10 h-full">
              {renderItem(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});