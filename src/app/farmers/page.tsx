import type { Metadata } from 'next'
import { FarmerMatcher } from '@/components/features/farmer-matcher'

export const metadata: Metadata = {
  title: 'Farmer Connect',
}

export default function FarmersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">Farmer Connect</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Find farmers who grow your crop or have solved a problem you&apos;re facing.
        </p>
      </div>
      <FarmerMatcher />
    </div>
  )
}
