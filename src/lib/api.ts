/**
 * Bhoomi Mithra — Central Frontend API Client
 *
 * All communication with the Cloudflare Worker goes through this module.
 * Raw fetch() calls must NOT be scattered across components.
 *
 * Set NEXT_PUBLIC_WORKER_URL in .env.local:
 *   NEXT_PUBLIC_WORKER_URL=http://localhost:8787
 */

// ─── Types mirrored from worker (no shared package in this hackathon setup) ───

export type AITask =
  | 'crop_recommendation'
  | 'weather_action'
  | 'crop_diagnosis'
  | 'fertilizer_advice'
  | 'livestock_advice'
  | 'farm_plan'
  | 'profit_analysis'

export interface AISection {
  title: string
  content: string
  priority?: 'high' | 'medium' | 'low'
}

export interface AIResponse {
  task: AITask
  recommendation: string
  sections?: AISection[]
  safetyNote?: string
}

export interface WeatherCurrent {
  temperature_c: number
  humidity_pct: number
  wind_kph: number
  condition: string
  uv_index: number
  rainfall_mm: number
}

export interface WeatherForecastDay {
  date: string
  max_temp_c: number
  min_temp_c: number
  rainfall_mm: number
  condition: string
  humidity_pct: number
}

export interface WeatherData {
  _demo?: boolean
  status?: 'LIVE' | 'DEMO'
  source?: string
  location: string
  latitude?: number
  longitude?: number
  current: WeatherCurrent
  forecast: WeatherForecastDay[]
  fetched_at: string
}

export interface WeatherAdviceResponse {
  location: string
  weather: WeatherData
  advice: string
  risks: string[]
  preventiveActions: string[]
  safetyNote?: string
}

export interface CropRecommendationRequest {
  location: string
  latitude?: number
  longitude?: number
  soil: string
  waterAvailability: 'low' | 'moderate' | 'high'
  landSize: number
  season: string
  farmerGoal: 'subsistence' | 'profit' | 'export' | 'mixed'
  additionalContext?: string
}

export interface CropRecommendation {
  cropName: string
  suitabilityScore: number
  suitabilityLabel: 'excellent' | 'good' | 'moderate' | 'poor'
  reasons: string[]
  waterRequirement: 'low' | 'moderate' | 'high'
  majorRisks: string[]
  suggestedActions: string[]
  estimatedYield?: string
  estimatedProfit?: string
}

export interface CropRecommendationResponse {
  location: string
  season: string
  recommendations: CropRecommendation[]
  generalAdvice: string
  safetyNote: string
}

export interface FarmerProfile {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  crops: string[]
  problems: string[]
  experience_years: number
  land_size_acres: number
  phone_masked: string
  bio: string
  _demo: true
}

export interface FarmerMatch {
  farmer: FarmerProfile
  matchScore: number
  matchReasons: string[]
  distanceKm?: number
  geminiExplanation: string
}

export interface FarmerMatchResponse {
  matches: FarmerMatch[]
  totalCandidates: number
  _demo: true
}

export interface LaborWorker {
  id: string
  name: string
  skills: string[]
  dailyRate_inr: number
  availability: 'available' | 'busy' | 'unavailable'
  latitude: number
  longitude: number
  location: string
  experience_years: number
  phone_masked: string
  languages: string[]
  distanceKm: number
  _demo: true
}

export interface LaborNearbyResponse {
  workers: LaborWorker[]
  totalFound: number
  radiusKm: number
  _demo: true
}

export interface LaborRequestPayload {
  farmerName: string
  farmerPhone: string
  location: string
  latitude?: number
  longitude?: number
  skill: string
  startDate: string
  durationDays: number
  description?: string
}

export interface LaborRequestResponse {
  requestId: string
  status: 'pending'
  message: string
  submittedAt: string
}

export type MarketplaceCategory =
  | 'seeds'
  | 'fertilizers'
  | 'pesticides'
  | 'equipment'
  | 'produce'
  | 'services'

