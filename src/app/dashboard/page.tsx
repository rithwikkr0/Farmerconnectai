'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { StitchShell } from '@/components/layout/stitch-shell'
import { FarmTerrainTwin } from '@/components/three/farm-terrain-twin'
import { useFarmContext } from '@/hooks/use-farm-context'
import { useLanguage } from '@/context/language-context'
import { getWeather } from '@/lib/api'
import type { WeatherData } from '@/lib/api'

export default function FarmCommandCenterPage() {
  const { context, user, isAuthenticated, farmProfile } = useFarmContext()
  const { t } = useLanguage()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherError, setWeatherError] = useState(false)

  const farmerName = user?.full_name || context.farmerName || 'Farmer'
  const farmLocation = farmProfile?.location || context.location || 'Anekal, Bengaluru Urban, Karnataka'
  const primaryCrop = farmProfile?.current_crop || context.primaryCrop || 'Tomato'
  const landSize = farmProfile?.land_size_acres || context.landSizeAcres || 3.5
  const soilType = farmProfile?.soil_type || context.soilType || 'Red sandy loam'
  const water = farmProfile?.water_availability || context.waterAvailability || 'moderate'
  const season = farmProfile?.season || context.season || 'Kharif'

  useEffect(() => {
    getWeather(farmLocation)
      .then((data) => {
        setWeatherData(data)
        setWeatherError(false)
      })
      .catch(() => {
        setWeatherError(true)
      })
  }, [farmLocation])

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* 1. WELCOME FARMER BANNER */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-surface-container-low/90 via-surface-container/70 to-surface-container-low/90 border border-primary/30 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high/90 border border-primary/40 flex items-center justify-center p-1.5 shadow-lg shrink-0">
              <img src="/logo.png" alt="Bhoomi Mithra Emblem" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-headline-sm text-2xl sm:text-3xl text-white font-bold tracking-tight">
                  {t('welcome')}, {farmerName}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-label-code-sm font-semibold uppercase">
                  {isAuthenticated ? t('verifiedD1') : 'Farm Profile Active'}
                </span>
              </div>
              <p className="text-on-surface-variant text-xs sm:text-sm font-label-code-sm mt-1">
                {farmLocation} • <span className="text-secondary font-medium">ಬೆಳಕಿನ ಮನೆ</span> • {t('dashboard')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="px-4 py-2.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30 text-center">
              <span className="block text-[10px] font-label-code-sm uppercase text-on-surface-variant">{t('crop')}</span>
              <span className="font-bold text-xs sm:text-sm text-secondary truncate block">{primaryCrop}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30 text-center">
              <span className="block text-[10px] font-label-code-sm uppercase text-on-surface-variant">{t('acres')}</span>
              <span className="font-bold text-xs sm:text-sm text-primary truncate block">{landSize} {t('acres')}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30 text-center">
              <span className="block text-[10px] font-label-code-sm uppercase text-on-surface-variant">{t('soil')}</span>
              <span className="font-bold text-xs sm:text-sm text-white truncate block">{soilType}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30 text-center">
              <span className="block text-[10px] font-label-code-sm uppercase text-on-surface-variant">{t('water')}</span>
              <span className="font-bold text-xs sm:text-sm text-secondary truncate block capitalize">{water}</span>
            </div>
          </div>
        </section>

        {/* 2. FOUR COMPACT HIGH-VALUE CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Weather (Blue) */}
          <div className="p-6 rounded-3xl bg-surface-container-low/80 border border-blue-500/30 backdrop-blur-xl shadow-lg flex flex-col justify-between hover:border-blue-500/60 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-label-code-sm text-[10px] uppercase font-bold tracking-wider">
                  LIVE OPEN-METEO
                </span>
                <span className="material-symbols-outlined text-blue-400 text-2xl">thermostat</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-headline-lg font-bold text-white block">
                  {weatherData?.current.temperature_c ?? 31}°C
                </span>
                <span className="text-xs font-semibold text-blue-300 block mt-0.5">
                  {weatherData?.current.condition ?? 'Partly Cloudy'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
                <span>Rain: {weatherData?.current.rainfall_mm ?? 0} mm</span>
                <span>Humidity: {weatherData?.current.humidity_pct ?? 65}%</span>
              </div>
            </div>
            <Link
              href="/weather"
              className="mt-4 text-xs font-label-code-sm text-blue-400 hover:text-blue-300 font-bold uppercase flex items-center justify-between pt-2 border-t border-blue-500/20"
            >
              <span>{t('weather')}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Card 2: Crop Intelligence (Green) */}
          <div className="p-6 rounded-3xl bg-surface-container-low/80 border border-emerald-500/30 backdrop-blur-xl shadow-lg flex flex-col justify-between hover:border-emerald-500/60 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-label-code-sm text-[10px] uppercase font-bold tracking-wider">
                  {season} SEASON
                </span>
                <span className="material-symbols-outlined text-emerald-400 text-2xl">grain</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-headline-md font-bold text-white block truncate">
                  {primaryCrop}
                </span>
                <span className="text-xs text-emerald-300 block mt-0.5">
                  Soil: {soilType}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
                <span>Acreage: {landSize} ac</span>
                <span>Water: {water}</span>
              </div>
            </div>
            <Link
              href="/crops"
              className="mt-4 text-xs font-label-code-sm text-emerald-400 hover:text-emerald-300 font-bold uppercase flex items-center justify-between pt-2 border-t border-emerald-500/20"
            >
              <span>{t('crops')}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Card 3: AI Advice (Purple) */}
          <div className="p-6 rounded-3xl bg-surface-container-low/80 border border-primary/30 backdrop-blur-xl shadow-lg flex flex-col justify-between hover:border-primary/60 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-code-sm text-[10px] uppercase font-bold tracking-wider">
                  BHOOMI MITHRA AI
                </span>
                <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
              </div>
              <div>
                <span className="text-sm font-bold text-white block leading-snug">
                  Active Agronomic Advisory
                </span>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Maintain drainage furrows and verify soil moisture balance for {primaryCrop}.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
                <span>Model: Gemini 3.5</span>
                <span className="text-primary font-semibold">Ready</span>
              </div>
            </div>
            <Link
              href="/copilot"
              className="mt-4 text-xs font-label-code-sm text-primary hover:text-primary-container font-bold uppercase flex items-center justify-between pt-2 border-t border-primary/20"
            >
              <span>{t('askAI')}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Card 4: Farm Profit (Yellow) */}
          <div className="p-6 rounded-3xl bg-surface-container-low/80 border border-amber-500/30 backdrop-blur-xl shadow-lg flex flex-col justify-between hover:border-amber-500/60 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-label-code-sm text-[10px] uppercase font-bold tracking-wider">
                  ECONOMIC SIMULATOR
                </span>
                <span className="material-symbols-outlined text-amber-400 text-2xl">calculate</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-headline-lg font-bold text-white block">
                  ₹{(Number(landSize) * 35000).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-amber-300 block mt-0.5">
                  Est. Net Seasonal Realization
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
                <span>Land: {landSize} ac</span>
                <span>Margin: ~45%</span>
              </div>
            </div>
            <Link
              href="/profit"
              className="mt-4 text-xs font-label-code-sm text-amber-400 hover:text-amber-300 font-bold uppercase flex items-center justify-between pt-2 border-t border-amber-500/20"
            >
              <span>{t('profit')}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* 3. QUICK ACTIONS GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <h2 className="font-headline-sm text-lg sm:text-xl text-white font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">bolt</span>
              Farmer Quick Actions
            </h2>
            <span className="text-xs font-label-code-sm text-on-surface-variant">One-Tap Navigation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <Link
              href="/copilot"
              className="p-4 rounded-2xl bg-surface-container-high/60 border border-primary/30 hover:border-primary hover:bg-surface-container-highest transition-all flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">psychology</span>
              </div>
              <span className="text-xs font-bold text-white">{t('askAI')}</span>
              <span className="text-[10px] text-on-surface-variant">Instant Help</span>
            </Link>

            <Link
              href="/crop-doctor"
              className="p-4 rounded-2xl bg-surface-container-high/60 border border-red-500/30 hover:border-red-500 hover:bg-surface-container-highest transition-all flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">document_scanner</span>
              </div>
              <span className="text-xs font-bold text-white">{t('cropDoctor')}</span>
              <span className="text-[10px] text-on-surface-variant">Upload Leaf</span>
            </Link>

            <Link
              href="/crops"
              className="p-4 rounded-2xl bg-surface-container-high/60 border border-emerald-500/30 hover:border-emerald-500 hover:bg-surface-container-highest transition-all flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">grain</span>
              </div>
              <span className="text-xs font-bold text-white">{t('crops')}</span>
              <span className="text-[10px] text-on-surface-variant">Soil &amp; Suitability</span>
            </Link>

            <Link
              href="/weather"
              className="p-4 rounded-2xl bg-surface-container-high/60 border border-blue-500/30 hover:border-blue-500 hover:bg-surface-container-highest transition-all flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">cloudy_snowing</span>
              </div>
              <span className="text-xs font-bold text-white">{t('weather')}</span>
              <span className="text-[10px] text-on-surface-variant">Live Open-Meteo</span>
            </Link>

            <Link
              href="/farmers"
              className="p-4 rounded-2xl bg-surface-container-high/60 border border-teal-500/30 hover:border-teal-500 hover:bg-surface-container-highest transition-all flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">person_search</span>
              </div>
              <span className="text-xs font-bold text-white">{t('farmers')}</span>
              <span className="text-[10px] text-on-surface-variant">Peer Network</span>
            </Link>

            <Link
              href="/labor"
              className="p-4 rounded-2xl bg-surface-container-high/60 border border-amber-500/30 hover:border-amber-500 hover:bg-surface-container-highest transition-all flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">engineering</span>
              </div>
              <span className="text-xs font-bold text-white">{t('labor')}</span>
              <span className="text-[10px] text-on-surface-variant">Book Workers</span>
            </Link>

            <Link
              href="/marketplace"
              className="p-4 rounded-2xl bg-surface-container-high/60 border border-purple-500/30 hover:border-purple-500 hover:bg-surface-container-highest transition-all flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">storefront</span>
              </div>
              <span className="text-xs font-bold text-white">{t('marketplace')}</span>
              <span className="text-[10px] text-on-surface-variant">APMC Inputs</span>
            </Link>
          </div>
        </section>

        {/* 4. COMPACT 3D FARM TWIN PREVIEW */}
        <section className="bg-surface-container-low/70 backdrop-blur-2xl border border-outline-variant/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">view_in_ar</span>
                Interactive Field Twin ({primaryCrop})
              </h2>
              <p className="text-xs text-on-surface-variant">
                Visualizing spatial layout, bund elevation, and crop canopy for {farmLocation}
              </p>
            </div>
            <Link
              href="/crops"
              className="px-4 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-secondary text-xs font-label-code-sm font-bold uppercase transition-all"
            >
              {t('analyze')}
            </Link>
          </div>

          <div className="w-full h-[280px] sm:h-[340px] rounded-2xl overflow-hidden relative bg-surface-container-lowest border border-outline-variant/20">
            <FarmTerrainTwin height={340} cropName={primaryCrop} />
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-[11px] font-label-code-sm text-white backdrop-blur-md">
              Acreage: {landSize} ac • Soil: {soilType}
            </div>
          </div>
        </section>
      </div>
    </StitchShell>
  )
}
