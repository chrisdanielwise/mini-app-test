'use client'

// import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/lib/hooks/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="rounded-xl border-border/50 shadow-xl backdrop-blur-md">
            <div className="grid gap-1.5">
              {title && <ToastTitle className="text-sm font-black uppercase tracking-tight italic">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-xs font-medium opacity-80">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="rounded-lg hover:bg-muted/50" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}