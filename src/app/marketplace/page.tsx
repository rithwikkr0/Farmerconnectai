import type { Metadata } from 'next'
import { MarketplaceBrowser } from '@/components/features/marketplace-browser'

export const metadata: Metadata = {
  title: 'Marketplace',
}

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse seeds, fertilizers, equipment, produce, and services from local sellers.
        </p>
      </div>
      <MarketplaceBrowser />
    </div>
  )
}
