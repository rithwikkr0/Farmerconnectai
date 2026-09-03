/**
 * FarmConnect AI — Shared TypeScript Types
 * Used by both the Worker routes and the Gemini service.
 */

// ─── Cloudflare Worker Environment Bindings ──────────────────────────────────

export interface Env {
  /** Gemini API key — injected as a Worker secret, never exposed to browser */
  GEMINI_API_KEY: string;
  /** Allowed CORS origin, set in wrangler.toml [vars] */
  ALLOWED_ORIGIN: string;
  /**
   * D1 database binding (optional — uncomment in wrangler.toml to enable).
   * Stub kept here so TypeScript doesn't complain when you wire it up.
   */
  // DB: D1Database;
}

// ─── Generic API Response Shape ──────────────────────────────────────────────

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  code: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── AI Tasks ─────────────────────────────────────────────────────────────────

export type AITask =
  | 'crop_recommendation'
  | 'weather_action'
  | 'crop_diagnosis'
  | 'fertilizer_advice'
  | 'livestock_advice'
  | 'farm_plan'
  | 'profit_analysis';

export interface AIRequest {
  task: AITask;
  /** Arbitrary farmer/crop/field context — passed directly to Gemini */
  context: Record<string, unknown>;
}

export interface AIResponse {
  task: AITask;
  recommendation: string;
  /** Structured advice sections — Gemini returns these as JSON */
  sections?: AISection[];
  safetyNote?: string;
}

export interface AISection {
  title: string;
  content: string;
  priority?: 'high' | 'medium' | 'low';
}

// ─── Weather ──────────────────────────────────────────────────────────────────

export interface WeatherData {
  /** Explicit flag indicating whether data is demo or real */
  _demo?: boolean;
  status: 'LIVE' | 'DEMO';
  source: string;
  location: string;
  latitude?: number;
  longitude?: number;
  current: {
    temperature_c: number;
    humidity_pct: number;
    wind_kph: number;
    condition: string;
    uv_index: number;
    rainfall_mm: number;
  };
  forecast: WeatherForecastDay[];
  fetched_at: string;
}

export interface WeatherForecastDay {
  date: string;
  max_temp_c: number;
  min_temp_c: number;
  rainfall_mm: number;
  condition: string;
  humidity_pct: number;
}

export interface WeatherAdviceRequest {
  location: string;
  crop?: string;
  growthStage?: string;
  additionalContext?: string;
}

export interface WeatherAdviceResponse {
  location: string;
  weather: WeatherData;
  advice: string;
  risks: string[];
  preventiveActions: string[];
  safetyNote?: string;
}

// ─── Crop Recommendations ────────────────────────────────────────────────────

export interface CropRecommendationRequest {
  location: string;
  latitude?: number;
  longitude?: number;
  soil: string;
  waterAvailability: 'low' | 'moderate' | 'high';
  landSize: number; // in acres
  season: string;
  farmerGoal: 'subsistence' | 'profit' | 'export' | 'mixed';
  additionalContext?: string;
}

export interface CropRecommendation {
  cropName: string;
  suitabilityScore: number; // 0–100
  suitabilityLabel: 'excellent' | 'good' | 'moderate' | 'poor';
  reasons: string[];
  waterRequirement: 'low' | 'moderate' | 'high';
  majorRisks: string[];
  suggestedActions: string[];
  estimatedYield?: string;
  estimatedProfit?: string;
}

export interface CropRecommendationResponse {
  location: string;
  season: string;
  recommendations: CropRecommendation[];
  generalAdvice: string;
  safetyNote: string;
}

// ─── Farmer Matching ──────────────────────────────────────────────────────────

export interface FarmerProfile {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  crops: string[];
  problems: string[];
  experience_years: number;
  land_size_acres: number;
  phone_masked: string; // e.g. "+91-XXXX-XX1234"
  bio: string;
  _demo: true;
}

export interface FarmerMatchRequest {
  crop?: string;
  problem?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  maxResults?: number;
}

export interface FarmerMatch {
  farmer: FarmerProfile;
  matchScore: number; // 0–100
  matchReasons: string[];
  distanceKm?: number;
  geminiExplanation: string;
}

export interface FarmerMatchResponse {
  matches: FarmerMatch[];
  totalCandidates: number;
  _demo: true;
}

// ─── Labor ────────────────────────────────────────────────────────────────────

export interface LaborWorker {
  id: string;
  name: string;
  skills: string[];
  dailyRate_inr: number;
  availability: 'available' | 'busy' | 'unavailable';
  latitude: number;
  longitude: number;
  location: string;
  experience_years: number;
  phone_masked: string;
  languages: string[];
  _demo: true;
}

export interface LaborNearbyRequest {
  latitude: number;
  longitude: number;
  radius_km: number; // 5 or 10
  skill?: string;
}

export interface LaborNearbyResponse {
  workers: Array<LaborWorker & { distanceKm: number }>;
  totalFound: number;
  radiusKm: number;
  _demo: true;
}

export interface LaborRequest {
  farmerName: string;
  farmerPhone: string;
  location: string;
  latitude?: number;
  longitude?: number;
  skill: string;
  startDate: string; // ISO 8601
  durationDays: number;
  description?: string;
}

export interface LaborRequestResponse {
  requestId: string;
  status: 'pending';
  message: string;
  submittedAt: string;
}

// ─── Marketplace ──────────────────────────────────────────────────────────────

export type MarketplaceCategory =
  | 'seeds'
  | 'fertilizers'
  | 'pesticides'
  | 'equipment'
  | 'produce'
  | 'services';

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  price_inr: number;
  unit: string;
  location: string;
  sellerName: string;
  sellerPhone_masked: string;
  available: boolean;
  postedAt: string; // ISO 8601
  tags: string[];
  _demo: true;
}

export interface MarketplaceFilters {
  category?: MarketplaceCategory;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export interface MarketplaceResponse {
  listings: MarketplaceListing[];
  total: number;
  filters: MarketplaceFilters;
  _demo: true;
}
