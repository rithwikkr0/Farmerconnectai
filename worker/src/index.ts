/**
 * Bhoomi Mithra — Cloudflare Worker Entry Point
 *
 * Itty-router based router that delegates to modular route handlers:
 * - /api/health
 * - /api/auth/register, /api/auth/login, /api/auth/logout, /api/auth/me, /api/auth/profile
 * - /api/ai
 * - /api/weather, /api/weather/advice
 * - /api/crops/recommend
 * - /api/farmers/match
 * - /api/labor/nearby, /api/labor/request
 * - /api/marketplace
 * - /api/services
 */

import { Router, json, error } from 'itty-router';
import type { Env } from './types/index.js';
import { handleAI } from './routes/ai.js';
import { handleGetWeather, handleWeatherAdvice } from './routes/weather.js';
import { handleCropRecommend } from './routes/crops.js';
import { handleFarmerMatch } from './routes/farmers.js';
import { handleLaborNearby, handleLaborRequest } from './routes/labor.js';
import { handleMarketplace } from './routes/marketplace.js';
import { handleServices } from './routes/services.js';
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGetMe,
  handleUpdateProfile,
} from './routes/auth.js';

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();

// Health check
router.get('/api/health', () =>
  json({
    success: true,
    data: {
      status: 'ok',
      service: 'Bhoomi Mithra AI Worker',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
  })
);

// Auth & Farmer Profile
router.post('/api/auth/register', handleRegister);
router.post('/api/auth/login', handleLogin);
router.post('/api/auth/logout', handleLogout);
router.get('/api/auth/me', handleGetMe);
router.put('/api/auth/profile', handleUpdateProfile);

// ─── Rate Limiting Helper ───────────────────────────────────────────────────

const IP_RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(request: Request, maxPerMin = 40): boolean {
  const ip = request.headers.get('cf-connecting-ip') || 'client';
  const now = Date.now();
  const entry = IP_RATE_LIMIT.get(ip);
  if (!entry || now > entry.resetAt) {
    IP_RATE_LIMIT.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= maxPerMin) {
    return false;
  }
  entry.count++;
  return true;
}

const withRateLimit = (handler: (req: any, env: any) => Promise<Response>) => {
  return async (req: any, env: any) => {
    if (!checkRateLimit(req as unknown as Request)) {
      return json(
        {
          success: false,
          error: 'AI is temporarily busy. Please try again in a moment.',
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }
    return handler(req, env);
  };
};

// AI — general purpose (rate limited)
router.post('/api/ai', withRateLimit(handleAI));

// Weather
router.get('/api/weather', handleGetWeather);
router.post('/api/weather/advice', withRateLimit(handleWeatherAdvice));

// Crops (rate limited)
router.post('/api/crops/recommend', withRateLimit(handleCropRecommend));

// Farmer matching
router.post('/api/farmers/match', handleFarmerMatch);

// Labor
router.get('/api/labor/nearby', handleLaborNearby);
router.post('/api/labor/request', handleLaborRequest);

// Marketplace
router.get('/api/marketplace', handleMarketplace);

// Agricultural Services
router.get('/api/services', handleServices);

// 404 fallback
router.all('*', () =>
  json(
    {
      success: false,
      error: 'Route not found',
      code: 'NOT_FOUND',
    },
    { status: 404 }
  )
);

// ─── CORS helper ──────────────────────────────────────────────────────────────

function corsHeaders(requestOrigin: string | null): Record<string, string> {
  const origin = requestOrigin || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

// ─── Worker export ────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestOrigin = request.headers.get('Origin');
    const cors = corsHeaders(requestOrigin);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Route the request
    let response: Response;
    try {
      response = await router.fetch(request, env);
    } catch (err) {
      console.error('[Worker] Unhandled error:', err);
      response = error(500, {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }

    // Attach CORS headers to every response
    const newHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(cors)) {
      newHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
} satisfies ExportedHandler<Env>;
