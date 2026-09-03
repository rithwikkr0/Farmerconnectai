'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { getWeatherAdvice } from '@/lib/api'
import type { WeatherAdviceResponse } from '@/lib/api'

export default function WeatherProtectionCenterPage() {
  const { context } = useFarmContext()
  const [crop, setCrop] = useState(context.primaryCrop || 'Tomato (Arka Rakshak)')
  const [advice, setAdvice] = useState<WeatherAdviceResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const farmLocation = context.location || 'Mandya, Karnataka'

  useEffect(() => {
    setLoading(true)
    getWeatherAdvice({
      location: farmLocation,
      crop,
      additionalContext: `Soil: ${context.soilType || 'Loamy'}, Water: ${context.waterAvailability || 'Moderate'}`,
    })
      .then((res) => setAdvice(res))
      .catch(() => {
        // Fallback structured protection advice
        setAdvice({
          location: farmLocation,
          weather: {
            _demo: true,
            location: farmLocation,
            current: {
              temperature_c: 28,
              humidity_pct: 74,
              wind_kph: 14,
              condition: 'Rain Likely',
              uv_index: 8,
              rainfall_mm: 18.2,
            },
            forecast: [],
            fetched_at: new Date().toISOString(),
          },
          advice: 'Critical Drainage Alert: Low-lying tomato plots are susceptible to severe root waterlogging and fungal leaf blight.',
          preventiveActions: [
            'Dredge and unclog primary drainage furrows along Sector Alpha',
            'Shut off automatic borewell drip pumps immediately',
            'Elevate harvested tomato crates off the ground on wooden pallets',
            'Postpone scheduled foliar pesticide or fertilizer sprays for 48 hours',
            'Secure greenhouse polythene and bamboo stake supports against 25 km/h gusts',
          ],
          risks: ['Waterlogging', 'Root Asphyxiation', 'Blight Spore Dispersal', 'Foliar Chemical Wash-Off'],
          safetyNote: 'Adhere to local safety alerts and consult an agronomist before spraying.',
        })
      })
      .finally(() => setLoading(false))
  }, [farmLocation, crop, context.soilType, context.waterAvailability])

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
              <span className="font-label-code-sm text-xs text-error uppercase font-bold tracking-wider">
                Crop &amp; Weather Protection Protocols // Active
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Weather Protection Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/labor"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-white font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">groups</span>
              <span>Hire Emergency Drainage Labor</span>
            </Link>
          </div>
        </div>

        {/* Hero Critical Alert Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container/80 border border-error/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col gap-5">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-error via-primary to-secondary" />

          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-error-container/30 text-error flex items-center justify-center shadow-lg shrink-0">
                <span className="material-symbols-outlined text-2xl">thunderstorm</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-error text-on-error font-label-code-sm text-[10px] uppercase font-bold">
                    HIGH RISK WARNING
                  </span>
                  <span className="font-label-code-sm text-xs text-on-surface-variant font-mono">
                    {farmLocation}
                  </span>
                </div>
                <h2 className="font-headline-md text-xl font-bold text-on-surface mt-1">
                  Waterlogging &amp; Storm Safeguard: {crop}
                </h2>
              </div>
            </div>

            <span className="font-label-code-sm text-xs text-error bg-error-container/20 border border-error/30 px-3 py-1.5 rounded-xl font-mono">
              Rain Spike: +18mm / 36h
            </span>
          </div>

          <p className="font-body-md text-sm text-on-surface leading-relaxed max-w-4xl">
            {advice?.advice ?? 'Intense precipitation cycle arriving shortly. Prepare soil drainage trenches and protect sensitive flowering canopies from prolonged saturation.'}
          </p>

          {/* Key Identified Risks Badges */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="font-label-code-sm text-xs text-on-surface-variant uppercase font-bold mr-1">
              Active Vulnerabilities:
            </span>
            {advice?.risks?.map((r, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-sm text-xs flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Actionable Protective Protocols Checklist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Action Items List (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">
              Autonomous Risk Mitigation Protocols
            </h3>

            <div className="space-y-3">
              {(advice?.preventiveActions ?? [
                'Inspect and clear bund culverts and primary drainage trenches',
                'Shut off all automatic canal and borewell irrigation cycles',
                'Move seed and fertilizer bags to elevated platforms under waterproof tarpaulins',
                'Harvest mature vegetable lots ahead of rainfall impact',
                'Reinforce trellis structures for tall tomato and climbing crops',
              ]).map((item: string, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl flex items-start gap-3.5 hover:border-primary transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-label-code-sm text-xs font-bold font-mono mt-0.5">
                    0{idx + 1}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <span className="font-body-md text-sm text-on-surface font-medium leading-relaxed">
                      {item}
                    </span>
                    <span className="font-label-code-sm text-[10px] text-primary uppercase">
                      Action Phase: Pre-Rain Window
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">
                    check_circle
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Execution Side Panel (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="p-6 rounded-3xl bg-surface-container-low/80 border border-primary/25 backdrop-blur-2xl flex flex-col gap-4 shadow-xl">
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                Emergency Resource Dispatch
              </span>

              <p className="font-body-sm text-xs text-on-surface-variant">
                Need extra hands to trench, harvest, or install tarpaulins before the storm hits?
              </p>

              <Link
                href="/labor"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary text-white font-headline-sm text-xs font-bold uppercase tracking-wider text-center shadow-md hover:scale-[1.01] transition-all"
              >
                Find 3 Emergency Workers →
              </Link>

              <Link
                href="/copilot"
                className="w-full py-2.5 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface font-body-sm text-xs text-center transition-all"
              >
                Ask Copilot for Custom Plan
              </Link>
            </div>

            <div className="p-5 rounded-3xl bg-surface-container/60 border border-outline-variant/25 flex flex-col gap-2">
              <span className="font-label-code-sm text-xs text-secondary uppercase font-bold">
                Post-Rain Recovery Note
              </span>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Once weather clears, inspect root zones for standing water. Apply copper fungicide within 24 hours to prevent spore germination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
