import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS classes with proper conflict resolution.
 * Use this instead of plain `clsx` to avoid class conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a compact string (e.g. 1200 → "1.2K")
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(num)
}

/**
 * Truncates a string to `maxLength` characters, appending an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}

/**
 * Type-safe Object.entries with preserved key types.
 */
export function typedEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

/**
 * Waits for `ms` milliseconds. Useful in async flows.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Returns `true` if running in a browser environment.
 */
export const isBrowser = typeof window !== 'undefined'
