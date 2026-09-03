/**
 * POST /api/ai
 *
 * General-purpose AI endpoint. Accepts a task type and arbitrary context,
 * routes to the centralized Gemini service, and returns structured advice.
 */

import type { IRequest } from 'itty-router';
import { GeminiService } from '../services/gemini.js';
import type { Env, AIRequest, ApiResponse, AIResponse } from '../types/index.js';

const VALID_TASKS = new Set([
  'crop_recommendation',
  'weather_action',
  'crop_diagnosis',
  'fertilizer_advice',
  'livestock_advice',
  'farm_plan',
  'profit_analysis',
]);

export async function handleAI(
  request: IRequest,
  env: Env
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 'INVALID_JSON', 400);
  }

  const req = body as Partial<AIRequest>;

  // ── Validation ────────────────────────────────────────────────────────────
  if (!req.task) {
    return errorResponse('Missing required field: task', 'MISSING_FIELD', 400);
  }
  if (!VALID_TASKS.has(req.task)) {
    return errorResponse(
      `Invalid task. Must be one of: ${[...VALID_TASKS].join(', ')}`,
      'INVALID_TASK',
      400
    );
  }
  if (!req.context || typeof req.context !== 'object' || Array.isArray(req.context)) {
    return errorResponse(
      'Missing or invalid field: context (must be a key-value object)',
      'MISSING_FIELD',
      400
    );
  }

  if (JSON.stringify(req.context).length > 20000) {
    return errorResponse(
      'Context payload exceeds allowable size (max 20KB)',
      'PAYLOAD_TOO_LARGE',
      413
    );
  }

  // ── Gemini ────────────────────────────────────────────────────────────────
  try {
    const gemini = new GeminiService(env.GEMINI_API_KEY);
    const result = await gemini.generateAIResponse(req.task, req.context);

    const response: ApiResponse<AIResponse> = { success: true, data: result };
    return jsonResponse(response);
  } catch (err: any) {
    console.error('[/api/ai] Gemini error caught:', err);
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
