'use client'

/**
 * useFarmContext — lightweight client-side store for farm profile.
 * Persisted to localStorage so the user doesn't re-enter details on every page.
 * Passed to AI requests as context so Gemini understands the farmer's situation.
 */

import { useState, useEffect, useCallback } from 'react'
import type { FarmContext } from '@/lib/api'

const STORAGE_KEY = 'farmconnect_context'

const DEFAULT_CONTEXT: FarmContext = {}

function loadFromStorage(): FarmContext {
  if (typeof window === 'undefined') return DEFAULT_CONTEXT
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FarmContext) : DEFAULT_CONTEXT
  } catch {
    return DEFAULT_CONTEXT
  }
}

export function useFarmContext() {
  const [context, setContextState] = useState<FarmContext>(DEFAULT_CONTEXT)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setContextState(loadFromStorage())
    setLoaded(true)
  }, [])

  const updateContext = useCallback((updates: Partial<FarmContext>) => {
    setContextState((prev) => {
      const next = { ...prev, ...updates }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* storage quota exceeded — silently ignore */
      }
      return next
    })
  }, [])

  const clearContext = useCallback(() => {
    setContextState(DEFAULT_CONTEXT)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  /** Convert farm context to a Record suitable for the /api/ai context field */
  const toAIContext = useCallback(
    (extra?: Record<string, unknown>): Record<string, unknown> => {
      const out: Record<string, unknown> = {}
      if (context.location) out['location'] = context.location
      if (context.district) out['district'] = context.district
      if (context.state) out['state'] = context.state
      if (context.soilType) out['soilType'] = context.soilType
      if (context.landSizeAcres) out['landSizeAcres'] = context.landSizeAcres
      if (context.waterAvailability) out['waterAvailability'] = context.waterAvailability
      if (context.season) out['season'] = context.season
      if (context.primaryCrop) out['primaryCrop'] = context.primaryCrop
      if (context.livestock) out['livestock'] = context.livestock
      if (context.additionalNotes) out['additionalNotes'] = context.additionalNotes
      return { ...out, ...extra }
    },
    [context],
  )

  return { context, updateContext, clearContext, toAIContext, loaded }
}
