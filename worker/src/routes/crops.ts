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

  // ── Validation ────────────────────────────────────────────────────────────
  const missing: string[] = [];
  if (!req.location?.trim()) missing.push('location');
  if (!req.soil?.trim()) missing.push('soil');
  if (!req.waterAvailability) missing.push('waterAvailability');
  if (!req.landSize || req.landSize <= 0) missing.push('landSize (positive number in acres)');
  if (!req.season?.trim()) missing.push('season');
  if (!req.farmerGoal) missing.push('farmerGoal');

  if (missing.length > 0) {
    return errorResponse(
      `Missing required fields: ${missing.join(', ')}`,
      'MISSING_FIELDS',
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
  } catch (err) {
    console.error('[/api/crops/recommend] Gemini error:', err);
    return errorResponse(
      'AI service temporarily unavailable. Please try again.',
      'AI_ERROR',
      503
    );
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
