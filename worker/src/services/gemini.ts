/**
 * Bhoomi Mithra — Centralized Gemini Service (Presentation Polish & Cost Control)
 *
 * Directives:
 * - 1 User Action = 1 Gemini Request (No multi-model cascade loops)
 * - Model: gemini-3.5-flash (lightweight, verified working)
 * - Strict token control: Concise prompts, max 400-600 output tokens
 * - In-memory LRU/TTL Cache: Identical queries return cached responses
 * - Rate limit & 429 protection: Friendly messages, no unhandled exceptions
 * - No mindless echoing of crop names; genuine reasoning from soil, water & location
 */

import { GoogleGenAI } from '@google/genai';
import type {
  AITask,
  AIResponse,
  AISection,
  WeatherData,
  WeatherAdviceResponse,
  FarmerProfile,
  FarmerMatchRequest,
  FarmerMatch,
  CropRecommendationRequest,
  CropRecommendationResponse,
} from '../types/index.js';

// ─── Single Primary Model (Lightweight, verified working) ───────────────────

const PRIMARY_MODEL = 'gemini-3.5-flash-lite';

// ─── In-Memory Response Cache (5-Minute TTL) ────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const RESPONSE_CACHE = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = RESPONSE_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    RESPONSE_CACHE.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T): void {
  // Simple size eviction if cache exceeds 200 items
  if (RESPONSE_CACHE.size > 200) {
    const firstKey = RESPONSE_CACHE.keys().next().value;
    if (firstKey) RESPONSE_CACHE.delete(firstKey);
  }
  RESPONSE_CACHE.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ─── Safety wording & uncertainty-aware disclaimers ─────────────────────────

const TASK_SAFETY_NOTES: Record<AITask, string> = {
  crop_diagnosis:
    'Diagnostic Advisory: AI pattern support only, not a laboratory test. Consult your local KVK or extension officer before applying regulated treatments.',
  fertilizer_advice:
    'Nutrient Advisory: General agronomic guidelines. Soil testing (Soil Health Card) is recommended for precise dosage.',
  livestock_advice:
    'Veterinary Advisory: Preventive herd guidance only. Contact a registered veterinarian for clinical illness or prescription medication.',
  profit_analysis:
    'Economic Advisory: Estimated projection based on regional averages. Actual realizations depend on APMC mandi arrivals and grading.',
  crop_recommendation:
    'Agronomic Advisory: Suitability scoring reflects regional agro-climatic averages. Verify seed varieties with local extension officers.',
  weather_action:
    'Weather Advisory: Field guidance based on live Open-Meteo telemetry. Confirm high-stakes operations with district IMD bulletins.',
  farm_plan:
    'Planning Advisory: Seasonal schedule for guidance. Adjust operations based on local rainfall and soil moisture.',
};

// ─── Minimal, Focused Prompt Builders ────────────────────────────────────────

function buildAIPrompt(task: AITask, context: Record<string, unknown>): string {
  // Strip unnecessary fat; only keep concise agronomic parameters
  const compactContext = {
    location: context.location || context.district || 'Anekal, Bengaluru Urban, Karnataka',
    soil: context.soilType || context.soil || 'Red sandy loam',
    water: context.waterAvailability || 'moderate',
    landAcres: context.landSizeAcres || context.landSize || 3.5,
    crop: context.primaryCrop || context.crop || 'Tomato',
    season: context.season || 'Kharif',
    goal: context.goal || 'profit',
    notes: context.additionalNotes || context.problem || context.question || undefined,
  };

  const instructions: Record<AITask, string> = {
    crop_recommendation: `You are an expert Indian agricultural advisor.
Recommend 2-3 suitable alternative or companion crops based on the soil, water, and season.
Do NOT just echo the current crop. Reason from soil type and water availability.
Return JSON:
{
  "recommendation": "1-2 sentence core recommendation",
  "sections": [
    { "title": "Recommended Crop", "content": "Why it suits this soil/water", "priority": "high" },
    { "title": "Field Action", "content": "Immediate step to take", "priority": "medium" }
  ]
}`,

    weather_action: `You are an agricultural weather advisor.
Given the current weather and crop, provide practical field protection advice.
Return JSON:
{
  "recommendation": "1-2 sentence weather advisory",
  "sections": [
    { "title": "Field Risk", "content": "Top meteorological risk", "priority": "high" },
    { "title": "Recommended Action", "content": "Concrete drainage or spray timing step", "priority": "high" }
  ]
}`,

    crop_diagnosis: `You are a plant pathologist.
Diagnose the symptom and recommend practical non-hazardous field measures.
Return JSON:
{
  "recommendation": "Probable issue and immediate management step",
  "sections": [
    { "title": "Likely Issue", "content": "Probable diagnosis based on symptoms", "priority": "high" },
    { "title": "Field Action", "content": "Immediate cultural or bio-control step", "priority": "high" }
  ]
}`,

    fertilizer_advice: `You are an agronomic nutrient specialist.
Recommend balanced NPK/organic inputs for this crop and soil type.
Return JSON:
{
  "recommendation": "Nutrient summary",
  "sections": [
    { "title": "Primary Nutrients", "content": "Recommended basal/foliar nutrition", "priority": "high" },
    { "title": "Application Timing", "content": "When and how to apply", "priority": "medium" }
  ]
}`,

    livestock_advice: `You are a rural livestock & dairy advisor.
Provide practical herd health, feed, or housing guidance.
Return JSON:
{
  "recommendation": "Short management advisory",
  "sections": [
    { "title": "Immediate Care", "content": "Feed or shelter step", "priority": "high" },
    { "title": "Veterinary Check", "content": "When to call the veterinary officer", "priority": "medium" }
  ]
}`,

    farm_plan: `You are an operational farm planner.
Provide a concise 2-step timeline for this crop and season.
Return JSON:
{
  "recommendation": "Operational summary",
  "sections": [
    { "title": "Immediate Priority", "content": "Action for this week", "priority": "high" },
    { "title": "Next Milestone", "content": "Key upcoming operational milestone", "priority": "medium" }
  ]
}`,

    profit_analysis: `You are an agricultural economist.
Provide concise margin and cost guidance based on farm size and crop.
Return JSON:
{
  "recommendation": "Economic outlook summary",
  "sections": [
    { "title": "Cost Efficiency", "content": "Where to reduce operational expense", "priority": "high" },
    { "title": "Market Realization", "content": "Mandi harvest timing tip", "priority": "medium" }
  ]
}`,
  };

  return `${instructions[task]}

Context:
${JSON.stringify(compactContext)}

Respond ONLY with valid JSON. No markdown, no fences.`;
}

