/**
 * GET  /api/labor/nearby?lat=&lng=&radius=5&skill=harvesting
 * POST /api/labor/request
 *
 * GET  filters workers by Haversine distance from D1 or calibrated demo store.
 * POST persists labor requests to Cloudflare D1 with fallback to in-memory store.
 */

import type { IRequest } from 'itty-router';
import { DEMO_LABOR_WORKERS } from '../data/labor.demo.js';
import type {
  Env,
  LaborNearbyResponse,
  LaborRequest,
  LaborRequestResponse,
  ApiResponse,
  LaborWorker,
} from '../types/index.js';

// ─── In-memory fallback store ────────────────────────────────────────────────
const LABOR_REQUESTS: Array<LaborRequest & { id: string; submittedAt: string }> = [];

// ─── D1 Data Loader with Demo Fallback ────────────────────────────────────────

async function loadLaborWorkers(
  env: Env
): Promise<{ workers: LaborWorker[]; isDemo: boolean; source: string }> {
  if (env.DB) {
    try {
      const { results } = await env.DB.prepare(
        'SELECT * FROM labor_workers WHERE status = ? LIMIT 50'
      )
        .bind('available')
        .all();

      if (results && results.length > 0) {
        const parsed: LaborWorker[] = results.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name),
          location: String(r.location),
          latitude: Number(r.latitude),
          longitude: Number(r.longitude),
          skills: typeof r.skills === 'string' ? JSON.parse(r.skills) : (r.skills as string[]) || [],
          dailyRate_inr: Number(r.daily_rate_inr || 600),
          availability: 'available',
          experience_years: Number(r.jobs_completed ? Math.floor(Number(r.jobs_completed) / 10) : 5),
          phone_masked: String(r.phone_masked),
          languages: ['Kannada', 'Tamil', 'English'],
          _demo: false,
        }));
        return {
          workers: parsed,
          isDemo: false,
          source: 'Cloudflare D1 Production Database',
        };
      }
    } catch (err) {
      console.warn('[Labor] D1 query failed, using calibrated demo registry:', err);
    }
  }

  return {
    workers: DEMO_LABOR_WORKERS,
    isDemo: true,
    source: 'Bhoomi Mithra Demo Labor Crew Registry',
  };
}

// ─── Haversine distance (km) ──────────────────────────────────────────────────

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
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
  env: Env
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

  const { workers: loadedWorkers, isDemo, source } = await loadLaborWorkers(env);

  const workers = loadedWorkers
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
      _demo: isDemo,
      source,
    },
  };
  return jsonResponse(response);
}

// ─── POST /api/labor/request ──────────────────────────────────────────────────

export async function handleLaborRequest(
  request: IRequest,
  env: Env
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

  const requestId = `LR-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const submittedAt = new Date().toISOString();

  let storageSource = 'In-Memory Store';

  // Persist to Cloudflare D1 if configured
  if (env.DB) {
    try {
      await env.DB.prepare(
        'INSERT INTO labor_requests (id, farmer_name, farmer_phone, location, skill, worker_id, start_date, duration_days, status, notes, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
        .bind(
          requestId,
          req.farmerName!.trim(),
          req.farmerPhone!.trim(),
          req.location!.trim(),
          req.skill!.trim(),
          req.workerId ?? null,
          req.startDate!.trim(),
          req.durationDays,
          'pending',
          req.notes?.trim() ?? req.description?.trim() ?? null,
          submittedAt
        )
        .run();
      storageSource = 'Cloudflare D1 Production Database';
    } catch (err) {
      console.warn('[Labor] Failed to insert request into D1, falling back to memory store:', err);
      LABOR_REQUESTS.push({
        ...(req as LaborRequest),
        id: requestId,
        submittedAt,
      });
    }
  } else {
    LABOR_REQUESTS.push({
      ...(req as LaborRequest),
      id: requestId,
      submittedAt,
    });
  }

  const responseData: LaborRequestResponse = {
    requestId,
    status: 'pending',
    message:
      'Your labor request has been received. Available workers in your area will be notified.',
    submittedAt,
    _demo: false,
    source: storageSource,
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
