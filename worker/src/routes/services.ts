/**
 * GET /api/services?category=drone&location=Mandya
 *
 * Discovers regional agricultural machinery, drone, cold storage, and testing services.
 * Queries Cloudflare D1 table `agricultural_services` with fallback to calibrated demo providers.
 */

import type { IRequest } from 'itty-router';
import type {
  Env,
  AgriService,
  ServicesResponse,
  ApiResponse,
} from '../types/index.js';

import { ANEKAL_SERVICES } from '../data/services.demo.js';

const DEMO_SERVICES: AgriService[] = ANEKAL_SERVICES.map((s) => ({
  id: s.id,
  name: s.providerName,
  type: s.category.toLowerCase().includes('machinery') || s.category.toLowerCase().includes('tractor')
    ? 'machinery'
    : s.category.toLowerCase().includes('soil') || s.category.toLowerCase().includes('advisory')
    ? 'lab'
    : 'machinery',
  location: s.location,
  distance_km: 3.5,
  contact: s.phone || 'Public Listing',
  pricing: 'Standard Tariffs / On Request',
  description: s.description,
  rating: 4.9,
  verified: s.verifiedFromPublicListing,
  _demo: !s.verifiedFromPublicListing,
}));

async function loadServices(
  env: Env
): Promise<{ services: AgriService[]; isDemo: boolean; source: string }> {
  if (env.DB) {
    try {
      const { results } = await env.DB.prepare(
        'SELECT * FROM agricultural_services WHERE status = ? LIMIT 50'
      )
        .bind('active')
        .all();

      if (results && results.length > 0) {
        const parsed: AgriService[] = results.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.provider_name),
          type: (String(r.category) as AgriService['type']) || 'machinery',
          location: String(r.location),
          distance_km: 5.0,
          contact: String(r.phone_masked),
          pricing: String(r.tariff_description || 'Standard Tariffs'),
          description: typeof r.services === 'string' ? r.services : 'Regional agricultural extension service',
          rating: 4.9,
          verified: Boolean(r.verification_status === 'verified'),
          _demo: false,
        }));
        return {
          services: parsed,
          isDemo: false,
          source: 'Cloudflare D1 Production Database',
        };
      }
    } catch (err) {
      console.warn('[Services] D1 query failed, using calibrated demo directory:', err);
    }
  }

  return {
    services: DEMO_SERVICES,
    isDemo: true,
    source: 'Bhoomi Mithra Demo Agricultural Directory',
  };
}

export async function handleServices(
  request: IRequest,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const location = url.searchParams.get('location');

  const { services: allServices, isDemo, source } = await loadServices(env);

  const filtered = allServices.filter((s) => {
    if (category && s.type !== category) return false;
    if (location && !s.location.toLowerCase().includes(location.toLowerCase())) return false;
    return true;
  });

  const response: ApiResponse<ServicesResponse> = {
    success: true,
    data: {
      services: filtered,
      total: filtered.length,
      _demo: isDemo,
      source,
    },
  };
  return jsonResponse(response);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
