'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { FarmTerrainTwin } from '@/components/three/farm-terrain-twin'
import { useFarmContext } from '@/hooks/use-farm-context'

export default function FarmSetupPage() {
  const router = useRouter()
  const { context, updateContext } = useFarmContext()

  // Local form state initialized from persistent farm context
  const [location, setLocation] = useState(context.location || 'Thanjavur Agri-Corridor, Plot 4B')
  const [landSize, setLandSize] = useState(context.landSizeAcres ? String(context.landSizeAcres) : '5.5')
  const [unit, setUnit] = useState<'acres' | 'hectares'>('acres')
  const [soilType, setSoilType] = useState(context.soilType || 'Loamy')
  const [waterAvailability, setWaterAvailability] = useState<'high' | 'moderate' | 'low'>(
    context.waterAvailability || 'moderate'
  )
  const [currentCrop, setCurrentCrop] = useState(context.primaryCrop || 'Paddy (Rice)')
  const [plannedCrop, setPlannedCrop] = useState('High-Yield Hybrid Pulses')
  const [season, setSeason] = useState(context.season || 'Kharif')
  const [budget, setBudget] = useState('1,50,000')
  const [livestock, setLivestock] = useState<string[]>(['Cattle', 'Goat'])
  const [language, setLanguage] = useState('English')
  const [saving, setSaving] = useState(false)

  const toggleLivestock = (item: string) => {
    if (item === 'None') {
      setLivestock(['None'])
      return
    }
    setLivestock((prev) => {
      const filtered = prev.filter((i) => i !== 'None')
      return filtered.includes(item) ? filtered.filter((i) => i !== item) : [...filtered, item]
    })
  }

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4)
          const lng = pos.coords.longitude.toFixed(4)
          setLocation(`Geotagged Sector [${lat}° N, ${lng}° E]`)
          toast.success('Geotag locked to current GPS position')
        },
        () => {
          toast.info('GPS unavailable, using default Thanjavur node')
          setLocation('Thanjavur Agri-Sector, Tamil Nadu')
        }
      )
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    updateContext({
      location,
      district: location.split(',')[0]?.trim(),
      soilType,
      landSizeAcres: parseFloat(landSize) || 5,
      waterAvailability,
      season,
      primaryCrop: currentCrop,
      livestock: livestock.join(', '),
      additionalNotes: `Planned: ${plannedCrop}. Budget: ₹${budget}. Dialect: ${language}`,
    })

    toast.success('Farm Profile calibrated & synchronized with Gemini AI')
    setTimeout(() => {
      router.push('/dashboard')
    }, 600)
  }

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
        {/* Top System Sub-Bar / Vector Telemetry Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2.5 px-5 rounded-2xl bg-surface-container-low/70 backdrop-blur-xl border border-primary/20">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-container-highest/80 text-on-surface font-label-code-sm text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              SYS.NODE // ORBITAL-SYNC: STABLE
            </span>
            <span className="hidden md:inline-block font-label-code-sm text-xs text-outline font-mono">
              LATENCY: 12ms // BANDWIDTH: 4.8 GB/s
            </span>
          </div>

          <div className="flex items-center gap-6 font-label-code-sm text-xs text-on-surface-variant uppercase">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">satellite_alt</span>
              SAT-LINK: ACTIVE
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-secondary">memory</span>
              NEURAL MESH v4.9
            </span>
          </div>
        </div>

        {/* Main Content Split Grid: 7 Cols Left Hologram / 5 Cols Right Translucent Intake Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT REGION: 3D Agricultural Hologram & Telemetry Hub */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 text-primary font-label-code-sm text-xs tracking-widest uppercase font-bold">
                <span className="material-symbols-outlined text-base">radar</span>
                Spatial Agronomic Twin
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Your farm, <span className="text-primary font-bold">understood.</span>
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Configure your field parameters so Bhoomi Mithra AI initializes real-time canopy modelling, micro-climates, and predictive yield calculus.
              </p>
            </div>

            {/* 3D Scene Viewport with HUD Overlays */}
            <div className="relative w-full rounded-3xl bg-surface-container-low/70 backdrop-blur-2xl border border-primary/25 p-3 shadow-[0_20px_50px_rgba(16,8,40,0.8)] overflow-hidden">
              {/* Corner Reticles */}
              <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-primary/40 pointer-events-none z-20" />
              <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-primary/40 pointer-events-none z-20" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-primary/40 pointer-events-none z-20" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-primary/40 pointer-events-none z-20" />

              {/* Three.js Farm Platform */}
              <div className="w-full h-[520px] rounded-2xl relative overflow-hidden bg-surface-container-lowest">
                <FarmTerrainTwin height={520} cropName={currentCrop} />

                {/* HUD 1: Soil Strata Data (Top Left) */}
                <div className="absolute top-6 left-6 z-20 max-w-[280px] p-3 rounded-xl bg-surface-container-lowest/85 backdrop-blur-md border border-primary/20 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-lg">layers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-code-sm text-xs text-on-surface uppercase font-bold">SOIL MATRIX</span>
                    <span className="font-label-code-sm text-[10px] text-on-surface-variant">
                      {soilType.toUpperCase()} • OPTIMAL SATURATION 74%
                    </span>
                  </div>
                </div>

                {/* HUD 2: Precipitation (Top Right) */}
                <div className="absolute top-6 right-6 z-20 max-w-[280px] p-3 rounded-xl bg-surface-container-lowest/85 backdrop-blur-md border border-primary/20 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-lg">water_drop</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-code-sm text-xs text-on-surface uppercase font-bold">PRECIPITATION</span>
                    <span className="font-label-code-sm text-[10px] text-on-surface-variant">14.2 MM/WK • MONSOON CYCLE</span>
                  </div>
                </div>

                {/* HUD 3: Crop Bio-Signal (Bottom Left) */}
                <div className="absolute bottom-16 left-6 z-20 max-w-[290px] p-3 rounded-xl bg-surface-container-lowest/85 backdrop-blur-md border border-primary/20 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-lg">ecg_heart</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-code-sm text-xs text-primary uppercase font-bold">CROP SIGNAL</span>
                    <span className="font-label-code-sm text-[10px] text-on-surface">
                      {currentCrop.toUpperCase()} • VIGOR 89%
                    </span>
                  </div>
                </div>

                {/* HUD 4: Geolocation Coordinates (Bottom Right) */}
                <div className="absolute bottom-16 right-6 z-20 p-3 rounded-xl bg-surface-container-lowest/85 backdrop-blur-md border border-primary/20 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-lg">my_location</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-code-sm text-xs text-on-surface uppercase font-bold">GEO-SYNC LOCK</span>
                    <span className="font-label-code-sm text-[10px] text-on-surface-variant">LAT: 10.787° N • LON: 79.137° E</span>
                  </div>
                </div>

                {/* HUD 5: Live AI Pre-calibration Pill (Bottom Center) */}
                <div className="absolute bottom-4 inset-x-8 z-20 flex justify-center">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-surface-container/90 backdrop-blur-lg border border-primary/30 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                    <span className="font-label-code-sm text-xs text-on-surface uppercase tracking-wider font-bold">
                      AI SOIL &amp; CANOPY PRE-CALIBRATION RUNNING...
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Metric Strip */}
              <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/20 flex flex-col">
                  <span className="font-label-code-sm text-[10px] text-outline uppercase font-mono">Spectral Refl.</span>
                  <span className="font-label-code-lg text-sm text-on-surface mt-0.5">824 nm (NIR)</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/20 flex flex-col">
                  <span className="font-label-code-sm text-[10px] text-outline uppercase font-mono">Canopy Cover</span>
                  <span className="font-label-code-lg text-sm text-primary mt-0.5">64.3% Est.</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/20 flex flex-col">
                  <span className="font-label-code-sm text-[10px] text-outline uppercase font-mono">Osmotic Tension</span>
                  <span className="font-label-code-lg text-sm text-secondary mt-0.5">-31.4 kPa</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT REGION: Translucent Glass Onboarding Panel */}
          <div className="lg:col-span-5 w-full bg-surface-container-low/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-primary/25 shadow-[0_24px_50px_rgba(5,3,10,0.85)] flex flex-col gap-7">
            {/* Step Hierarchy */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-label-code-lg text-sm">
                  <span className="text-outline font-mono">01</span>
                  <span className="w-4 h-px bg-outline-variant" />
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold font-mono">02</span>
                  <span className="w-4 h-px bg-outline-variant" />
                  <span className="text-outline font-mono">03</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary-container/20 text-primary text-xs font-label-code-sm uppercase tracking-wider font-bold">
                  Step 02 // Farm Profile
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-headline-md text-2xl text-on-surface font-bold">Tell us about your farm</h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Configure autonomous agronomy parameters, soil strata, and bio-canopy matrix.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-6">
              {/* FIELD 1: Location */}
              <div className="flex flex-col gap-2">
                <label className="font-label-code-sm text-xs uppercase text-on-surface tracking-wider flex items-center justify-between">
                  <span>Location Parameters</span>
                  <span className="text-outline lowercase font-mono">geo-precision: 0.1m</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-primary text-xl pointer-events-none">
                    location_searching
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search village, town or district"
                    className="w-full h-11 pl-11 pr-36 rounded-xl bg-surface-container-lowest/80 border border-primary/20 text-on-surface placeholder:text-outline font-body-sm text-sm focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-label-code-sm text-[10px] uppercase flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">near_me</span>
                    Use GPS
                  </button>
                </div>
              </div>

              {/* FIELD 2: Farm Size */}
              <div className="flex flex-col gap-2">
                <label className="font-label-code-sm text-xs uppercase text-on-surface tracking-wider">
                  Farm Size
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    placeholder="Enter acreage"
                    className="flex-1 h-11 px-4 rounded-xl bg-surface-container-lowest/80 border border-primary/20 text-on-surface font-label-code-lg text-sm focus:outline-none focus:border-primary transition-all font-mono"
                  />
                  <div className="flex rounded-xl bg-surface-container-lowest/90 border border-outline-variant/30 p-1">
                    <button
                      type="button"
                      onClick={() => setUnit('acres')}
                      className={`px-4 py-2 rounded-lg font-label-code-sm text-xs uppercase font-bold transition-all ${
                        unit === 'acres'
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Acres
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('hectares')}
                      className={`px-4 py-2 rounded-lg font-label-code-sm text-xs uppercase font-bold transition-all ${
                        unit === 'hectares'
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Hectares
                    </button>
                  </div>
                </div>
              </div>

              {/* FIELD 3: Soil Type */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-code-sm text-xs uppercase text-on-surface tracking-wider">
                    Soil Type
                  </label>
                  <span className="font-label-code-sm text-[10px] text-secondary flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-xs">auto_awesome</span> Optical Estimate: {soilType}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Sandy', 'Clay', 'Loamy', 'Black Soil', 'Red Soil', 'Not Sure'].map((type) => {
                    const isSelected = soilType.toLowerCase() === type.toLowerCase()
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSoilType(type)}
                        className={`px-3 py-2.5 rounded-xl text-left font-body-sm text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-primary/25 border border-primary text-primary font-bold shadow-[0_0_15px_rgba(198,192,255,0.25)]'
                            : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <span>{type}</span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary' : 'bg-outline-variant'}`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* FIELD 4: Water Availability */}
              <div className="flex flex-col gap-2">
                <label className="font-label-code-sm text-xs uppercase text-on-surface tracking-wider">
                  Water Availability
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  <div
                    onClick={() => setWaterAvailability('high')}
                    className={`cursor-pointer p-3.5 rounded-2xl transition-all flex items-center justify-between ${
                      waterAvailability === 'high'
                        ? 'bg-primary/20 border border-primary shadow-[0_0_20px_rgba(198,192,255,0.2)]'
                        : 'bg-surface-container-lowest/80 border border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined text-xl">water</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-xs text-on-surface font-bold">Good / High</span>
                        <span className="font-caption text-[11px] text-on-surface-variant">
                          Perennial borewell &amp; canal irrigation
                        </span>
                      </div>
                    </div>
                    {waterAvailability === 'high' && (
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined text-xs">check</span>
                      </span>
                    )}
                  </div>

                  <div
                    onClick={() => setWaterAvailability('moderate')}
                    className={`cursor-pointer p-3.5 rounded-2xl transition-all flex items-center justify-between ${
                      waterAvailability === 'moderate'
                        ? 'bg-primary/20 border border-primary shadow-[0_0_20px_rgba(198,192,255,0.2)]'
                        : 'bg-surface-container-lowest/80 border border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-xl">opacity</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-xs text-on-surface font-bold">Moderate</span>
                        <span className="font-caption text-[11px] text-on-surface-variant">
                          Seasonal rainwater &amp; shared well access
                        </span>
                      </div>
                    </div>
                    {waterAvailability === 'moderate' && (
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined text-xs">check</span>
                      </span>
                    )}
                  </div>

                  <div
                    onClick={() => setWaterAvailability('low')}
                    className={`cursor-pointer p-3.5 rounded-2xl transition-all flex items-center justify-between ${
                      waterAvailability === 'low'
                        ? 'bg-primary/20 border border-primary shadow-[0_0_20px_rgba(198,192,255,0.2)]'
                        : 'bg-surface-container-lowest/80 border border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-xl">grain</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-xs text-on-surface font-bold">Limited</span>
                        <span className="font-caption text-[11px] text-outline">
                          Dryland / strictly rainfall-dependent
                        </span>
                      </div>
                    </div>
                    {waterAvailability === 'low' && (
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined text-xs">check</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* FIELD 5 & 6: Current & Planned Crops */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-code-sm text-xs uppercase text-on-surface tracking-wider">
                    Current Crop
                  </label>
                  <input
                    type="text"
                    value={currentCrop}
                    onChange={(e) => setCurrentCrop(e.target.value)}
                    placeholder="e.g. Paddy (Rice), Cotton"
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-primary/20 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-code-sm text-xs uppercase text-on-surface tracking-wider">
                    Planned Crop
                  </label>
                  <input
                    type="text"
                    value={plannedCrop}
                    onChange={(e) => setPlannedCrop(e.target.value)}
                    placeholder="e.g. Tomato, Millet"
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-primary/20 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* FIELD 7: Cropping Season */}
              <div className="flex flex-col gap-2">
                <label className="font-label-code-sm text-xs uppercase text-on-surface tracking-wider">
                  Current Season
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Kharif', 'Rabi', 'Summer', 'Samba'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeason(s)}
                      className={`py-2 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all ${
                        season === s
                          ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(198,192,255,0.3)]'
                          : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* FIELD 8: Farming Budget */}
              <div className="flex flex-col gap-2">
                <label className="font-label-code-sm text-xs uppercase text-on-surface tracking-wider">
                  Farming Budget
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-label-code-lg text-sm text-primary font-bold font-mono">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Estimated budget"
                    className="w-full h-11 pl-9 pr-24 rounded-xl bg-surface-container-lowest/80 border border-primary/20 text-on-surface font-label-code-lg text-sm focus:outline-none focus:border-primary font-mono"
                  />
                  <span className="absolute right-4 font-label-code-sm text-[11px] text-outline font-mono">
                    INR
                  </span>
                </div>
              </div>

              {/* FIELD 9: Livestock */}
              <div className="flex flex-col gap-2">
                <label className="font-label-code-sm text-xs uppercase text-on-surface tracking-wider">
                  Livestock on Farm
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Poultry', 'None'].map((animal) => {
                    const isSelected = livestock.includes(animal)
                    return (
                      <button
                        key={animal}
                        type="button"
                        onClick={() => toggleLivestock(animal)}
                        className={`px-3.5 py-1.5 rounded-xl font-body-sm text-xs flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-primary/25 border border-primary text-primary font-bold shadow-sm'
                            : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-sm">check</span>
                        )}
                        <span>{animal}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/30">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full h-13 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary-container text-on-primary font-headline-sm text-xs uppercase tracking-wider font-bold shadow-[0_0_30px_rgba(198,192,255,0.35)] hover:shadow-[0_0_45px_rgba(198,192,255,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <span>{saving ? 'Synchronizing Bio-Canopy...' : 'Build My Farm Profile'}</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>

                <div className="flex items-center justify-center">
                  <Link
                    href="/dashboard"
                    className="font-body-sm text-xs text-secondary hover:underline transition-all"
                  >
                    I&apos;ll complete this later →
                  </Link>
                </div>

                <div className="mt-2 p-3 rounded-xl bg-surface-container-lowest/60 border border-outline-variant/20 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base shrink-0">lock</span>
                  <span className="font-caption text-[10px] text-outline leading-normal">
                    Your agronomic parameters are utilized exclusively for autonomous canopy optimization. Protected by Enterprise sovereign encryption.
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
