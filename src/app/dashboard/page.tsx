'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { StitchShell } from '@/components/layout/stitch-shell'
import { BioCoreOrb } from '@/components/three/bio-core-orb'
import { FarmTerrainTwin } from '@/components/three/farm-terrain-twin'
import { useFarmContext } from '@/hooks/use-farm-context'
import { getWeather } from '@/lib/api'
import type { WeatherData } from '@/lib/api'

export default function FarmCommandCenterPage() {
  const { context, user, isAuthenticated } = useFarmContext()
  const [activeLayer, setActiveLayer] = useState<'moisture' | 'vigor' | 'irrigation'>('moisture')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  const farmLocation = context.location || 'Mandya, Karnataka'
  const primaryCrop = context.primaryCrop || 'Finger Millet (Ragi)'

  useEffect(() => {
    getWeather(farmLocation)
      .then((data) => setWeatherData(data))
      .catch(() => {
        // Fallback demo data
      })
  }, [farmLocation])

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Personalized Farmer Greeting & Agro-Parameters Banner */}
        <section className="p-6 rounded-3xl bg-gradient-to-r from-surface-container-low/90 via-surface-container/60 to-surface-container-low/90 border border-primary/30 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high/90 border border-primary/40 flex items-center justify-center p-1 shadow-lg shrink-0">
              <img src="/logo.png" alt="Bhoomi Mithra" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-headline-sm text-xl sm:text-2xl text-white font-bold">
                  {user ? `Welcome back, ${user.full_name}` : (context.farmerName ? `Welcome back, ${context.farmerName}` : 'Welcome, Farm Operator')}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-label-code-sm font-semibold uppercase">
                  {isAuthenticated ? 'Cloudflare D1 Verified' : 'Local Node Active'}
                </span>
              </div>
              <p className="text-on-surface-variant text-xs font-label-code-sm mt-1">
                Autonomous Agro-OS synchronized with Indian Meteorological telemetry and Gemini AI advisory
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="px-3.5 py-2 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-center">
              <span className="block text-[10px] font-label-code-sm uppercase text-on-surface-variant">Primary Crop</span>
              <span className="font-bold text-xs sm:text-sm text-secondary truncate block">{primaryCrop}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-center">
              <span className="block text-[10px] font-label-code-sm uppercase text-on-surface-variant">Land Size</span>
              <span className="font-bold text-xs sm:text-sm text-primary truncate block">{context.landSizeAcres ?? 3.5} Acres</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-center">
              <span className="block text-[10px] font-label-code-sm uppercase text-on-surface-variant">Soil Type</span>
              <span className="font-bold text-xs sm:text-sm text-on-surface truncate block">{context.soilType || 'Red sandy loam'}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-center">
              <span className="block text-[10px] font-label-code-sm uppercase text-on-surface-variant">Water Access</span>
              <span className="font-bold text-xs sm:text-sm text-secondary truncate block capitalize">{context.waterAvailability || 'Moderate'}</span>
            </div>
          </div>
        </section>

        {/* Top Command Deck Telemetry Bar */}
        <section className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="font-label-code-sm text-xs text-primary uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
                Autonomous Bio-Node // Synced
              </span>
              <span className="text-outline-variant font-label-code-sm">/</span>
              <span className="font-label-code-sm text-xs text-on-surface-variant uppercase">
                {context.district || 'Sector 07-Gamma'} Telemetry Deck
              </span>
            </div>

            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Farm Command Center
              </h1>
              <div className="flex items-center gap-2 bg-surface-container/70 border border-primary/20 backdrop-blur-md px-3 py-1 rounded-full shadow-inner">
                <span className="material-symbols-outlined text-primary text-base">location_on</span>
                <span className="font-body-sm text-xs font-semibold text-on-surface">{farmLocation}</span>
                <span className="font-label-code-sm text-[10px] text-primary/80 hidden sm:inline ml-1 font-mono">
                  LAT: 12.52° N • LON: 76.89° E
                </span>
              </div>
            </div>
          </div>

          {/* Live Micro-Weather & Profile */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/weather"
              className="flex items-center gap-3 bg-surface-container/80 border border-primary/20 backdrop-blur-xl px-4 py-2 rounded-2xl hover:border-primary transition-all shadow-md"
            >
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">
                  {weatherData?.current.rainfall_mm ? 'rainy' : 'cloudy_snowing'}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-sm font-bold text-on-surface">
                    {weatherData?.current.temperature_c ?? 28}°C
                  </span>
                  <span className="font-label-code-sm text-[10px] text-error bg-error-container/30 px-2 py-0.5 rounded-full uppercase font-bold">
                    Rain Likely
                  </span>
                </div>
                <span className="font-caption text-[11px] text-on-surface-variant">
                  {weatherData?.current.condition ?? 'Partly Cloudy'} • 74% RH
                </span>
              </div>
            </Link>

            <Link
              href="/setup"
              className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
              title="Reconfigure Farm Profile"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
            </Link>
          </div>
        </section>

        {/* SECTION 1: HERO AI FARM BRIEF & 3D NEURAL ORB */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative">
          {/* AI Farm Brief Main Slate (Col 8) */}
          <div className="xl:col-span-8 bg-surface-container/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-primary/20 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div>
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between pb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_12px_rgba(112,96,249,0.5)]">
                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-code-lg text-xs text-primary tracking-wider uppercase font-bold">
                      AI Farm Brief
                    </span>
                    <span className="font-caption text-[11px] text-on-surface-variant">
                      Real-Time Molecular &amp; Agronomic Predictive Synthesis
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-surface-container-lowest/80 border border-outline-variant/25 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <span className="font-label-code-sm text-[11px] text-on-surface font-semibold uppercase">
                    4 Critical Focal Vectors
                  </span>
                </div>
              </div>

              {/* Greeting & Summary */}
              <div className="my-2">
                <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                  Good morning, Farm Operator.
                </h2>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">
                  Here is what your bio-canopy and field operations require today.
                </p>

                <div className="my-4 p-4 rounded-2xl bg-surface-container-lowest/70 border border-primary/20 backdrop-blur-md shadow-inner flex flex-col gap-2 font-body-sm text-xs text-on-surface">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Precipitation spike expected in Mandya (+18mm).
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-error" />
                    Your {primaryCrop} field may face waterlogging risk on Sector Alpha.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    8 verified agricultural workers are available within 5km radial.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim" />
                    Harvest window approaching • 3 local buyers requesting 500kg lots at ₹38/kg.
                  </p>
                </div>
              </div>

              {/* 4 Interactive Priority Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                <Link
                  href="/weather-protection"
                  className="p-3.5 rounded-2xl bg-surface-container-low/90 hover:bg-surface-container-high border border-error/30 transition-all group flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-error-container/30 text-error flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">water_damage</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-caption text-[10px] text-error font-semibold uppercase tracking-wider">
                        Weather Warning
                      </span>
                      <span className="font-body-sm text-xs text-on-surface font-medium truncate">
                        Check field drainage
                      </span>
                    </div>
                  </div>
                  <span className="font-label-code-sm text-[10px] text-error bg-error-container/40 px-2 py-0.5 rounded-full uppercase font-bold flex items-center gap-1">
                    Priority 1
                  </span>
                </Link>

                <Link
                  href="/crop-doctor"
                  className="p-3.5 rounded-2xl bg-surface-container-low/90 hover:bg-surface-container-high border border-primary/30 transition-all group flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">document_scanner</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-caption text-[10px] text-primary font-semibold uppercase tracking-wider">
                        Crop Doctor
                      </span>
                      <span className="font-body-sm text-xs text-on-surface font-medium truncate">
                        Scan tomato leaves
                      </span>
                    </div>
                  </div>
                  <span className="font-label-code-sm text-[10px] text-primary bg-primary-container/30 px-2 py-0.5 rounded-full uppercase font-bold">
                    Scan
                  </span>
                </Link>

                <Link
                  href="/labor"
                  className="p-3.5 rounded-2xl bg-surface-container-low/90 hover:bg-surface-container-high border border-secondary/30 transition-all group flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">groups</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-caption text-[10px] text-secondary font-semibold uppercase tracking-wider">
                        Labor Sync
                      </span>
                      <span className="font-body-sm text-xs text-on-surface font-medium truncate">
                        8 workers available nearby
                      </span>
                    </div>
                  </div>
                  <span className="font-label-code-sm text-[10px] text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full uppercase font-bold">
                    Available
                  </span>
                </Link>

                <Link
                  href="/input-advisor"
                  className="p-3.5 rounded-2xl bg-surface-container-low/90 hover:bg-surface-container-high border border-tertiary/30 transition-all group flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-tertiary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">science</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-caption text-[10px] text-tertiary font-semibold uppercase tracking-wider">
                        Nutrition Dispatch
                      </span>
                      <span className="font-body-sm text-xs text-on-surface font-medium truncate">
                        Foliar spray timing
                      </span>
                    </div>
                  </div>
                  <span className="font-label-code-sm text-[10px] text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded-full uppercase font-bold">
                    Today
                  </span>
                </Link>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-3 pt-3 flex-wrap">
              <Link
                href="/copilot"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary-container text-on-primary font-headline-sm text-xs font-bold tracking-wider uppercase hover:scale-105 shadow-[0_0_24px_rgba(198,192,255,0.45)] transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">forum</span>
                <span>Ask Bhoomi Mithra AI</span>
              </Link>
              <Link
                href="/crops"
                className="px-5 py-2.5 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface font-body-sm text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
              >
                <span>Explore Crop Intelligence</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* 3D AI Orb Stage (Col 4) */}
          <div className="xl:col-span-4 bg-surface-container/60 backdrop-blur-2xl rounded-3xl p-6 border border-primary/25 shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between">
              <span className="font-label-code-sm text-[10px] text-primary uppercase font-mono tracking-widest">
                Bhoomi AI Core // v4.9
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#c6c0ff]" />
            </div>

            {/* 3D ThreeJS AI Orb */}
            <BioCoreOrb height={260} />

            <div className="flex flex-col items-center gap-2 w-full">
              <h3 className="font-headline-sm text-base font-bold text-on-surface">Neural Copilot</h3>
              <p className="font-caption text-[11px] text-on-surface-variant max-w-[240px]">
                Synthesizing multi-spectral canopy telemetry and regional market velocity.
              </p>
              <Link
                href="/copilot"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-body-sm text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Launch Interactive Copilot</span>
                <span>✦</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 2: DIGITAL TWIN FARM SECTION ("Your Farm at a Glance") */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-col">
              <span className="font-label-code-sm text-xs text-primary uppercase tracking-widest font-bold">
                Synthetic Spatial Visualization
              </span>
              <h2 className="font-headline-md text-xl font-bold text-on-surface">Your Farm at a Glance</h2>
            </div>

            {/* Digital Twin View Layer Controls */}
            <div className="flex items-center gap-1.5 bg-surface-container/70 border border-outline-variant/30 backdrop-blur-md p-1 rounded-2xl shadow-inner">
              <button
                type="button"
                onClick={() => setActiveLayer('moisture')}
                className={`px-3 py-1.5 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all ${
                  activeLayer === 'moisture'
                    ? 'bg-primary-container text-on-primary-container shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Soil Moisture
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('vigor')}
                className={`px-3 py-1.5 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all ${
                  activeLayer === 'vigor'
                    ? 'bg-primary-container text-on-primary-container shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Canopy Vigor
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('irrigation')}
                className={`px-3 py-1.5 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all ${
                  activeLayer === 'irrigation'
                    ? 'bg-primary-container text-on-primary-container shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Irrigation Vectors
              </button>
            </div>
          </div>

          {/* Panoramic 3D Farm Digital Twin Panel */}
          <div className="relative w-full rounded-3xl bg-surface-container/50 border border-primary/20 backdrop-blur-2xl overflow-hidden shadow-2xl p-5 min-h-[380px] flex flex-col justify-between">
            <div className="absolute inset-0 w-full h-full pointer-events-auto">
              <FarmTerrainTwin height={380} cropName={primaryCrop} />
            </div>

            {/* Holographic Data Badges */}
            <div className="relative z-10 flex items-start justify-between flex-wrap gap-3 pointer-events-none">
              <div className="flex flex-wrap gap-2.5 max-w-2xl pointer-events-auto">
                <div className="bg-surface-container-lowest/90 border border-primary/20 backdrop-blur-xl px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex flex-col">
                    <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold">Sector Alpha</span>
                    <span className="font-body-sm text-xs font-semibold text-on-surface">{context.landSizeAcres || 5.5} Acres</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest/90 border border-secondary/20 backdrop-blur-xl px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <div className="flex flex-col">
                    <span className="font-label-code-sm text-[10px] text-secondary uppercase font-bold">{primaryCrop}</span>
                    <span className="font-body-sm text-xs font-semibold text-on-surface">Canopy Vigor 89%</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest/90 border border-outline-variant/25 backdrop-blur-xl px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-primary-fixed-dim" />
                  <div className="flex flex-col">
                    <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase font-bold">Water Source</span>
                    <span className="font-body-sm text-xs font-semibold text-on-surface">Perennial Canal / Well</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest/90 border border-error/30 backdrop-blur-xl px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                  <div className="flex flex-col">
                    <span className="font-label-code-sm text-[10px] text-error uppercase font-bold">Drainage Alert</span>
                    <span className="font-body-sm text-xs font-semibold text-on-surface">+18mm Rain Spike</span>
                  </div>
                </div>
              </div>

              {/* Drone Status */}
              <div className="bg-surface-container-lowest/90 border border-primary/20 backdrop-blur-xl p-2.5 rounded-xl shadow-xl flex items-center gap-3 pointer-events-auto">
                <span className="material-symbols-outlined text-primary text-xl">satellite_alt</span>
                <div className="flex flex-col">
                  <span className="font-label-code-sm text-[10px] text-on-surface uppercase font-bold">Sentinel-2B Pass</span>
                  <span className="font-caption text-[10px] text-primary font-mono">Altitude 42m • Lidar Active</span>
                </div>
              </div>
            </div>

            {/* Bottom Legend */}
            <div className="relative z-10 pt-28 flex items-center justify-between text-on-surface-variant flex-wrap gap-4 pointer-events-none">
              <div className="flex items-center gap-4 font-label-code-sm text-[11px] pointer-events-auto">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" /> Optimal Biomass
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> Hydrated
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error" /> Drainage Risk
                </span>
              </div>
              <span className="font-label-code-sm text-[10px] text-primary uppercase font-mono tracking-wider">
                Twin Matrix Synced // 60 FPS
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: INTELLIGENCE MODULES MATRIX (12 Sub-Systems) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-code-sm text-xs text-primary uppercase tracking-widest font-bold">
                Orbital &amp; Autonomous Subsystems
              </span>
              <h2 className="font-headline-md text-xl font-bold text-on-surface">Intelligence Modules</h2>
            </div>
            <span className="font-label-code-sm text-xs text-on-surface-variant font-mono">12 Operational Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Module 1: Weather Intelligence */}
            <Link
              href="/weather"
              className="p-5 rounded-2xl bg-surface-container/70 border border-primary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-primary uppercase font-bold">Weather Intel</span>
                  <span className="material-symbols-outlined text-primary text-xl group-hover:rotate-12 transition-transform">
                    thermostat
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-2xl font-bold text-on-surface">
                    {weatherData?.current.temperature_c ?? 28}°C
                  </span>
                  <span className="font-caption text-xs text-error font-medium">Rain forecasted</span>
                </div>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Doppler radar, 5-day cycle &amp; wind velocity.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-primary font-semibold">
                <span>Inspect Forecast</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 2: Crop Intelligence */}
            <Link
              href="/crops"
              className="p-5 rounded-2xl bg-surface-container/70 border border-secondary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-secondary uppercase font-bold">Crop Intelligence</span>
                  <span className="material-symbols-outlined text-secondary text-xl group-hover:scale-110 transition-transform">
                    grain
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-sm text-base font-bold text-on-surface">{primaryCrop}</span>
                  <span className="font-headline-sm text-base font-bold text-secondary">87% Fit</span>
                </div>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Soil-specific yield suitability &amp; planting timeline.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-secondary font-semibold">
                <span>View Recommendations</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 3: AI Crop Doctor */}
            <Link
              href="/crop-doctor"
              className="p-5 rounded-2xl bg-surface-container/70 border border-primary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-primary uppercase font-bold">AI Crop Doctor</span>
                  <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">
                    document_scanner
                  </span>
                </div>
                <span className="font-headline-sm text-base font-bold text-on-surface">Neural Scanner</span>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Visual leaf diagnostics, blight detection &amp; organic remedies.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-primary font-semibold">
                <span>Scan Plant Photo</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 4: AI Input Advisor */}
            <Link
              href="/input-advisor"
              className="p-5 rounded-2xl bg-surface-container/70 border border-tertiary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-tertiary uppercase font-bold">Input Advisor</span>
                  <span className="material-symbols-outlined text-tertiary text-xl group-hover:scale-110 transition-transform">
                    science
                  </span>
                </div>
                <span className="font-headline-sm text-base font-bold text-on-surface">Nutrient Matrix</span>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  NPK fertilization schedule, bio-compost &amp; soil health.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-tertiary font-semibold">
                <span>Optimize Nutrients</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 5: Weather Protection Center */}
            <Link
              href="/weather-protection"
              className="p-5 rounded-2xl bg-surface-container/70 border border-error/30 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-error uppercase font-bold">Weather Protection</span>
                  <span className="material-symbols-outlined text-error text-xl">water_damage</span>
                </div>
                <span className="font-headline-sm text-base font-bold text-on-surface">Drainage Action</span>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Crop protection protocols for heavy rains, flood &amp; heatwaves.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-error font-semibold">
                <span>View Risk Mitigation</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 6: Labor Marketplace */}
            <Link
              href="/labor"
              className="p-5 rounded-2xl bg-surface-container/70 border border-secondary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-secondary uppercase font-bold">Labor Force</span>
                  <span className="material-symbols-outlined text-secondary text-xl">engineering</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-sm text-base font-bold text-on-surface">8 Workers</span>
                  <span className="font-label-code-sm text-xs text-secondary font-mono">5 km radial</span>
                </div>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Instant booking for harvesting, weeding, spraying &amp; tilling.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-secondary font-semibold">
                <span>Find &amp; Book Labor</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 7: Farmer Community & Peer Match */}
            <Link
              href="/farmers"
              className="p-5 rounded-2xl bg-surface-container/70 border border-primary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-primary uppercase font-bold">Find a Farmer</span>
                  <span className="material-symbols-outlined text-primary text-xl">person_search</span>
                </div>
                <span className="font-headline-sm text-base font-bold text-on-surface">Peer Match AI</span>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Connect with farmers who grow your crop or solved your exact problem.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-primary font-semibold">
                <span>Find Peer Match</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 8: Farm Marketplace */}
            <Link
              href="/marketplace"
              className="p-5 rounded-2xl bg-surface-container/70 border border-primary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-primary uppercase font-bold">Marketplace</span>
                  <span className="material-symbols-outlined text-primary text-xl">storefront</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-sm text-base font-bold text-on-surface">3 Active Buyers</span>
                  <span className="font-label-code-sm text-xs text-primary font-mono">₹38/kg</span>
                </div>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Certified seeds, fertilizers, equipment, produce lots &amp; services.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-primary font-semibold">
                <span>Browse Exchange</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 9: Farm Profit Simulator */}
            <Link
              href="/profit"
              className="p-5 rounded-2xl bg-surface-container/70 border border-secondary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-secondary uppercase font-bold">Profit Simulator</span>
                  <span className="material-symbols-outlined text-secondary text-xl">calculate</span>
                </div>
                <span className="font-headline-sm text-base font-bold text-on-surface">Financial Modeling</span>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Deterministic input vs revenue calculus with Gemini scenario insights.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-secondary font-semibold">
                <span>Simulate ROI</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 10: Farm Calendar */}
            <Link
              href="/calendar"
              className="p-5 rounded-2xl bg-surface-container/70 border border-tertiary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-tertiary uppercase font-bold">Farm Calendar</span>
                  <span className="material-symbols-outlined text-tertiary text-xl">calendar_month</span>
                </div>
                <span className="font-headline-sm text-base font-bold text-on-surface">Seasonal Timeline</span>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Sowing, irrigation, weeding, pesticide &amp; harvesting milestones.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-tertiary font-semibold">
                <span>Open Schedule</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 11: Livestock AI Ecosystem */}
            <Link
              href="/livestock"
              className="p-5 rounded-2xl bg-surface-container/70 border border-primary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-primary uppercase font-bold">Livestock AI</span>
                  <span className="material-symbols-outlined text-primary text-xl">pets</span>
                </div>
                <span className="font-headline-sm text-base font-bold text-on-surface">Herd Vitals</span>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Cattle, goat, poultry nutrition, disease prevention &amp; vet protocols.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-primary font-semibold">
                <span>View Herd Health</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>

            {/* Module 12: Business Opportunities */}
            <Link
              href="/business"
              className="p-5 rounded-2xl bg-surface-container/70 border border-secondary/20 backdrop-blur-xl hover:bg-surface-container-high transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-code-sm text-xs text-secondary uppercase font-bold">Business Deals</span>
                  <span className="material-symbols-outlined text-secondary text-xl">handshake</span>
                </div>
                <span className="font-headline-sm text-base font-bold text-on-surface">Enterprise Links</span>
                <p className="font-caption text-xs text-on-surface-variant mt-2">
                  Contract farming, bulk grain procurement &amp; corporate partnerships.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-secondary font-semibold">
                <span>Explore Deals</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </StitchShell>
  )
}
