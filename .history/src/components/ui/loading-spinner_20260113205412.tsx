import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-[3px]",
  }

  return (
    <div
      role="status"
      className={cn(
        "animate-spin rounded-full border-solid border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * 🚀 EXPLICIT EXPORT: LoadingScreen
 * Logic: Standardized for Telegram Mini App viewports with subtext support.
 */
export function LoadingScreen({ 
  message = "Initializing Secure Link...",
  subtext = "Syncing with Neon Database..." // ✅ Added default subtext
}: { 
  message?: string,
  subtext?: string // ✅ Added subtext prop definition
}) {
  return (
    <div 
      className="flex h-[75vh] w-full flex-col items-center justify-center gap-6 bg-background"
      suppressHydrationWarning
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/10" />
        <LoadingSpinner size="lg" className="relative z-10" />
      </div>
      
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs font-black uppercase italic tracking-[0.2em] text-primary animate-pulse">
          {message}
        </p>
        <p className="text-[10px] font-bold uppercase text-muted-foreground/60">
          {subtext} {/* ✅ Dynamically render subtext */}
        </p>
      </div>
    </div>
  )
}