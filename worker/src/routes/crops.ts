/**
 * POST /api/crops/recommend
 *
 * Accepts farmer/field context and calls Gemini to generate structured
 * crop recommendations with suitability scores, risks, and actions.
 */

import type { IRequest } from 'itty-router';
import { GeminiService } from '../services/gemini.js';
import type {
  Env,
  CropRecommendationRequest,
  CropRecommendationResponse,
  ApiResponse,
} from '../types/index.js';

const VALID_WATER_AVAILABILITY = new Set(['low', 'moderate', 'high']);
const VALID_FARMER_GOALS = new Set(['subsistence', 'profit', 'export', 'mixed']);

export async function handleCropRecommend(
  request: IRequest,
  env: Env
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 'INVALID_JSON', 400);
  }

  const req = body as Partial<CropRecommendationRequest>;

  // ── Validation & Defaults ────────────────────────────────────────────────
  if (!req.location?.trim()) {
    return errorResponse('location is required', 'MISSING_FIELDS', 400);
  }
  if (!req.soil?.trim()) {
    req.soil = 'Red sandy loam';
  }
  if (!req.landSize || req.landSize <= 0) {
    req.landSize = 2.5;
  }
  if (!req.season?.trim()) {
    req.season = 'Kharif';
  }
  if (!req.waterAvailability || !VALID_WATER_AVAILABILITY.has(req.waterAvailability)) {
    req.waterAvailability = 'moderate';
  }
  if (!req.farmerGoal || !VALID_FARMER_GOALS.has(req.farmerGoal)) {
    req.farmerGoal = 'profit';
  }

  if (req.landSize! > 100000) {
    return errorResponse(
      'landSize must be 100,000 acres or fewer',
      'INVALID_RANGE',
      400
    );
  }

  if (req.location!.length > 150) {
    return errorResponse(
      'location cannot exceed 150 characters',
      'PARAM_TOO_LONG',
      400
    );
  }

  if (req.soil!.length > 100) {
    return errorResponse(
      'soil cannot exceed 100 characters',
      'PARAM_TOO_LONG',
      400
    );
  }

  if (!VALID_WATER_AVAILABILITY.has(req.waterAvailability!)) {
    return errorResponse(
      'waterAvailability must be one of: low, moderate, high',
      'INVALID_VALUE',
      400
    );
  }

  if (!VALID_FARMER_GOALS.has(req.farmerGoal!)) {
    return errorResponse(
      'farmerGoal must be one of: subsistence, profit, export, mixed',
      'INVALID_VALUE',
      400
    );
  }

  // ── Gemini ────────────────────────────────────────────────────────────────
  try {
    const gemini = new GeminiService(env.GEMINI_API_KEY);
    const result = await gemini.generateCropRecommendations(
      req as CropRecommendationRequest
    );

    const response: ApiResponse<CropRecommendationResponse> = {
      success: true,
      data: result,
    };
    return jsonResponse(response);
  } catch (err: any) {
    console.error('[/api/crops/recommend] Gemini error caught:', err);
    if (err?.status === 429 || err?.message?.includes('busy') || err?.message?.includes('quota')) {
      return errorResponse('AI is busy. Please wait a moment.', 'RATE_LIMITED', 429);
    }
    return errorResponse('AI is temporarily unavailable.', 'GEMINI_UNAVAILABLE', 503);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(error: string, code: string, status: number): Response {
  return jsonResponse({ success: false, error, code }, status);
}
