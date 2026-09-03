/**
 * GET /api/marketplace?category=seeds&location=Tamil Nadu&minPrice=100&maxPrice=5000&available=true
 *
 * Returns demo marketplace listings filtered by optional query params.
 */

import type { IRequest } from 'itty-router';
import { DEMO_MARKETPLACE_LISTINGS } from '../data/marketplace.demo.js';
import type {
  Env,
  MarketplaceCategory,
  MarketplaceFilters,
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

export async function handleMarketplace(
  request: IRequest,
  _env: Env
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

  const listings = DEMO_MARKETPLACE_LISTINGS.filter((listing) => {
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
      _demo: true,
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
