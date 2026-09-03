/**
 * GET /api/marketplace?category=seeds&location=Tamil Nadu&minPrice=100&maxPrice=5000&available=true
 *
 * Returns marketplace listings from Cloudflare D1 or calibrated demo store,
 * filtered by optional query parameters.
 */

import type { IRequest } from 'itty-router';
import { DEMO_MARKETPLACE_LISTINGS } from '../data/marketplace.demo.js';
import type {
  Env,
  MarketplaceCategory,
  MarketplaceFilters,
  MarketplaceListing,
  MarketplaceResponse,
  ApiResponse,
} from '../types/index.js';

const VALID_CATEGORIES = new Set<MarketplaceCategory>([
  'seeds',
  'fertilizers',
  'pesticides',
  'equipment',
  'produce',
  'services',
]);

// ─── D1 Data Loader with Demo Fallback ────────────────────────────────────────

async function loadMarketplaceListings(
  env: Env
): Promise<{ listings: MarketplaceListing[]; isDemo: boolean; source: string }> {
  if (env.DB) {
    try {
      const { results } = await env.DB.prepare(
        'SELECT * FROM marketplace_listings WHERE available = 1 LIMIT 100'
      ).all();

      if (results && results.length > 0) {
        const parsed: MarketplaceListing[] = results.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          title: String(r.title),
          description: String(r.description),
          category: String(r.category) as MarketplaceCategory,
          price_inr: Number(r.price_inr),
          unit: String(r.unit),
          location: String(r.location),
          sellerName: String(r.seller_name),
          sellerPhone_masked: String(r.seller_phone_masked),
          available: Boolean(r.available),
          postedAt: String(r.posted_at || new Date().toISOString()),
          tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : (r.tags as string[]) || [],
          _demo: false,
        }));
        return {
          listings: parsed,
          isDemo: false,
          source: 'Cloudflare D1 Production Database',
        };
      }
    } catch (err) {
      console.warn('[Marketplace] D1 query failed, using demo fallback:', err);
    }
  }

  return {
    listings: DEMO_MARKETPLACE_LISTINGS,
    isDemo: true,
    source: 'Bhoomi Mithra Demo APMC & Input Registry',
  };
}

// ─── GET /api/marketplace ─────────────────────────────────────────────────────

export async function handleMarketplace(
  request: IRequest,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);

  const category = url.searchParams.get('category') as MarketplaceCategory | null;
  const location = url.searchParams.get('location');
  const minPriceStr = url.searchParams.get('minPrice');
  const maxPriceStr = url.searchParams.get('maxPrice');
  const availableStr = url.searchParams.get('available');

  // ── Validate optional category ────────────────────────────────────────────
  if (category && !VALID_CATEGORIES.has(category)) {
    return errorResponse(
      `Invalid category. Must be one of: ${[...VALID_CATEGORIES].join(', ')}`,
      'INVALID_CATEGORY',
      400
    );
  }

  const minPrice = minPriceStr != null ? parseFloat(minPriceStr) : undefined;
  const maxPrice = maxPriceStr != null ? parseFloat(maxPriceStr) : undefined;

  if (minPrice !== undefined && (isNaN(minPrice) || minPrice < 0)) {
    return errorResponse('minPrice must be a non-negative number', 'INVALID_PARAMS', 400);
  }
  if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) {
    return errorResponse('maxPrice must be a non-negative number', 'INVALID_PARAMS', 400);
  }
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    return errorResponse('minPrice cannot exceed maxPrice', 'INVALID_PARAMS', 400);
  }
  if (location && location.length > 100) {
    return errorResponse('location cannot exceed 100 characters', 'PARAM_TOO_LONG', 400);
  }

  // ── Filter listings ───────────────────────────────────────────────────────
  const filters: MarketplaceFilters = {
    ...(category ? { category } : {}),
    ...(location ? { location } : {}),
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
    ...(availableStr != null ? { available: availableStr === 'true' } : {}),
  };

  const { listings: allListings, isDemo, source } = await loadMarketplaceListings(env);

  const listings = allListings.filter((listing) => {
    if (filters.category && listing.category !== filters.category) return false;
    if (
      filters.location &&
      !listing.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    if (filters.minPrice !== undefined && listing.price_inr < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && listing.price_inr > filters.maxPrice) return false;
    if (filters.available !== undefined && listing.available !== filters.available) return false;
    return true;
  });

  const response: ApiResponse<MarketplaceResponse> = {
    success: true,
    data: {
      listings,
      total: listings.length,
      filters,
      _demo: isDemo,
      source,
    },
  };
  return jsonResponse(response);
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
