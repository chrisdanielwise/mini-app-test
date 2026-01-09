import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
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

export function LoadingScreen({ message = "Initializing Secure Link..." }: { message?: string }) {
  return (
    /**
     * 🚀 HYDRATION FIX:
     * suppressHydrationWarning is essential here because Telegram's viewport 
     * often forces a re-render that differs from the initial Server response.
     */
    <div 
      className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 bg-background"
      suppressHydrationWarning
    >
      <div className="relative flex items-center justify-center">
        {/* Decorative outer pulse for the "Establishing Link" feel */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/10" />
        <LoadingSpinner size="lg" className="relative z-10" />
      </div>
      
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs font-black uppercase italic tracking-[0.2em] text-primary animate-pulse">
          {message}
        </p>
        <p className="text-[10px] font-bold uppercase text-muted-foreground/60">
          Syncing with Neon Database...
        </p>
      </div>
    </div>
  )
}