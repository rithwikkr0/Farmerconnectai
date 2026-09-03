'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { getWeather } from '@/lib/api'
import type { WeatherData } from '@/lib/api'

export default function WeatherIntelligencePage() {
  const { context } = useFarmContext()
  const [location, setLocation] = useState(context.location || 'Mandya, Karnataka')
  const [searchInput, setSearchInput] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchWeatherData = (loc: string) => {
    setLoading(true)
    getWeather(loc)
      .then((data) => setWeather(data))
      .catch(() => {
        // Fallback demo data
        setWeather({
          _demo: true,
          location: loc,
          current: {
            temperature_c: 28,
            humidity_pct: 74,
            wind_kph: 14,
            condition: 'Rain Likely',
            uv_index: 8,
            rainfall_mm: 18.2,
          },
          forecast: [
            { date: 'Tomorrow', max_temp_c: 29, min_temp_c: 22, rainfall_mm: 18.2, condition: 'Heavy Rain', humidity_pct: 82 },
            { date: 'Wednesday', max_temp_c: 30, min_temp_c: 23, rainfall_mm: 6.4, condition: 'Scattered Showers', humidity_pct: 78 },
            { date: 'Thursday', max_temp_c: 31, min_temp_c: 23, rainfall_mm: 1.2, condition: 'Partly Cloudy', humidity_pct: 71 },
            { date: 'Friday', max_temp_c: 32, min_temp_c: 24, rainfall_mm: 0.0, condition: 'Sunny', humidity_pct: 65 },
            { date: 'Saturday', max_temp_c: 33, min_temp_c: 24, rainfall_mm: 0.0, condition: 'Clear', humidity_pct: 62 },
          ],
          fetched_at: new Date().toISOString(),
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchWeatherData(location)
  }, [location])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return
    setLocation(searchInput.trim())
    setSearchInput('')
  }

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Top Header & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                Doppler Micro-Climate Telemetry // Online
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Weather Intelligence
            </h1>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                search
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search district (e.g. Mandya, Thanjavur)..."
                className="h-10 pl-9 pr-3 rounded-xl bg-surface-container/70 border border-outline-variant/30 text-on-surface font-body-sm text-xs focus:outline-none focus:border-primary w-56 sm:w-72"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-primary text-on-primary font-label-code-sm text-xs uppercase font-bold shadow-md hover:bg-primary-container transition-all"
            >
              Scan
            </button>
          </form>
        </div>

        {/* Dynamic Status Banner: LIVE or DEMO */}
        {weather?.status === 'LIVE' ? (
          <div className="p-3 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-between text-xs text-on-surface shadow-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span>
                <strong>LIVE METEOROLOGY:</strong> Real-time atmospheric telemetry from {weather.source || 'Open-Meteo Live API'}.
              </span>
            </div>
            <span className="font-label-code-sm text-[10px] bg-primary text-on-primary px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
              LIVE
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-surface-container-high/60 border border-primary/20 flex items-center justify-between text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">info</span>
              <span>
                <strong>DEMO DATA:</strong> {weather?.source || 'Weather is currently served from Bhoomi Mithra calibrated agrarian telemetry for demonstration purposes.'}
              </span>
            </div>
            <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold">Demo Mode</span>
          </div>
        )}

        {/* Current Weather Card & Key Agricultural Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Weather Card (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-surface-container/80 border border-primary/25 backdrop-blur-2xl shadow-2xl flex flex-col justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary-container" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">location_on</span>
                  <span className="font-headline-sm text-base text-on-surface font-bold">{weather?.location}</span>
                </div>
                <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase mt-0.5">
                  Synchronized with Regional Agronomic Radar
                </span>
              </div>

              <span className="px-3 py-1 rounded-full bg-error-container/30 text-error font-label-code-sm text-xs font-bold uppercase">
                {weather?.current.condition ?? 'Rain Expected'}
              </span>
            </div>

            <div className="flex items-baseline gap-4 my-2">
              <span className="font-headline-lg text-5xl sm:text-6xl font-bold text-on-surface">
                {weather?.current.temperature_c ?? 28}°C
              </span>
              <div className="flex flex-col">
                <span className="font-body-md text-sm text-secondary font-semibold">
                  Precipitation Spike: +{weather?.current.rainfall_mm ?? 18.2} mm
                </span>
                <span className="font-caption text-xs text-on-surface-variant">
                  High soil saturation warning
                </span>
              </div>
            </div>

            {/* 4 Essential Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-body-sm text-xs">
              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">Humidity</span>
                <span className="font-headline-sm text-base text-primary font-bold mt-0.5 font-mono">
                  {weather?.current.humidity_pct ?? 74}%
                </span>
                <span className="text-[10px] text-on-surface-variant">Saturated</span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">Wind Vector</span>
                <span className="font-headline-sm text-base text-secondary font-bold mt-0.5 font-mono">
                  {weather?.current.wind_kph ?? 14} km/h
                </span>
                <span className="text-[10px] text-on-surface-variant">WSW Direction</span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">UV Flux Index</span>
                <span className="font-headline-sm text-base text-on-surface font-bold mt-0.5 font-mono">
                  {weather?.current.uv_index ?? 8}
                </span>
                <span className="text-[10px] text-on-surface-variant">High PAR</span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">Rainfall Vol.</span>
                <span className="font-headline-sm text-base text-error font-bold mt-0.5 font-mono">
                  {weather?.current.rainfall_mm ?? 18.2} mm
                </span>
                <span className="text-[10px] text-error font-bold">Action Needed</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-outline-variant/20">
              <Link
                href="/weather-protection"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary-container text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">shield</span>
                <span>Open Weather Protection Protocols</span>
              </Link>
              <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase font-mono">
                Updated: Just now
              </span>
            </div>
          </div>

          {/* Agricultural Field Impacts (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-surface-container-low/80 border border-primary/20 backdrop-blur-2xl flex flex-col gap-4 shadow-xl">
            <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
              Agronomic Operational Windows
            </span>

            <div className="p-3.5 rounded-2xl bg-surface-container border border-error/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-error-container/30 text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">block</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-headline-sm text-xs text-error font-bold">Spraying Window: Unfavorable</span>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Foliar chemicals will be washed away by forecasted heavy rainfall. Postpone all applications.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container border border-secondary/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">water_drop</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-headline-sm text-xs text-secondary font-bold">Irrigation: Suspend Cycles</span>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Natural soil moisture replenishment incoming. Power down borewell pumps to avoid waterlogging.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container border border-primary/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">agriculture</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-headline-sm text-xs text-primary font-bold">Harvesting: Expedite Mature Lots</span>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Harvest mature tomato and vegetable lots today before rain induces skin cracking or fungal rot.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Day Predictive Forecast Strip */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-xl font-bold text-on-surface">5-Day Atmospheric Projection</h2>
            <span className="font-label-code-sm text-xs text-on-surface-variant font-mono">Calibrated Doppler Loop</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {weather?.forecast.map((day, idx) => (
              <div
                key={day.date}
                className={`p-5 rounded-2xl bg-surface-container/70 border backdrop-blur-xl flex flex-col justify-between gap-4 transition-all shadow-md ${
                  idx === 0
                    ? 'border-error/40 bg-surface-container-high/60 shadow-[0_0_20px_rgba(255,180,171,0.15)]'
                    : 'border-outline-variant/25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-xs font-bold text-on-surface">{day.date}</span>
                  <span className="material-symbols-outlined text-xl text-primary">
                    {day.rainfall_mm > 5 ? 'thunderstorm' : day.rainfall_mm > 0 ? 'rainy' : 'sunny'}
                  </span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-sm text-xl font-bold text-on-surface">{day.max_temp_c}°</span>
                    <span className="font-body-sm text-xs text-on-surface-variant">/ {day.min_temp_c}°C</span>
                  </div>
                  <span className="font-caption text-xs text-secondary mt-1">{day.condition}</span>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between font-label-code-sm text-[10px]">
                  <span className="text-on-surface-variant">Rain:</span>
                  <span className={`font-mono font-bold ${day.rainfall_mm > 0 ? 'text-error' : 'text-on-surface'}`}>
                    {day.rainfall_mm} mm
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
