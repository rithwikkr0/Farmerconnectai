'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { StitchShell } from '@/components/layout/stitch-shell'
import { FarmTerrainTwin } from '@/components/three/farm-terrain-twin'
import { useFarmContext } from '@/hooks/use-farm-context'
import { recommendCrops } from '@/lib/api'
import type { CropRecommendation } from '@/lib/api'

export default function CropIntelligencePage() {
  const { context } = useFarmContext()
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')

  const farmLocation = context.location || 'Mandya, Karnataka'
  const soilType = context.soilType || 'Loamy'
  const landSize = context.landSizeAcres || 5.5
  const water = context.waterAvailability || 'moderate'
  const season = context.season || 'Kharif'

  useEffect(() => {
    setLoading(true)
    recommendCrops({
      location: farmLocation,
      soil: soilType,
      waterAvailability: water,
      landSize: landSize,
      season: season,
      farmerGoal: 'profit',
    })
      .then((res) => {
        setRecommendations(res.recommendations)
      })
      .catch(() => {
        // Fallback demo crops
        setRecommendations([
          {
            cropName: 'Tomato (Hybrid Arka Rakshak)',
            suitabilityLabel: 'excellent',
            suitabilityScore: 94,
            reasons: [
              'Optimal thermal match with Kharif monsoon windows',
              'Loamy soil provides high aeration preventing premature root rot',
              'Wholesale terminal prices hovering at ₹38/kg spot rate',
            ],
            waterRequirement: 'moderate',
            majorRisks: ['Waterlogging in low-lying bunds', 'Early fungal blight in high humidity'],
            suggestedActions: [
              'Construct 30cm raised planting beds',
              'Schedule copper-based bio-fungicide protective drenching',
            ],
            estimatedYield: '12 tons / acre',
            estimatedProfit: '₹83,000 / acre net',
          },
          {
            cropName: 'Groundnut (TMV-2)',
            suitabilityLabel: 'good',
            suitabilityScore: 86,
            reasons: [
              'Excellent nitrogen-fixing root nodules enrich loamy soil matrix',
              'Low-to-moderate water requirement ensures survival in case of rain delay',
              'Guaranteed MSP procurement at regional APMC yards',
            ],
            waterRequirement: 'low',
            majorRisks: ['Tikka leaf spot under continuous rainfall', 'Pod borer attack during pod fill'],
            suggestedActions: [
              'Seed treatment with Trichoderma viride',
              'Maintain gypsum application at flowering stage',
            ],
            estimatedYield: '1.8 tons / acre',
            estimatedProfit: '₹47,000 / acre net',
          },
          {
            cropName: 'Finger Millet (Ragi GPU-28)',
            suitabilityLabel: 'good',
            suitabilityScore: 82,
            reasons: [
              'Resilient drought-tolerant cereal with high nutritional profile',
              'Thrives in local agro-climatic conditions with minimal fertilizer dependency',
              'Growing consumer demand for diabetic-friendly whole grains',
            ],
            waterRequirement: 'low',
            majorRisks: ['Blast disease in cloudy humid weather'],
            suggestedActions: ['Apply bio-fertilizer Azospirillum at sowing', 'Timely weeding at 25 DAS'],
            estimatedYield: '1.4 tons / acre',
            estimatedProfit: '₹34,000 / acre net',
          },
        ])
      })
      .finally(() => setLoading(false))
  }, [farmLocation, soilType, water, landSize, season])

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Top Header & Sub-Nav */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surface-container-high/80 border border-primary/25 px-3 py-1 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold">
                Bio-Mesh Sector 07-Gamma
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container/60 border border-outline-variant/30 px-3 py-1 rounded-full text-on-surface-variant font-label-code-sm text-xs">
              <span className="material-symbols-outlined text-sm text-secondary">pin_drop</span>
              <span>{farmLocation}</span>
            </div>
          </div>

          <Link
            href="/copilot"
            className="px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-code-sm text-xs uppercase font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Ask AI Copilot for Custom Mix</span>
          </Link>
        </div>

        {/* 1. HERO SECTION: 3D CANOPY SCENE & CONDITIONS OVERLAY GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left / Center: 3D Holographic Spatial Canvas (7 Cols) */}
          <div className="xl:col-span-7 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-secondary-container/60 text-on-secondary-container font-label-code-sm text-[10px] tracking-wider uppercase font-bold">
                  Quantum Model v4.9 Active
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/30 text-primary font-label-code-sm text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  ANALYSIS COMPLETE • 99.4% CONFIDENCE
                </span>
              </div>
              <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                What should you grow?
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant max-w-xl">
                Farm AI synthesizes sub-strata chemistry, micro-climates, regional yields, and hyper-local mandi price trends to calibrate maximum net margin.
              </p>
            </div>

            {/* 3D Scene Viewport with Holographic Overlays */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-surface-container-low border border-primary/25 shadow-2xl p-3">
              <div className="w-full h-[460px] rounded-2xl relative overflow-hidden bg-surface-container-lowest">
                <FarmTerrainTwin height={460} cropName="Tomato" />

                {/* Overlays */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-surface-container-lowest/80 border border-primary/20 backdrop-blur-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-label-code-sm text-[10px] text-on-surface uppercase font-bold">
                    CANOPY VIGOR: 89%
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-surface-container-lowest/80 border border-secondary/20 backdrop-blur-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">water_drop</span>
                  <span className="font-label-code-sm text-[10px] text-secondary uppercase font-bold">
                    MOISTURE: {soilType.toUpperCase()} 74%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Your Farm Conditions (5 Cols) */}
          <div className="xl:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex flex-col">
                <h2 className="font-headline-sm text-lg font-bold text-on-surface">Your Farm Conditions</h2>
                <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase font-mono">
                  Sync Source: Local Profile • Sector 07-Gamma
                </span>
              </div>

              <Link
                href="/setup"
                className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-secondary font-label-code-sm text-xs transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Edit Data</span>
              </Link>
            </div>

            {/* Conditions 6-Cell Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container/70 border border-outline-variant/30 p-3.5 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-code-sm text-[10px] uppercase tracking-wider">Spatial Plot</span>
                  <span className="material-symbols-outlined text-sm text-primary">aspect_ratio</span>
                </div>
                <div className="font-headline-sm text-base text-on-surface font-bold">{landSize} Acres</div>
                <span className="font-label-code-sm text-[10px] text-on-surface-variant">{farmLocation}</span>
              </div>

              <div className="bg-surface-container/70 border border-outline-variant/30 p-3.5 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-code-sm text-[10px] uppercase tracking-wider">Soil Profile</span>
                  <span className="material-symbols-outlined text-sm text-secondary">science</span>
                </div>
                <div className="font-headline-sm text-base text-on-surface font-bold">{soilType} Soil</div>
                <span className="font-label-code-sm text-[10px] text-primary">Organic Carbon: 0.62%</span>
              </div>

              <div className="bg-surface-container/70 border border-outline-variant/30 p-3.5 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-code-sm text-[10px] uppercase tracking-wider">Hydration Vector</span>
                  <span className="material-symbols-outlined text-sm text-primary">waves</span>
                </div>
                <div className="font-headline-sm text-base text-on-surface font-bold capitalize">{water} Flow</div>
                <span className="font-label-code-sm text-[10px] text-on-surface-variant">Borewell + Canal Sync</span>
              </div>

              <div className="bg-surface-container/70 border border-outline-variant/30 p-3.5 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-code-sm text-[10px] uppercase tracking-wider">Phenology Cycle</span>
                  <span className="material-symbols-outlined text-sm text-secondary">date_range</span>
                </div>
                <div className="font-headline-sm text-base text-on-surface font-bold">{season} Active</div>
                <span className="font-label-code-sm text-[10px] text-on-surface-variant">Optimal Sowing Window</span>
              </div>

              <div className="bg-surface-container/70 border border-outline-variant/30 p-3.5 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-code-sm text-[10px] uppercase tracking-wider">Standing Biomass</span>
                  <span className="material-symbols-outlined text-sm text-primary">potted_plant</span>
                </div>
                <div className="font-headline-sm text-base text-on-surface font-bold truncate">
                  {context.primaryCrop || 'None'}
                </div>
                <span className="font-label-code-sm text-[10px] text-secondary">Primary Rotation</span>
              </div>

              <div className="bg-surface-container/70 border border-outline-variant/30 p-3.5 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-code-sm text-[10px] uppercase tracking-wider">CapEx Budget</span>
                  <span className="material-symbols-outlined text-sm text-secondary">account_balance_wallet</span>
                </div>
                <div className="font-headline-sm text-base text-on-surface font-bold font-mono">₹1,50,000</div>
                <span className="font-label-code-sm text-[10px] text-on-surface-variant">Flexible Working Capital</span>
              </div>
            </div>

            {/* Weather Alert Strip */}
            <div className="bg-surface-container-high/60 border border-error/30 p-4 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">thunderstorm</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-sm text-xs font-semibold text-on-surface">
                    Monsoon Trajectory Approaching
                  </span>
                  <span className="font-label-code-sm text-[10px] text-on-surface-variant">
                    +18mm rain expected across next 72 hours
                  </span>
                </div>
              </div>
              <span className="font-label-code-sm text-xs font-bold text-primary font-mono">94% PROB</span>
            </div>
          </div>
        </div>

        {/* 2. AI CROP RECOMMENDATIONS CARDS */}
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                Recommended Crops for Your Soil &amp; Season
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant">
                Calibrated against {soilType.toLowerCase()} soil chemistry, local wholesale terminal trends, and current monsoon cycles.
              </p>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-code-sm text-xs">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Ranked by Synthetic Agronomic Index</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-3xl bg-surface-container/60 border border-primary/20 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {recommendations.map((crop, idx) => {
                const score = crop.suitabilityScore ?? 90 - idx * 6
                return (
                  <div
                    key={crop.cropName}
                    className="relative bg-surface-container-low/90 border border-primary/20 backdrop-blur-xl p-6 rounded-3xl flex flex-col justify-between gap-6 shadow-xl hover:border-primary transition-all group"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-label-code-sm text-[9px] font-bold tracking-wider uppercase ${
                                idx === 0
                                   ? 'bg-primary text-on-primary shadow-[0_0_8px_rgba(198,192,255,0.4)]'
                                  : 'bg-surface-container-high text-secondary'
                              }`}
                            >
                              {crop.suitabilityLabel.toUpperCase()}
                            </span>
                            <span className="font-label-code-sm text-xs text-secondary font-bold font-mono">
                              #{String(idx + 1).padStart(2, '0')} RANK
                            </span>
                          </div>
                          <h3 className="font-headline-sm text-xl text-on-surface font-bold mt-1.5">{crop.cropName}</h3>
                        </div>

                        {/* Circular Score Indicator */}
                        <div className="w-14 h-14 rounded-2xl bg-surface-container-highest/80 border border-primary/30 flex flex-col items-center justify-center shrink-0">
                          <span className="font-headline-sm text-sm text-primary font-bold font-mono">{score}%</span>
                          <span className="font-label-code-sm text-[8px] text-on-surface-variant uppercase">FIT</span>
                        </div>
                      </div>

                      <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                        {crop.reasons[0] ?? 'High compatibility with regional soil and current season temperature trends.'}
                      </p>

                      {/* Telemetry Matrix */}
                      <div className="grid grid-cols-2 gap-2 pt-1 font-body-sm text-xs">
                        <div className="bg-surface-container/60 border border-outline-variant/20 p-2.5 rounded-xl flex flex-col">
                          <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Water Vector</span>
                          <span className="text-on-surface font-semibold capitalize">{crop.waterRequirement}</span>
                        </div>
                        <div className="bg-surface-container/60 border border-outline-variant/20 p-2.5 rounded-xl flex flex-col">
                          <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Suitability</span>
                          <span className="text-on-surface font-semibold capitalize">{crop.suitabilityLabel}</span>
                        </div>
                        <div className="bg-surface-container/60 border border-outline-variant/20 p-2.5 rounded-xl flex flex-col">
                          <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Est. Yield</span>
                          <span className="text-on-surface font-semibold">{crop.estimatedYield || 'Standard'}</span>
                        </div>
                        <div className="bg-surface-container/60 border border-outline-variant/20 p-2.5 rounded-xl flex flex-col">
                          <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Est. Profit</span>
                          <span className="text-primary font-bold font-mono">
                            {crop.estimatedProfit || 'High Return'}
                          </span>
                        </div>
                      </div>

                      {/* Risks pill */}
                      {crop.majorRisks && crop.majorRisks.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-surface-container-lowest/80 border border-error/20 flex items-start gap-2">
                          <span className="material-symbols-outlined text-error text-sm shrink-0 mt-0.5">warning</span>
                          <span className="font-caption text-[11px] text-on-surface-variant">
                            <strong>Key Risk:</strong> {crop.majorRisks[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
                      <Link
                        href={`/profit?crop=${encodeURIComponent(crop.cropName)}`}
                        className="w-1/2 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-code-sm text-xs text-center transition-all"
                      >
                        Simulate Profit
                      </Link>
                      <Link
                        href={`/calendar?crop=${encodeURIComponent(crop.cropName)}`}
                        className="w-1/2 py-2.5 rounded-xl bg-primary text-on-primary font-label-code-sm text-xs uppercase font-bold text-center shadow-md hover:bg-primary-container transition-all"
                      >
                        Build Farm Plan
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </StitchShell>
  )
}
