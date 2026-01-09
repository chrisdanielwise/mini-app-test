import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 animate-pulse", className)}>
      <div className="flex items-start gap-3">
        <div className="size-12 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" data-slot="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}