export interface MarketplaceListing {
  id: string
  title: string
  description: string
  category: MarketplaceCategory
  price_inr: number
  unit: string
  location: string
  sellerName: string
  sellerPhone_masked: string
  available: boolean
  postedAt: string
  tags: string[]
  _demo: true
}

export interface MarketplaceResponse {
  listings: MarketplaceListing[]
  total: number
  filters: Record<string, unknown>
  _demo: true
}

export interface FarmContext {
  farmerName?: string
  farmerPhone?: string
  location?: string
  district?: string
  state?: string
  soilType?: string
  landSizeAcres?: number
  waterAvailability?: 'low' | 'moderate' | 'high'
  season?: string
  primaryCrop?: string
  livestock?: string
  goal?: 'subsistence' | 'profit' | 'export' | 'mixed'
  budget_inr?: number
  additionalNotes?: string
}

// ─── Authentication Types ───────────────────────────────────────────────────

export interface AuthUser {
  id: string
  full_name: string
  email: string
  mobile: string
  created_at: string
  status: string
}

export interface DbFarmProfile {
  id: string
  user_id: string
  village?: string | null
  district?: string | null
  state?: string | null
  location: string
  latitude?: number | null
  longitude?: number | null
  land_size_acres: number
  soil_type: string
  water_availability: string
  current_crop: string
  season: string
  farming_goal: string
  livestock?: string | null
  created_at: string
  updated_at: string
}

export interface AuthData {
  sessionToken?: string
  user: AuthUser
  farmProfile: DbFarmProfile | null
}

export interface RegisterPayload {
  fullName: string
  email: string
  mobile: string
  password: string
  village?: string
  district?: string
  state?: string
  location: string
  landSizeAcres?: number
  soilType: string
  waterAvailability: string
  currentCrop: string
  season: string
  farmingGoal: string
  livestock?: string
  latitude?: number
  longitude?: number
}

export interface LoginPayload {
  email: string
  password: string
}

// ─── Internal fetch wrapper & Token Storage ─────────────────────────────────

const TOKEN_KEY = 'bhoomi_session_token'

export function setSessionToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      sessionStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  }
}

export function getSessionToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
  }
  return null
}

const BASE_URL =
  process.env.NEXT_PUBLIC_WORKER_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://farmconnect-ai-worker.bhoomi-mithra.workers.dev'
    : 'http://localhost:8787')

