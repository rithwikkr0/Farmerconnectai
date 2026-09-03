/**
 * POST /api/farmers/match
 *
 * Two-stage matching:
 * 1. Deterministic filter — crop/problem keyword overlap + optional distance
 * 2. Gemini ranking — scores and explains the filtered candidates
 *
 * Gemini is NOT used to fabricate farmer data — only to rank real demo records.
 */

import type { IRequest } from 'itty-router';
import { GeminiService } from '../services/gemini.js';
import { DEMO_FARMERS } from '../data/farmers.demo.js';
import type {
  Env,
  FarmerMatchRequest,
  FarmerMatch,
  FarmerMatchResponse,
  ApiResponse,
  FarmerProfile,
} from '../types/index.js';

// ─── Haversine distance (km) ──────────────────────────────────────────────────

function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Deterministic pre-filter ─────────────────────────────────────────────────

function determinisitcScore(farmer: FarmerProfile, req: FarmerMatchRequest): number {
  let score = 0;

  if (req.crop) {
    const cropLower = req.crop.toLowerCase();
    if (farmer.crops.some((c) => c.toLowerCase().includes(cropLower))) {
      score += 40;
    }
  }

  if (req.problem) {
    const problemLower = req.problem.toLowerCase();
    const keywords = problemLower.split(/\s+/);
    const matched = keywords.some((kw) =>
      farmer.problems.some((p) => p.toLowerCase().includes(kw))
    );
    if (matched) score += 30;
  }

  if (req.location) {
    const locLower = req.location.toLowerCase();
    if (farmer.location.toLowerCase().includes(locLower)) {
      score += 20;
    }
  }

  // Experience bonus
  if (farmer.experience_years >= 10) score += 10;

  return score;
}

// ─── POST /api/farmers/match ──────────────────────────────────────────────────

export async function handleFarmerMatch(
  request: IRequest,
  env: Env
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 'INVALID_JSON', 400);
  }

  const req = body as Partial<FarmerMatchRequest>;

  if (!req.crop && !req.problem && !req.location) {
    return errorResponse(
      'Provide at least one of: crop, problem, location',
      'MISSING_FIELDS',
      400
    );
  }

  if (req.crop && req.crop.length > 150) {
    return errorResponse('crop cannot exceed 150 characters', 'PARAM_TOO_LONG', 400);
  }
  if (req.problem && req.problem.length > 300) {
    return errorResponse('problem cannot exceed 300 characters', 'PARAM_TOO_LONG', 400);
  }
  if (req.location && req.location.length > 150) {
    return errorResponse('location cannot exceed 150 characters', 'PARAM_TOO_LONG', 400);
  }

  if (req.latitude != null && (isNaN(req.latitude) || req.latitude < -90 || req.latitude > 90)) {
    return errorResponse('latitude must be between -90 and 90', 'INVALID_PARAMS', 400);
  }
  if (req.longitude != null && (isNaN(req.longitude) || req.longitude < -180 || req.longitude > 180)) {
    return errorResponse('longitude must be between -180 and 180', 'INVALID_PARAMS', 400);
  }

  const maxResults = Math.min(Math.max(req.maxResults ?? 5, 1), 10);

  // ── Step 1: Deterministic scoring ─────────────────────────────────────────
  const scored = DEMO_FARMERS
    .map((farmer) => ({
      farmer,
      deterministicScore: determinisitcScore(farmer, req as FarmerMatchRequest),
      distanceKm:
        req.latitude != null && req.longitude != null
          ? haversineKm(req.latitude, req.longitude, farmer.latitude, farmer.longitude)
          : undefined,
    }))
    .filter((f) => f.deterministicScore > 0) // must have at least one keyword match
    .sort((a, b) => b.deterministicScore - a.deterministicScore)
    .slice(0, maxResults * 2); // pass 2× to Gemini so it has options to rank

  if (scored.length === 0) {
    // No keyword matches — return top farmers by experience as fallback
    const fallback: FarmerMatch[] = DEMO_FARMERS.slice(0, 3).map((farmer) => ({
      farmer,
      matchScore: 30,
      matchReasons: ['Experienced farmer available for general consultation'],
      geminiExplanation: 'No exact match found. Showing experienced farmers in the network.',
    }));

    const resp: ApiResponse<FarmerMatchResponse> = {
      success: true,
      data: {
        matches: fallback,
        totalCandidates: DEMO_FARMERS.length,
        _demo: true,
      },
    };
    return jsonResponse(resp);
  }

  // ── Step 2: Gemini ranking ─────────────────────────────────────────────────
  let geminiRankings: Array<{ id: string; score: number; explanation: string }> = [];

  try {
    const gemini = new GeminiService(env.GEMINI_API_KEY);
    geminiRankings = await gemini.rankFarmerMatches(
      scored.map((s) => s.farmer),
      req as FarmerMatchRequest
    );
  } catch (err) {
    console.error('[/api/farmers/match] Gemini ranking error:', err);
    // Graceful fallback: use deterministic scores
    geminiRankings = scored.map((s) => ({
      id: s.farmer.id,
      score: s.deterministicScore,
      explanation: 'Matched based on crop and problem overlap.',
    }));
  }

  // ── Merge scores ──────────────────────────────────────────────────────────
  const rankMap = new Map(geminiRankings.map((r) => [r.id, r]));

  const matches: FarmerMatch[] = scored
    .map((s) => {
      const geminiData = rankMap.get(s.farmer.id);
      const reasons: string[] = [];
      if (req.crop && s.farmer.crops.some((c) => c.toLowerCase().includes(req.crop!.toLowerCase()))) {
        reasons.push(`Grows ${req.crop}`);
      }
      if (req.problem) {
        const kws = req.problem.toLowerCase().split(/\s+/);
        const matched = s.farmer.problems.filter((p) =>
          kws.some((kw) => p.toLowerCase().includes(kw))
        );
        if (matched.length > 0) reasons.push(`Experienced with: ${matched.join(', ')}`);
      }
      if (s.distanceKm != null) reasons.push(`~${s.distanceKm.toFixed(1)} km away`);

      return {
        farmer: s.farmer,
        matchScore: geminiData?.score ?? s.deterministicScore,
        matchReasons: reasons,
        ...(s.distanceKm !== undefined ? { distanceKm: s.distanceKm } : {}),
        geminiExplanation:
          geminiData?.explanation ?? 'Matched based on crop and problem overlap.',
      } as FarmerMatch;
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);

  const response: ApiResponse<FarmerMatchResponse> = {
    success: true,
    data: {
      matches,
      totalCandidates: DEMO_FARMERS.length,
      _demo: true,
    },
  };
  return jsonResponse(response);
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
