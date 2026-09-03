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

const DEMO_SERVICES: AgriService[] = [
  {
    id: 's-1',
    name: 'AeroKrishi Autonomous Drone Spraying',
    type: 'drone',
    location: 'Mandya Agro-Tech Corridor, Karnataka',
    distance_km: 4.2,
    contact: '+91 94480 88776',
    pricing: '₹450 / acre (10 min flight)',
    description:
      'Ultra-low volume micron spray for blight protection and foliar nutrition. High canopy penetration with zero soil compaction.',
    rating: 4.9,
    verified: true,
    _demo: true,
  },
  {
    id: 's-2',
    name: 'Raitha Sanjeevini Cold Storage Facility',
    type: 'storage',
    location: 'Mysore-Bangalore Highway Node, Karnataka',
    distance_km: 8.5,
    contact: '+91 98800 22334',
    pricing: '₹1.80 / kg per month (Humidity Controlled)',
    description:
      '4°C to 12°C dynamic cold rooms optimized for tomatoes, chillies, and exotic horticulture. Warehouse receipt financing available.',
    rating: 4.85,
    verified: true,
    _demo: true,
  },
  {
    id: 's-3',
    name: 'ICAR-KVK Regional Soil & Leaf Testing Lab',
    type: 'lab',
    location: 'V.C. Farm Campus, Mandya, Karnataka',
    distance_km: 6.1,
    contact: '+91 82322 45678',
    pricing: '₹150 / complete sample profile',
    description:
      'Comprehensive 12-parameter soil health card testing: Available N, P, K, Organic Carbon, EC, pH, and micronutrients.',
    rating: 4.95,
    verified: true,
    _demo: true,
  },
  {
    id: 's-4',
    name: 'Cauvery Custom Hiring Machinery Centre',
    type: 'machinery',
    location: 'Maddur Taluk, Karnataka',
    distance_km: 11.3,
    contact: '+91 97410 33445',
    pricing: '₹850 / hour (Includes operator & diesel)',
    description:
      '55HP 4WD Tractors with laser land leveler, rotavator, multi-crop pneumatic precision planter, and paddy transplanters.',
    rating: 4.75,
    verified: true,
    _demo: true,
  },
];

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
