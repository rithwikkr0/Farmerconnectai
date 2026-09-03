/**
 * GET  /api/labor/nearby?lat=&lng=&radius=5&skill=harvesting
 * POST /api/labor/request
 *
 * GET  filters demo workers by Haversine distance.
 * POST saves a labor request (in-memory for hackathon; D1 hook commented below).
 */

import type { IRequest } from 'itty-router';
import { DEMO_LABOR_WORKERS } from '../data/labor.demo.js';
import type {
  Env,
  LaborNearbyResponse,
  LaborRequest,
  LaborRequestResponse,
  ApiResponse,
} from '../types/index.js';

// ─── In-memory store (replace with D1 when ready) ────────────────────────────
// To use D1 instead, add env.DB.prepare(...) calls below where noted.
const LABOR_REQUESTS: Array<LaborRequest & { id: string; submittedAt: string }> = [];

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

// ─── GET /api/labor/nearby ────────────────────────────────────────────────────

export async function handleLaborNearby(
  request: IRequest,
  _env: Env
): Promise<Response> {
  const url = new URL(request.url);

  const latStr = url.searchParams.get('lat');
  const lngStr = url.searchParams.get('lng');
  const radiusStr = url.searchParams.get('radius') ?? '5';
  const skill = url.searchParams.get('skill');

  if (!latStr || !lngStr) {
    return errorResponse(
      'Missing required query parameters: lat, lng',
      'MISSING_PARAMS',
      400
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  const radius = parseFloat(radiusStr);

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return errorResponse(
      'lat and lng must be valid numbers within geographic range (-90..90, -180..180)',
      'INVALID_PARAMS',
      400
    );
  }
  if (isNaN(radius) || radius <= 0 || radius > 50) {
    return errorResponse(
      'radius must be a positive number up to 50 km',
      'INVALID_PARAMS',
      400
    );
  }

  const workers = DEMO_LABOR_WORKERS
    .map((w) => ({
      ...w,
      distanceKm: haversineKm(lat, lng, w.latitude, w.longitude),
    }))
    .filter((w) => {
      if (w.distanceKm > radius) return false;
      if (skill && !w.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))) {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const response: ApiResponse<LaborNearbyResponse> = {
    success: true,
    data: {
      workers,
      totalFound: workers.length,
      radiusKm: radius,
      _demo: true,
    },
  };
  return jsonResponse(response);
}

// ─── POST /api/labor/request ──────────────────────────────────────────────────

export async function handleLaborRequest(
  request: IRequest,
  _env: Env
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 'INVALID_JSON', 400);
  }

  const req = body as Partial<LaborRequest>;

  // ── Validation ────────────────────────────────────────────────────────────
  const missing: string[] = [];
  if (!req.farmerName?.trim()) missing.push('farmerName');
  if (!req.farmerPhone?.trim()) missing.push('farmerPhone');
  if (!req.location?.trim()) missing.push('location');
  if (!req.skill?.trim()) missing.push('skill');
  if (!req.startDate?.trim()) missing.push('startDate');
  if (!req.durationDays || req.durationDays <= 0) missing.push('durationDays (positive integer)');

  if (missing.length > 0) {
    return errorResponse(
      `Missing required fields: ${missing.join(', ')}`,
      'MISSING_FIELDS',
      400
    );
  }

  if (req.farmerName && req.farmerName.length > 100) {
    return errorResponse('farmerName cannot exceed 100 characters', 'PARAM_TOO_LONG', 400);
  }
  if (req.farmerPhone && req.farmerPhone.length > 25) {
    return errorResponse('farmerPhone cannot exceed 25 characters', 'PARAM_TOO_LONG', 400);
  }
  if (req.location && req.location.length > 150) {
    return errorResponse('location cannot exceed 150 characters', 'PARAM_TOO_LONG', 400);
  }
  if (req.skill && req.skill.length > 100) {
    return errorResponse('skill cannot exceed 100 characters', 'PARAM_TOO_LONG', 400);
  }
  if (req.durationDays && req.durationDays > 90) {
    return errorResponse('durationDays cannot exceed 90 days per request', 'INVALID_RANGE', 400);
  }

  // Validate date format
  if (isNaN(Date.parse(req.startDate!))) {
    return errorResponse(
      'startDate must be a valid ISO 8601 date (e.g. 2026-10-15)',
      'INVALID_DATE',
      400
    );
  }

  // ── Save to in-memory store ───────────────────────────────────────────────
  // D1 UPGRADE HOOK: replace the lines below with:
  //   await env.DB.prepare(
  //     'INSERT INTO labor_requests (id, farmer_name, farmer_phone, ...) VALUES (?, ?, ?, ...)'
  //   ).bind(requestId, ...).run();
  const requestId = `LR-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const submittedAt = new Date().toISOString();

  LABOR_REQUESTS.push({
    ...(req as LaborRequest),
    id: requestId,
    submittedAt,
  });

  const responseData: LaborRequestResponse = {
    requestId,
    status: 'pending',
    message:
      'Your labor request has been received. Available workers in your area will be notified.',
    submittedAt,
  };

  const response: ApiResponse<LaborRequestResponse> = {
    success: true,
    data: responseData,
  };
  return jsonResponse(response, 201);
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
