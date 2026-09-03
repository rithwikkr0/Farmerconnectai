/**
 * GET  /api/weather?location=Chennai
 * POST /api/weather/advice
 *
 * GET  returns structured demo weather data (Open-Meteo shape).
 *      Swap in a real API call by replacing getDemoWeather() with a fetch().
 *
 * POST combines weather with farmer context and calls Gemini for
 *      crop-specific preventive recommendations.
 */

import type { IRequest } from 'itty-router';
import { GeminiService } from '../services/gemini.js';
import type {
  Env,
  WeatherData,
  WeatherAdviceRequest,
  WeatherAdviceResponse,
  ApiResponse,
} from '../types/index.js';

// ─── Demo weather generator ───────────────────────────────────────────────────
// Structure matches Open-Meteo / WeatherAPI shape so the frontend can render
// the same component whether demo or live data is returned.

function getDemoWeather(location: string): WeatherData {
  const today = new Date();

  const forecast = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    return {
      date: d.toISOString().slice(0, 10),
      max_temp_c: 28 + Math.round(Math.random() * 6),
      min_temp_c: 22 + Math.round(Math.random() * 4),
      rainfall_mm: parseFloat((Math.random() * 12).toFixed(1)),
      condition: ['Partly Cloudy', 'Sunny', 'Light Rain', 'Overcast', 'Thunderstorm'][i % 5] ?? 'Sunny',
      humidity_pct: 65 + Math.round(Math.random() * 20),
    };
  });

  return {
    _demo: true,
    location,
    current: {
      temperature_c: 31,
      humidity_pct: 72,
      wind_kph: 14,
      condition: 'Partly Cloudy',
      uv_index: 8,
      rainfall_mm: 2.4,
    },
    forecast,
    fetched_at: new Date().toISOString(),
  };
}

// ─── GET /api/weather ─────────────────────────────────────────────────────────

export async function handleGetWeather(
  request: IRequest,
  _env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const location = url.searchParams.get('location');

  if (!location || location.trim() === '') {
    return errorResponse(
      'Missing query parameter: location',
      'MISSING_PARAM',
      400
    );
  }

  const weather = getDemoWeather(location.trim());
  const response: ApiResponse<WeatherData> = { success: true, data: weather };
  return jsonResponse(response);
}

// ─── POST /api/weather/advice ─────────────────────────────────────────────────

export async function handleWeatherAdvice(
  request: IRequest,
  env: Env
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 'INVALID_JSON', 400);
  }

  const req = body as Partial<WeatherAdviceRequest>;

  if (!req.location || req.location.trim() === '') {
    return errorResponse(
      'Missing required field: location',
      'MISSING_FIELD',
      400
    );
  }

  const weather = getDemoWeather(req.location.trim());

  try {
    const gemini = new GeminiService(env.GEMINI_API_KEY);
    const adviceOptions: { crop?: string; growthStage?: string; additionalContext?: string } = {};
    if (req.crop) adviceOptions.crop = req.crop;
    if (req.growthStage) adviceOptions.growthStage = req.growthStage;
    if (req.additionalContext) adviceOptions.additionalContext = req.additionalContext;

    const adviceResult = await gemini.generateWeatherAdvice(weather, adviceOptions);

    const responseData: WeatherAdviceResponse = {
      location: req.location.trim(),
      weather,
      ...adviceResult,
    };

    const response: ApiResponse<WeatherAdviceResponse> = {
      success: true,
      data: responseData,
    };
    return jsonResponse(response);
  } catch (err) {
    console.error('[/api/weather/advice] Gemini error:', err);
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
