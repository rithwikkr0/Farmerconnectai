import type { Metadata } from 'next'
import { WeatherAdvisor } from '@/components/features/weather-advisor'

export const metadata: Metadata = {
  title: 'Weather & Advisory',
}

export default function WeatherPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">Weather & Advisory</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Local weather forecast with AI-generated crop-specific preventive advice.
        </p>
      </div>
      <WeatherAdvisor />
    </div>
  )
}