class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${path}`
  let res: Response

  const token = getSessionToken()
  const customHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  }
  if (token) {
    customHeaders['Authorization'] = `Bearer ${token}`
  }

  try {
    res = await fetch(url, {
      ...options,
      headers: customHeaders,
    })
  } catch {
    throw new ApiError(
      'NETWORK_ERROR',
      'Unable to connect to Bhoomi Mithra AI. Please check your connection.',
    )
  }

  // Handle non-JSON (e.g. 502 HTML error pages from Cloudflare)
  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new ApiError(
      'INVALID_RESPONSE',
      `Unexpected response from server (HTTP ${res.status}).`,
    )
  }

  const json = (await res.json()) as { success: boolean; data?: T; error?: string; code?: string }

  if (!json.success) {
    throw new ApiError(
      json.code ?? 'API_ERROR',
      json.error ?? 'An unexpected error occurred.',
    )
  }

  return json.data as T
}

// ─── Public API functions ─────────────────────────────────────────────────────

/** Ping the worker health endpoint */
export async function checkHealth(): Promise<{ status: string; service: string }> {
  return apiFetch('/api/health')
}

/** General AI advisor — 7 task types */
export async function askAI(
  task: AITask,
  context: Record<string, unknown>,
): Promise<AIResponse> {
  return apiFetch('/api/ai', {
    method: 'POST',
    body: JSON.stringify({ task, context }),
  })
}

/** Get demo weather for a location */
export async function getWeather(location: string): Promise<WeatherData> {
  return apiFetch(`/api/weather?location=${encodeURIComponent(location)}`)
}

/** Combine weather + farm context → Gemini crop-specific advice */
export async function getWeatherAdvice(payload: {
  location: string
  crop?: string
  growthStage?: string
  additionalContext?: string
}): Promise<WeatherAdviceResponse> {
  return apiFetch('/api/weather/advice', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** Get Gemini-powered structured crop recommendations */
export async function recommendCrops(
  payload: CropRecommendationRequest,
): Promise<CropRecommendationResponse> {
  return apiFetch('/api/crops/recommend', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** Find and rank farmer peers by crop/problem/location */
export async function matchFarmers(payload: {
  crop?: string
  problem?: string
  location?: string
  latitude?: number
  longitude?: number
  maxResults?: number
}): Promise<FarmerMatchResponse> {
  return apiFetch('/api/farmers/match', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** Find available agricultural workers within radius */
export async function getNearbyLabor(params: {
  lat: number
  lng: number
  radius?: number
  skill?: string
}): Promise<LaborNearbyResponse> {
  const qs = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
    radius: String(params.radius ?? 5),
    ...(params.skill ? { skill: params.skill } : {}),
  })
  return apiFetch(`/api/labor/nearby?${qs}`)
}

/** Submit a labor hire request */
export async function createLaborRequest(
  payload: LaborRequestPayload,
): Promise<LaborRequestResponse> {
  return apiFetch('/api/labor/request', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** Browse marketplace listings with optional filters */
export async function getMarketplaceListings(filters?: {
  category?: MarketplaceCategory
  location?: string
  minPrice?: number
  maxPrice?: number
  available?: boolean
}): Promise<MarketplaceResponse> {
  const params: Record<string, string> = {}
  if (filters?.category) params['category'] = filters.category
  if (filters?.location) params['location'] = filters.location
  if (filters?.minPrice !== undefined) params['minPrice'] = String(filters.minPrice)
  if (filters?.maxPrice !== undefined) params['maxPrice'] = String(filters.maxPrice)
  if (filters?.available !== undefined) params['available'] = String(filters.available)
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/api/marketplace${qs ? `?${qs}` : ''}`)
}

/** Fetch agricultural services from D1 */
export async function getAgriculturalServices(filters?: {
  type?: string
  location?: string
}): Promise<{ services: any[]; total: number }> {
  const params: Record<string, string> = {}
  if (filters?.type && filters.type !== 'all') params['type'] = filters.type
  if (filters?.location) params['location'] = filters.location
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/api/services${qs ? `?${qs}` : ''}`)
}

// ─── Authentication API Functions ─────────────────────────────────────────────

/** Register a new farmer account and initialize farm profile */
export async function registerFarmer(payload: RegisterPayload): Promise<AuthData> {
  const data = await apiFetch<AuthData>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (data.sessionToken) setSessionToken(data.sessionToken)
  return data
}

/** Login existing farmer */
export async function loginFarmer(payload: LoginPayload): Promise<AuthData> {
  const data = await apiFetch<AuthData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (data.sessionToken) setSessionToken(data.sessionToken)
  return data
}

/** Logout current session */
export async function logoutFarmer(): Promise<{ message: string }> {
  try {
    const res = await apiFetch<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    })
    setSessionToken(null)
    return res
  } catch {
    setSessionToken(null)
    return { message: 'Logged out' }
  }
}

/** Fetch authenticated farmer and farm profile */
export async function getAuthMe(): Promise<AuthData> {
  return apiFetch<AuthData>('/api/auth/me')
}

/** Update farmer profile in D1 */
export async function updateFarmerProfile(payload: Partial<DbFarmProfile>): Promise<AuthData> {
  return apiFetch<AuthData>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// ─── Re-export the error class so callers can instanceof check ────────────────
export { ApiError }
