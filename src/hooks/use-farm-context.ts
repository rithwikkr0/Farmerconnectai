'use client'

/**
 * useFarmContext — connected client-side store & Cloudflare D1 profile bridge.
 * Cloudflare D1 is the primary source of truth for the authenticated farmer.
 * Automatically synchronizes with /api/auth/me on mount.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  type FarmContext,
  type AuthUser,
  type DbFarmProfile,
  getAuthMe,
  logoutFarmer,
  updateFarmerProfile as apiUpdateProfile,
} from '@/lib/api'

const STORAGE_KEY = 'bhoomimithra_context'

const DEFAULT_CONTEXT: FarmContext = {
  farmerName: 'Ramesh Gowda',
  farmerPhone: '+91 98450 11223',
  location: 'Hulivana, Mandya, Karnataka',
  district: 'Mandya',
  state: 'Karnataka',
  landSizeAcres: 3.5,
  soilType: 'Red sandy loam',
  waterAvailability: 'moderate',
  primaryCrop: 'Finger Millet (Ragi)',
  season: 'Kharif',
  goal: 'profit',
  livestock: '2 Indigenous Hallikar Dairy Cattle',
}

function loadFromStorage(): FarmContext {
  if (typeof window === 'undefined') return DEFAULT_CONTEXT
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem('farmconnect_context')
    return raw ? (JSON.parse(raw) as FarmContext) : DEFAULT_CONTEXT
  } catch {
    return DEFAULT_CONTEXT
  }
}

export function useFarmContext() {
  const [context, setContextState] = useState<FarmContext>(DEFAULT_CONTEXT)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [farmProfile, setFarmProfile] = useState<DbFarmProfile | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Sync with D1 /api/auth/me
  const refreshAuth = useCallback(async () => {
    setIsSyncing(true)
    try {
      const auth = await getAuthMe()
      if (auth && auth.user) {
        setUser(auth.user)
        if (auth.farmProfile) {
          setFarmProfile(auth.farmProfile)
          const syncedContext: FarmContext = {
            farmerName: auth.user.full_name,
            farmerPhone: auth.user.mobile,
            location: auth.farmProfile.location,
            district: auth.farmProfile.district || undefined,
            state: auth.farmProfile.state || undefined,
            landSizeAcres: auth.farmProfile.land_size_acres,
            soilType: auth.farmProfile.soil_type,
            waterAvailability: auth.farmProfile.water_availability as 'low' | 'moderate' | 'high',
            primaryCrop: auth.farmProfile.current_crop,
            season: auth.farmProfile.season,
            goal: auth.farmProfile.farming_goal as 'subsistence' | 'profit' | 'export' | 'mixed',
            livestock: auth.farmProfile.livestock || undefined,
          }
          setContextState(syncedContext)
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedContext))
          } catch {}
        }
      }
    } catch {
      // Unauthenticated or network error — rely on local storage fallback
    } finally {
      setIsSyncing(false)
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    setContextState(loadFromStorage())
    refreshAuth()
  }, [refreshAuth])

  const updateContext = useCallback(
    async (updates: Partial<FarmContext>) => {
      setContextState((prev) => {
        const next = { ...prev, ...updates }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {}
        return next
      })

      // If authenticated, persist to D1 farm_profiles asynchronously
      if (user) {
        try {
          await apiUpdateProfile({
            location: updates.location,
            district: updates.district,
            state: updates.state,
            land_size_acres: updates.landSizeAcres,
            soil_type: updates.soilType,
            water_availability: updates.waterAvailability,
            current_crop: updates.primaryCrop,
            season: updates.season,
            farming_goal: updates.goal,
            livestock: updates.livestock,
          })
        } catch (err) {
          console.warn('[useFarmContext] Failed to sync update to D1:', err)
        }
      }
    },
    [user],
  )

  const logout = useCallback(async () => {
    try {
      await logoutFarmer()
    } finally {
      setUser(null)
      setFarmProfile(null)
      setContextState(DEFAULT_CONTEXT)
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.clear()
    }
  }, [])

  const clearContext = useCallback(() => {
    setContextState(DEFAULT_CONTEXT)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  /** Convert farm context to a Record suitable for the /api/ai context field */
  const toAIContext = useCallback(
    (extra?: Record<string, unknown>): Record<string, unknown> => {
      const out: Record<string, unknown> = {}
      const name = user?.full_name || context.farmerName
      const loc = farmProfile?.location || context.location
      const dist = farmProfile?.district || context.district
      const st = farmProfile?.state || context.state
      const soil = farmProfile?.soil_type || context.soilType
      const land = farmProfile?.land_size_acres || context.landSizeAcres
      const water = farmProfile?.water_availability || context.waterAvailability
      const ssn = farmProfile?.season || context.season
      const crop = farmProfile?.current_crop || context.primaryCrop
      const lstk = farmProfile?.livestock || context.livestock
      const gl = farmProfile?.farming_goal || context.goal

      if (name) out['farmerName'] = name
      if (loc) out['location'] = loc
      if (dist) out['district'] = dist
      if (st) out['state'] = st
      if (soil) out['soilType'] = soil
      if (land) out['landSizeAcres'] = land
      if (water) out['waterAvailability'] = water
      if (ssn) out['season'] = ssn
      if (crop) out['primaryCrop'] = crop
      if (lstk) out['livestock'] = lstk
      if (gl) out['goal'] = gl
      if (context.budget_inr) out['budget_inr'] = context.budget_inr
      if (context.additionalNotes) out['additionalNotes'] = context.additionalNotes
      return { ...out, ...extra }
    },
    [context, user, farmProfile],
  )

  return {
    context,
    user,
    farmProfile,
    isAuthenticated: Boolean(user),
    isSyncing,
    updateContext,
    clearContext,
    toAIContext,
    refreshAuth,
    logout,
    loaded,
  }
}
