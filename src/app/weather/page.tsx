'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { getWeather } from '@/lib/api'
import type { WeatherData } from '@/lib/api'

const QUICK_DISTRICTS = ['Anekal', 'Bengaluru Urban', 'Hosur', 'Kanakapura', 'Ramanagara']

export default function WeatherIntelligencePage() {
  const { context, farmProfile } = useFarmContext()
  const [location, setLocation] = useState(farmProfile?.location || context.location || 'Anekal, Bengaluru Urban, Karnataka')
  const [searchInput, setSearchInput] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherData = (loc: string) => {
    setLoading(true)
    setError(null)
    getWeather(loc)
      .then((data) => {
        setWeather(data)
      })
      .catch((err) => {
        setWeather(null)
        setError('Live weather temporarily unavailable for this location. Please verify your connection or try another district.')
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
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-code-sm text-xs text-secondary uppercase font-bold tracking-wider">
                Live Meteorological Telemetry
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Weather Intelligence
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                  search
                </span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search district (e.g. Anekal)..."
                  className="h-10 pl-9 pr-3 rounded-xl bg-surface-container/70 border border-outline-variant/30 text-white font-body-sm text-xs focus:outline-none focus:border-secondary w-52 sm:w-64"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-secondary text-surface font-label-code-sm text-xs uppercase font-bold shadow-md hover:opacity-90 transition-all"
              >
                Search
              </button>
            </form>

            <Link
              href="/weather-protection"
              className="h-10 px-4 rounded-xl bg-surface-container-high border border-outline-variant/30 hover:border-secondary text-on-surface font-label-code-sm text-xs uppercase font-bold flex items-center gap-2 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-secondary text-base">shield</span>
              <span>Crop Advisory</span>
            </Link>
          </div>
        </div>

        {/* Quick District Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="font-label-code-sm text-xs text-on-surface-variant uppercase tracking-wider shrink-0">
            Quick Stations:
          </span>
          {QUICK_DISTRICTS.map((d) => (
            <button
              key={d}
              onClick={() => setLocation(`${d}, Karnataka`)}
              className={`px-3 py-1 rounded-full text-xs font-label-code-sm transition-all shrink-0 ${
                location.startsWith(d)
                  ? 'bg-secondary text-surface font-bold shadow-sm'
                  : 'bg-surface-container/60 border border-outline-variant/20 text-on-surface-variant hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Live Status Indicator Banner */}
        {weather && (
          <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-between text-xs text-white shadow-sm flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
              </span>
              <span>
                <strong>LIVE METEOROLOGY:</strong> Sourced directly from {weather.source || 'Open-Meteo Live API'} for <strong>{weather.location}</strong>.
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant font-label-code-sm">
              Updated: {new Date(weather.fetched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

        {/* Error State: Honest and Farmer-Friendly */}
        {error && (
          <div className="p-8 rounded-3xl bg-surface-container-low/80 border border-outline-variant/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high mx-auto flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-2xl">cloud_off</span>
            </div>
            <h3 className="font-headline-sm text-base text-white font-bold">
              Live Weather Temporarily Unavailable
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => fetchWeatherData('Anekal, Bengaluru Urban, Karnataka')}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-secondary text-xs font-label-code-sm uppercase font-bold"
            >
              Reload Anekal Station
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="p-12 text-center text-on-surface-variant flex flex-col items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-3xl text-secondary">progress_activity</span>
            <span className="text-xs font-label-code-sm uppercase">Fetching live telemetry from Open-Meteo...</span>
          </div>
        )}

        {/* Main Telemetry & Forecast Grid */}
        {!loading && weather && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Current Weather Card (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-surface-container-low/80 border border-secondary/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base">location_on</span>
                    <span className="font-headline-sm text-lg text-white font-bold">{weather.location}</span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-label-code-sm">
                    Open-Meteo High-Resolution Atmospheric Station
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary font-label-code-sm text-xs font-bold uppercase">
                  {weather.current.condition}
                </span>
              </div>

              <div className="flex items-baseline gap-4 my-2">
                <span className="font-headline-lg text-5xl sm:text-6xl font-bold text-white">
                  {weather.current.temperature_c}°C
                </span>
                <div className="flex flex-col">
                  <span className="text-sm text-secondary font-semibold">
                    Rainfall: {weather.current.rainfall_mm} mm
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Wind: {weather.current.wind_kph} km/h
                  </span>
                </div>
              </div>

              {/* 4 Essential Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20 flex flex-col">
                  <span className="text-[10px] font-label-code-sm text-on-surface-variant uppercase">Humidity</span>
                  <span className="font-headline-sm text-base text-secondary font-bold mt-0.5">
                    {weather.current.humidity_pct}%
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20 flex flex-col">
                  <span className="text-[10px] font-label-code-sm text-on-surface-variant uppercase">Wind Speed</span>
                  <span className="font-headline-sm text-base text-white font-bold mt-0.5">
                    {weather.current.wind_kph} km/h
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20 flex flex-col">
                  <span className="text-[10px] font-label-code-sm text-on-surface-variant uppercase">Precipitation</span>
                  <span className="font-headline-sm text-base text-primary font-bold mt-0.5">
                    {weather.current.rainfall_mm} mm
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20 flex flex-col">
                  <span className="text-[10px] font-label-code-sm text-on-surface-variant uppercase">UV Index</span>
                  <span className="font-headline-sm text-base text-white font-bold mt-0.5">
                    {weather.current.uv_index ?? 7}
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast Strip (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-surface-container-low/80 border border-outline-variant/30 backdrop-blur-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <h2 className="font-headline-sm text-base text-white font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">calendar_view_week</span>
                  5-Day Forecast
                </h2>
                <span className="text-[10px] font-label-code-sm uppercase text-secondary">
                  Open-Meteo
                </span>
              </div>

              <div className="space-y-2.5">
                {weather.forecast.slice(0, 5).map((f, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/20 flex items-center justify-between text-xs hover:border-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary text-base">
                        {f.rainfall_mm > 5 ? 'thunderstorm' : f.rainfall_mm > 0 ? 'rainy' : 'sunny'}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{f.date}</span>
                        <span className="text-[11px] text-on-surface-variant">{f.condition}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-white">
                        {f.max_temp_c}° / {f.min_temp_c}°
                      </span>
                      <span className="block text-[10px] text-secondary">
                        {f.rainfall_mm} mm rain
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </StitchShell>
  )
}
