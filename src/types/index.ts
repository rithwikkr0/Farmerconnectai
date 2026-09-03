/**
 * Shared TypeScript types and interfaces.
 * Keep domain-specific types co-located with their features.
 * Use this file for truly global, reusable types only.
 */

/** Generic async state wrapper */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

/** Navigation item */
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  external?: boolean
}

/** Generic page props with optional search params */
export interface PageProps {
  params?: Record<string, string>
  searchParams?: Record<string, string | string[] | undefined>
}

/** Canonical response shape for API routes */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

/** Utility: make specific keys of T required */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/** Utility: make all keys of T optional except K */
export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>
