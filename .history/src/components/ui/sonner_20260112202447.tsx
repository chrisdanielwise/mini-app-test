'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-card/95 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-muted-foreground font-medium text-xs",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold rounded-xl",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-bold rounded-xl",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }