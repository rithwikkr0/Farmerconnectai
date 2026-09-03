import type { Metadata } from 'next'
import { LaborFinder } from '@/components/features/labor-finder'

export const metadata: Metadata = {
  title: 'Labor Hire',
}

export default function LaborPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">Labor Hire</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Find available agricultural workers near you or post a hire request.
        </p>
      </div>
      <LaborFinder />
    </div>
  )
}
