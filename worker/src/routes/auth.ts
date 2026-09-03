/**
 * Bhoomi Mithra — Authentication & Farmer Profile Routes
 *
 * Implements:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET  /api/auth/me
 * - PUT  /api/auth/profile
 *
 * Uses Cloudflare D1 tables: `users`, `sessions`, `farm_profiles`.
 */

import type { IRequest } from 'itty-router';
import { hashPassword, verifyPassword, generateSessionToken } from '../utils/auth-crypto.js';
import type { Env, ApiResponse } from '../types/index.js';

export interface UserRecord {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  created_at: string;
  status: string;
}

export interface FarmProfileRecord {
  id: string;
  user_id: string;
  village?: string | null;
  district?: string | null;
  state?: string | null;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  land_size_acres: number;
  soil_type: string;
  water_availability: string;
  current_crop: string;
  season: string;
  farming_goal: string;
  livestock?: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Session extraction helper ────────────────────────────────────────────────

export function extractSessionToken(request: Request): string | null {
  // 1. Check Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  // 2. Check Cookie header
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/bhoomi_session=([^;]+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

export async function getAuthenticatedUser(
  request: Request,
  env: Env
): Promise<{ user: UserRecord; profile: FarmProfileRecord | null } | null> {
  if (!env.DB) return null;

  const token = extractSessionToken(request);
  if (!token) return null;

  try {
    const nowIso = new Date().toISOString();
    const sessionRes = await env.DB.prepare(
      'SELECT * FROM sessions WHERE id = ? AND expires_at > ?'
    )
      .bind(token, nowIso)
      .first<{ id: string; user_id: string; expires_at: string }>();

    if (!sessionRes) return null;

    const userRes = await env.DB.prepare(
      'SELECT id, full_name, email, mobile, created_at, status FROM users WHERE id = ?'
    )
      .bind(sessionRes.user_id)
      .first<UserRecord>();

    if (!userRes) return null;

    const profileRes = await env.DB.prepare(
      'SELECT * FROM farm_profiles WHERE user_id = ?'
    )
      .bind(userRes.id)
      .first<FarmProfileRecord>();

    return { user: userRes, profile: profileRes || null };
  } catch (err) {
    console.error('[Auth] getAuthenticatedUser error:', err);
    return null;
  }
}

// ─── Cookie Header Helper ────────────────────────────────────────────────────

function makeSessionCookie(token: string, maxAgeSeconds = 604800): string {
  return `bhoomi_session=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${maxAgeSeconds}`;
}

function clearSessionCookie(): string {
  return 'bhoomi_session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0';
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

export async function handleRegister(
  request: IRequest,
  env: Env
): Promise<Response> {
  if (!env.DB) {
    return errorResponse('Database service not configured', 'DB_UNAVAILABLE', 503);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON payload', 'INVALID_JSON', 400);
  }

  const {
    fullName,
    email,
    mobile,
    password,
    village,
    district,
    state,
    location,
    latitude,
    longitude,
    landSize,
    landSizeAcres,
    soilType,
    waterAvailability,
    currentCrop,
    season,
    farmingGoal,
    livestock,
  } = body;

  if (!fullName || !email || !mobile || !password) {
    return errorResponse(
      'Missing required user fields: fullName, email, mobile, password',
      'MISSING_FIELDS',
      400
    );
  }

  const cleanEmail = String(email).trim().toLowerCase();
  if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return errorResponse('Invalid email address format', 'INVALID_EMAIL', 400);
  }

  if (String(password).length < 6) {
    return errorResponse('Password must be at least 6 characters', 'WEAK_PASSWORD', 400);
  }

  // Check duplicate user
  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(cleanEmail)
    .first();

  if (existing) {
    return errorResponse('A farmer account with this email already exists', 'EMAIL_EXISTS', 409);
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const passwordHash = await hashPassword(String(password));
  const createdAt = new Date().toISOString();

  // Insert user
  await env.DB.prepare(
    'INSERT INTO users (id, full_name, email, mobile, password_hash, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(userId, String(fullName).trim(), cleanEmail, String(mobile).trim(), passwordHash, createdAt, 'active')
    .run();

  // Insert farm profile
  const profileId = `fp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const parsedLand = parseFloat(String(landSizeAcres ?? landSize ?? '2.5')) || 2.5;

  const farmLocation = location?.trim() || [village, district, state].filter(Boolean).join(', ') || 'Mandya, Karnataka';

  await env.DB.prepare(
    `INSERT INTO farm_profiles (
      id, user_id, village, district, state, location, latitude, longitude,
      land_size_acres, soil_type, water_availability, current_crop, season, farming_goal, livestock, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      profileId,
      userId,
      village?.trim() || null,
      district?.trim() || null,
      state?.trim() || null,
      farmLocation,
      latitude != null ? Number(latitude) : null,
      longitude != null ? Number(longitude) : null,
      parsedLand,
      soilType?.trim() || 'Red sandy loam',
      waterAvailability?.trim() || 'moderate',
      currentCrop?.trim() || 'Finger Millet (Ragi)',
      season?.trim() || 'Kharif',
      farmingGoal?.trim() || 'profit',
      livestock?.trim() || null,
      createdAt,
      createdAt
    )
    .run();

  // Create session
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare('INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .bind(sessionToken, userId, expiresAt, createdAt)
    .run();

  const user: UserRecord = {
    id: userId,
    full_name: String(fullName).trim(),
    email: cleanEmail,
    mobile: String(mobile).trim(),
    created_at: createdAt,
    status: 'active',
  };

  const farmProfile: FarmProfileRecord = {
    id: profileId,
    user_id: userId,
    village: village?.trim() || null,
    district: district?.trim() || null,
    state: state?.trim() || null,
    location: farmLocation,
    latitude: latitude != null ? Number(latitude) : null,
    longitude: longitude != null ? Number(longitude) : null,
    land_size_acres: parsedLand,
    soil_type: soilType?.trim() || 'Red sandy loam',
    water_availability: waterAvailability?.trim() || 'moderate',
    current_crop: currentCrop?.trim() || 'Finger Millet (Ragi)',
    season: season?.trim() || 'Kharif',
    farming_goal: farmingGoal?.trim() || 'profit',
    livestock: livestock?.trim() || null,
    created_at: createdAt,
    updated_at: createdAt,
  };

  return jsonResponse(
    {
      success: true,
      data: {
        sessionToken,
        user,
        farmProfile,
      },
    },
    201,
    { 'Set-Cookie': makeSessionCookie(sessionToken) }
  );
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

export async function handleLogin(
  request: IRequest,
  env: Env
): Promise<Response> {
  if (!env.DB) {
    return errorResponse('Database service not configured', 'DB_UNAVAILABLE', 503);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON payload', 'INVALID_JSON', 400);
  }

  const { email, password } = body;
  if (!email || !password) {
    return errorResponse('Missing email or password', 'MISSING_FIELDS', 400);
  }

  const cleanEmail = String(email).trim().toLowerCase();

  const userRow = await env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  )
    .bind(cleanEmail)
    .first<UserRecord & { password_hash: string }>();

  if (!userRow) {
    return errorResponse('Invalid email or password', 'INVALID_CREDENTIALS', 401);
  }

  const isValid = await verifyPassword(String(password), userRow.password_hash);
  if (!isValid) {
    return errorResponse('Invalid email or password', 'INVALID_CREDENTIALS', 401);
  }

  // Create session
  const sessionToken = generateSessionToken();
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare('INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .bind(sessionToken, userRow.id, expiresAt, createdAt)
    .run();

  const profile = await env.DB.prepare('SELECT * FROM farm_profiles WHERE user_id = ?')
    .bind(userRow.id)
    .first<FarmProfileRecord>();

  const user: UserRecord = {
    id: userRow.id,
    full_name: userRow.full_name,
    email: userRow.email,
    mobile: userRow.mobile,
    created_at: userRow.created_at,
    status: userRow.status,
  };

  return jsonResponse(
    {
      success: true,
      data: {
        sessionToken,
        user,
        farmProfile: profile || null,
      },
    },
    200,
    { 'Set-Cookie': makeSessionCookie(sessionToken) }
  );
}

// ─── POST /api/auth/logout ────────────────────────────────────────────────────

export async function handleLogout(
  request: IRequest,
  env: Env
): Promise<Response> {
  const token = extractSessionToken(request as unknown as Request);
  if (token && env.DB) {
    try {
      await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run();
    } catch (err) {
      console.warn('[Auth] Error deleting session:', err);
    }
  }

  return jsonResponse(
    { success: true, data: { message: 'Logged out successfully' } },
    200,
    { 'Set-Cookie': clearSessionCookie() }
  );
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

export async function handleGetMe(
  request: IRequest,
  env: Env
): Promise<Response> {
  const auth = await getAuthenticatedUser(request as unknown as Request, env);
  if (!auth) {
    return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
  }

  return jsonResponse({
    success: true,
    data: {
      user: auth.user,
      farmProfile: auth.profile,
    },
  });
}

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────

export async function handleUpdateProfile(
  request: IRequest,
  env: Env
): Promise<Response> {
  const auth = await getAuthenticatedUser(request as unknown as Request, env);
  if (!auth || !env.DB) {
    return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON payload', 'INVALID_JSON', 400);
  }

  const {
    village,
    district,
    state,
    location,
    latitude,
    longitude,
    landSizeAcres,
    soilType,
    waterAvailability,
    currentCrop,
    season,
    farmingGoal,
    livestock,
  } = body;

  const updatedAt = new Date().toISOString();
  const farmLocation = location?.trim() || [village, district, state].filter(Boolean).join(', ') || auth.profile?.location || 'Mandya, Karnataka';
  const parsedLand = parseFloat(String(landSizeAcres)) || auth.profile?.land_size_acres || 2.5;

  if (auth.profile) {
    await env.DB.prepare(
      `UPDATE farm_profiles SET
        village = ?, district = ?, state = ?, location = ?, latitude = ?, longitude = ?,
        land_size_acres = ?, soil_type = ?, water_availability = ?, current_crop = ?,
        season = ?, farming_goal = ?, livestock = ?, updated_at = ?
       WHERE user_id = ?`
    )
      .bind(
        village?.trim() ?? auth.profile.village,
        district?.trim() ?? auth.profile.district,
        state?.trim() ?? auth.profile.state,
        farmLocation,
        latitude != null ? Number(latitude) : auth.profile.latitude,
        longitude != null ? Number(longitude) : auth.profile.longitude,
        parsedLand,
        soilType?.trim() ?? auth.profile.soil_type,
        waterAvailability?.trim() ?? auth.profile.water_availability,
        currentCrop?.trim() ?? auth.profile.current_crop,
        season?.trim() ?? auth.profile.season,
        farmingGoal?.trim() ?? auth.profile.farming_goal,
        livestock?.trim() ?? auth.profile.livestock,
        updatedAt,
        auth.user.id
      )
      .run();
  } else {
    const profileId = `fp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await env.DB.prepare(
      `INSERT INTO farm_profiles (
        id, user_id, village, district, state, location, latitude, longitude,
        land_size_acres, soil_type, water_availability, current_crop, season, farming_goal, livestock, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        profileId,
        auth.user.id,
        village?.trim() || null,
        district?.trim() || null,
        state?.trim() || null,
        farmLocation,
        latitude != null ? Number(latitude) : null,
        longitude != null ? Number(longitude) : null,
        parsedLand,
        soilType?.trim() || 'Red sandy loam',
        waterAvailability?.trim() || 'moderate',
        currentCrop?.trim() || 'Finger Millet (Ragi)',
        season?.trim() || 'Kharif',
        farmingGoal?.trim() || 'profit',
        livestock?.trim() || null,
        updatedAt,
        updatedAt
      )
      .run();
  }

  const updatedProfile = await env.DB.prepare('SELECT * FROM farm_profiles WHERE user_id = ?')
    .bind(auth.user.id)
    .first<FarmProfileRecord>();

  return jsonResponse({
    success: true,
    data: {
      user: auth.user,
      farmProfile: updatedProfile,
    },
  });
}

// ─── Response Helpers ────────────────────────────────────────────────────────

function jsonResponse(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

function errorResponse(error: string, code: string, status: number): Response {
  return jsonResponse({ success: false, error, code }, status);
}
