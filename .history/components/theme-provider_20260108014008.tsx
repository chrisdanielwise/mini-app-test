'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

/**
 * Image of the Next.js ThemeProvider lifecycle showing how it handles 
 * system preferences and local storage to prevent Hydration Mismatch.
 */


/**
 * Enhanced ThemeProvider for Telegram Mini Apps
 * Ensures the 'dark' class is applied based on Telegram's WebApp.colorScheme
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use 'class' as the default attribute for Tailwind CSS dark mode compatibility
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}