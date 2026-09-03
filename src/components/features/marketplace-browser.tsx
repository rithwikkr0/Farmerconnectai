'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Loader2, AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getMarketplaceListings } from '@/lib/api'
import type { MarketplaceListing, MarketplaceCategory } from '@/lib/api'

const CATEGORIES: { value: MarketplaceCategory; label: string }[] = [
  { value: 'seeds', label: 'Seeds' },
  { value: 'fertilizers', label: 'Fertilizers' },
  { value: 'pesticides', label: 'Pesticides' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'produce', label: 'Produce' },
  { value: 'services', label: 'Services' },
]

const CATEGORY_COLOR: Record<string, string> = {
  seeds: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  fertilizers: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  pesticides: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  equipment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  produce: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  services: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
}

function ListingCard({ listing }: { listing: MarketplaceListing }) {
  return (
    <Card className={listing.available ? '' : 'opacity-60'}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-snug">{listing.title}</CardTitle>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${CATEGORY_COLOR[listing.category]}`}>
            {listing.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground text-base font-bold">₹{listing.price_inr.toLocaleString('en-IN')}</span>
          <span className="text-muted-foreground text-xs">{listing.unit}</span>
          {!listing.available && <Badge variant="destructive" className="text-xs">Sold Out</Badge>}
          <Badge variant="secondary" className="ml-auto text-xs">Demo</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-xs leading-relaxed">{listing.description}</p>
        <div className="flex flex-wrap gap-1">
          {listing.tags.map((t) => (
            <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
          ))}
        </div>
        <div className="border-t pt-2 text-xs">
          <p className="text-foreground font-medium">{listing.sellerName}</p>
          <p className="text-muted-foreground">{listing.location} · {listing.sellerPhone_masked}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function MarketplaceBrowser() {
  const [category, setCategory] = useState<MarketplaceCategory | 'all'>('all')
  const [location, setLocation] = useState('')
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMarketplaceListings({
        ...(category !== 'all' ? { category } : {}),
        ...(location.trim() ? { location: location.trim() } : {}),
        available: true,
      })
      setListings(data.listings)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load marketplace.')
    } finally {
      setLoading(false)
    }
  }

  // Load on mount
  useEffect(() => { void fetchListings() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = () => void fetchListings()

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShoppingBag className="size-4 text-rose-600" />
            Browse Listings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={category} onValueChange={(v) => setCategory((v ?? 'all') as MarketplaceCategory | 'all')}>
            <SelectTrigger className="w-40 text-sm"><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Filter by location…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
              className="min-w-0 text-sm"
            />
            <Button onClick={handleFilter} disabled={loading} size="icon" aria-label="Search">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <p className="text-muted-foreground text-xs">
          {total === 0 ? 'No listings found. Try adjusting your filters.' : `${total} listing${total !== 1 ? 's' : ''} found`}
        </p>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 space-y-2">
                <div className="bg-muted h-4 w-3/4 rounded" />
                <div className="bg-muted h-3 w-1/2 rounded" />
                <div className="bg-muted h-10 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      )}
    </div>
  )
}
