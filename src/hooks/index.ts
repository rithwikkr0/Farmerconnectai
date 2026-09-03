'use client'

import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '@/lib/constants'

/**
 * Returns true if the current viewport width is at or above the given breakpoint.
 * Safe to use with SSR — returns `false` on the server.
 */
export function useMediaQuery(breakpoint: keyof typeof BREAKPOINTS): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const query = `(min-width: ${BREAKPOINTS[breakpoint]}px)`
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [breakpoint])

  return matches
}

/**
 * Copies text to clipboard and returns a temporary `copied` state.
 */
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    } catch {
      console.error('Failed to copy to clipboard')
    }
  }

  return { copied, copy }
}

/**
 * Debounces a value by the specified delay (ms).
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
