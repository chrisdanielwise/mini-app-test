import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * useIsMobile
 * Optimized for Telegram Mini App viewports where 
 * window.innerWidth might change based on the keyboard or bottom bar.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      // Re-evaluate both breakpoint and innerWidth for TMA resiliency
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Default to false (desktop) if undefined to prevent layout shifts during SSR
  return !!isMobile
}