import type { Metadata } from 'next'
import { CropAdvisor } from '@/components/features/crop-advisor'

export const metadata: Metadata = {
  title: 'Crop Advisor',
}

export default function CropsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">Crop Advisor</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Get AI-powered crop recommendations tailored to your soil, water, and season.
        </p>
      </div>
      <CropAdvisor />
    </div>
  )
}