// ─── GeminiService ────────────────────────────────────────────────────────────

export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Single-shot executor: Exactly 1 request per user action.
   */
  private async execute(prompt: string, maxOutputTokens = 600): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          maxOutputTokens,
        },
      });

      if (!response.text || response.text.trim().length === 0) {
        throw new Error('Empty response from AI model');
      }

      return response.text;
    } catch (err: any) {
      if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')) {
        throw new Error('AI is temporarily busy. Please try again in a moment.');
      }
      throw err;
    }
  }

  /**
   * Handles all 7 AI task types for POST /api/ai with in-memory caching
   */
  async generateAIResponse(
    task: AITask,
    context: Record<string, unknown>
  ): Promise<AIResponse> {
    const cacheKey = `ai:${task}:${JSON.stringify({
      loc: context.location,
      soil: context.soilType || context.soil,
      crop: context.primaryCrop || context.crop,
      water: context.waterAvailability,
      notes: context.additionalNotes || context.problem || context.question,
    })}`;

    const cached = getCached<AIResponse>(cacheKey);
    if (cached) return cached;

    const prompt = buildAIPrompt(task, context);

    try {
      const text = await this.execute(prompt, 600);

      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) cleanText = cleanText.slice(7);
      else if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
      if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);
      cleanText = cleanText.trim();

      let parsed: { recommendation?: string; sections?: AISection[] } = {};
      try {
        parsed = JSON.parse(cleanText) as typeof parsed;
        if (typeof parsed.recommendation === 'string' && parsed.recommendation.trim().startsWith('{')) {
          try {
            const inner = JSON.parse(parsed.recommendation);
            if (inner.recommendation) parsed.recommendation = inner.recommendation;
            if (inner.sections && Array.isArray(inner.sections)) parsed.sections = inner.sections;
          } catch {}
        }
      } catch {
        parsed = { recommendation: cleanText };
      }

      const result: AIResponse = {
        task,
        recommendation:
          parsed.recommendation ??
          `Advisory generated for ${String(context.primaryCrop || context.crop || 'your crop')} in ${String(context.location || 'your region')}.`,
        sections: parsed.sections ?? [
          {
            title: 'Agronomic Guidance',
            content:
              'Maintain standard field operations aligned with your regional agro-climatic zone.',
            priority: 'medium',
          },
        ],
        safetyNote: TASK_SAFETY_NOTES[task],
      };

      setCached(cacheKey, result);
      return result;
    } catch (err: any) {
      console.error('[GeminiService] AI error:', err?.message);
      throw err;
    }
  }

  /**
   * Structured weather advice combining live Open-Meteo telemetry + Gemini
   */
  async generateWeatherAdvice(
    weather: WeatherData,
    request: { crop?: string; growthStage?: string; additionalContext?: string }
  ): Promise<WeatherAdviceResponse> {
    const cacheKey = `weather:${weather.location}:${weather.current.temperature_c}:${request.crop}`;
    const cached = getCached<WeatherAdviceResponse>(cacheKey);
    if (cached) return cached;

    const prompt = `You are an expert agricultural meteorologist.
Given current weather and crop, return actionable field advice.

Current weather at ${weather.location}:
- Temp: ${weather.current.temperature_c}°C, Condition: ${weather.current.condition}, Rain: ${weather.current.rainfall_mm}mm, Humidity: ${weather.current.humidity_pct}%
Farmer crop: ${request.crop || 'Field crop'} (${request.growthStage || 'Vegetative'})

Return JSON:
{
  "advice": "1-2 sentence overall advisory",
  "risks": ["Top risk 1", "Top risk 2"],
  "preventiveActions": ["Field action 1", "Field action 2"]
}
Respond ONLY with valid JSON. No markdown.`;

    try {
      const text = await this.execute(prompt, 500);

      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) cleanText = cleanText.slice(7);
      else if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
      if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);
      cleanText = cleanText.trim();

      let parsed: {
        advice?: string;
        risks?: string[];
        preventiveActions?: string[];
      } = {};

      try {
        parsed = JSON.parse(cleanText) as typeof parsed;
      } catch {
        parsed = { advice: cleanText };
      }

      const result: WeatherAdviceResponse = {
        location: weather.location,
        weather,
        advice: parsed.advice ?? `Conditions at ${weather.location}: ${weather.current.condition}, ${weather.current.temperature_c}°C.`,
        risks: parsed.risks ?? ['Humidity fluctuations', 'Moisture stress'],
        preventiveActions: parsed.preventiveActions ?? ['Check field bunds', 'Clear drainage furrows'],
      };

      setCached(cacheKey, result);
      return result;
    } catch (err: any) {
      console.error('[GeminiService] Weather advice error:', err?.message);
      throw err;
    }
  }

  /**
   * Deterministic matching + Gemini ranking/explanation
   */
  async rankFarmerMatches(
    candidates: FarmerProfile[],
    request: FarmerMatchRequest
  ): Promise<Array<{ id: string; score: number; explanation: string }>> {
    if (candidates.length === 0) return [];

    const candidateSummaries = candidates.slice(0, 5).map((f) => ({
      id: f.id,
      name: f.name,
      location: f.location,
      crops: f.crops,
      problems: f.problems,
    }));

    const prompt = `Rank these farmers based on relevance to requester looking for help with crop "${request.crop || 'any'}" and problem "${request.problem || 'any'}".
Candidates:
${JSON.stringify(candidateSummaries)}

Return JSON array:
[
  { "id": "id string", "score": 85, "explanation": "1-sentence reason" }
]
Sort descending by score. Respond ONLY with valid JSON.`;

    try {
      const text = await this.execute(prompt, 400);
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(clean) as Array<{ id: string; score: number; explanation: string }>;
    } catch {
      return candidates.slice(0, 4).map((f) => ({
        id: f.id,
        score: 80,
        explanation: `Experienced with ${f.crops.join(', ')} in the regional agro-climate.`,
      }));
    }
  }

  /**
   * Structured crop recommendations (Max 3 crops, concise reasons, no fake prices)
   */
  async generateCropRecommendations(
    request: CropRecommendationRequest
  ): Promise<CropRecommendationResponse> {
    const cacheKey = `crop:${request.location}:${request.season}:${request.soil}:${request.waterAvailability}:${request.farmerGoal}`;
    const cached = getCached<CropRecommendationResponse>(cacheKey);
    if (cached) return cached;

    const prompt = `You are an expert Indian agricultural scientist.
Given the farmer's soil, water, and season, recommend up to 3 suitable crops.
Do NOT just repeat their current crop. Reason from soil type and water availability.
Do NOT fabricate specific prices or claim guaranteed MSP.

Farmer Context:
- Location: ${request.location}
- Soil: ${request.soil}
- Water: ${request.waterAvailability}
- Land: ${request.landSize} acres
- Season: ${request.season}
- Goal: ${request.farmerGoal}

Return JSON:
{
  "recommendations": [
    {
      "cropName": "Crop Name",
      "suitabilityScore": 90,
      "suitabilityLabel": "excellent",
      "reasons": ["Reason 1", "Reason 2"],
      "waterRequirement": "low" | "moderate" | "high",
      "majorRisks": ["Risk 1", "Risk 2"],
      "suggestedActions": ["Action 1", "Action 2"],
      "estimatedYield": "Estimated range (e.g. 12-15 quintals/acre)",
      "estimatedProfit": "Estimated margin range (e.g. Moderate to High)"
    }
  ],
  "generalAdvice": "1-2 sentence overall guidance",
  "safetyNote": "Confirm seed varieties with your local Krishi Vigyan Kendra (KVK)."
}
Respond ONLY with valid JSON. No markdown.`;

    try {
      const text = await this.execute(prompt, 600);

      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) cleanText = cleanText.slice(7);
      else if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
      if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);
      cleanText = cleanText.trim();

      const parsed = JSON.parse(cleanText) as CropRecommendationResponse;
      const result: CropRecommendationResponse = {
        location: request.location,
        season: request.season,
        recommendations: (parsed.recommendations || []).slice(0, 3),
        generalAdvice: parsed.generalAdvice ?? 'Consult local agricultural extension officer before planting.',
        safetyNote:
          parsed.safetyNote ??
          'Verify recommendations with your local Krishi Vigyan Kendra (KVK) or agricultural extension officer.',
      };

      setCached(cacheKey, result);
      return result;
    } catch (err: any) {
      console.error('[GeminiService] Crop recommendations error:', err?.message);
      throw err;
    }
  }
}
