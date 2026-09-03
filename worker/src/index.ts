/**
 * FarmConnect AI — Cloudflare Worker Entry Point
 *
 * All incoming requests are routed here. CORS headers are added to every
 * response so the React frontend (localhost:3000) can call the worker.
 *
 * To add a new route:
 *  1. Create a handler in src/routes/
 *  2. Import it below and register it with router.get/post()
 */

import { Router, error, json } from 'itty-router';
import type { Env } from './types/index.js';

import { handleAI } from './routes/ai.js';
import { handleGetWeather, handleWeatherAdvice } from './routes/weather.js';
import { handleCropRecommend } from './routes/crops.js';
import { handleFarmerMatch } from './routes/farmers.js';
import { handleLaborNearby, handleLaborRequest } from './routes/labor.js';
import { handleMarketplace } from './routes/marketplace.js';

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();

// Health check
router.get('/api/health', () =>
  json({
    success: true,
    data: {
      status: 'ok',
      service: 'FarmConnect AI Worker',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
  })
);

// AI — general purpose
router.post('/api/ai', handleAI);

// Weather
router.get('/api/weather', handleGetWeather);
router.post('/api/weather/advice', handleWeatherAdvice);

// Crops
router.post('/api/crops/recommend', handleCropRecommend);

// Farmer matching
router.post('/api/farmers/match', handleFarmerMatch);

// Labor
router.get('/api/labor/nearby', handleLaborNearby);
router.post('/api/labor/request', handleLaborRequest);

// Marketplace
router.get('/api/marketplace', handleMarketplace);

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

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// ─── Worker export ────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowedOrigin = env.ALLOWED_ORIGIN ?? '*';
    const cors = corsHeaders(allowedOrigin);

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
