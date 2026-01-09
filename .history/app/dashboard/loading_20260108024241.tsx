"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-8 w-full animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl border border-border/50" />
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] rounded-2xl border border-border/50" />
        <Skeleton className="col-span-3 h-[400px] rounded-2xl border border-border/50" />
      </div>
    </div>
  )
}