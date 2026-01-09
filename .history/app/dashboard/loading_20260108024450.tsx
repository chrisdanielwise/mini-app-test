"use client"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Standardized Dashboard Loading State
 * Matches the layout's grid and padding for a seamless transition.
 */
export default function Loading() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-2">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-md opacity-50" />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl border border-border/50 bg-card/50" />
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="grid gap-4 md:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] rounded-2xl border border-border/50 bg-card/30" />
        <Skeleton className="col-span-3 h-[400px] rounded-2xl border border-border/50 bg-card/30" />
      </div>
    </div>
  )
}