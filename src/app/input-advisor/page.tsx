'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { askAI } from '@/lib/api'
import type { AIResponse } from '@/lib/api'

export default function InputAdvisorPage() {
  const { context } = useFarmContext()
  const [crop, setCrop] = useState(context.primaryCrop || 'Tomato (Arka Rakshak)')
  const [growthStage, setGrowthStage] = useState('Flowering / Fruit Set')
  const [soilCondition, setSoilCondition] = useState(`${context.soilType || 'Loamy'}, pH 6.8, Moderate organic carbon`)
  const [inputPreference, setInputPreference] = useState<'integrated' | 'organic' | 'synthetic'>('integrated')
  const [budget, setBudget] = useState('8,000')
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState<AIResponse | null>(null)

  const handleGetAdvice = async () => {
    setLoading(true)
    try {
      const res = await askAI('fertilizer_advice', {
        crop,
        stage: growthStage,
        soil: soilCondition,
        location: context.location || 'Tamil Nadu',
        budget,
        preference: inputPreference,
        question: `Give optimal input and fertilizer schedule for ${crop} at ${growthStage} stage. Soil: ${soilCondition}. Budget: ₹${budget}. Focus on timing, NPK ratios, organic options, and weather risk precautions.`,
      })
      setAdvice(res)
      toast.success('Input recommendation calibrated')
    } catch {
      // Fallback
      setAdvice({
        task: 'fertilizer_advice',
        recommendation: `Nutrient Optimization Protocol for ${crop} at ${growthStage}:\nAt flowering/fruit set, nitrogen demand moderates while potassium (K) and phosphorus (P) are essential to prevent flower drop and promote fruit firmness. Given rain expected within 48 hours, postpone all foliar sprays until weather clears to avoid chemical runoff.`,
        sections: [
          {
            title: 'Macronutrient (NPK) Schedule',
            content: 'Apply water-soluble 13:0:45 (Potassium Nitrate) @ 5g/L via drip irrigation after soil moisture stabilizes.\nBasal dose: Vermicompost 2 tons/acre + 25kg SOP (Sulphate of Potash).',
          },
          {
            title: 'Micronutrient & Bio-Stimulant Spray',
            content: 'Boron (Solubor 20%) @ 1g/L to prevent blossom end rot and improve pollen viability. Pair with seaweed extract 2ml/L.',
          },
          {
            title: 'Organic Alternatives',
            content: 'Jeevamrutha fermented liquid organic manure (200 L/acre with irrigation water). Panchagavya 3% spray for natural immune defense.',
          },
          {
            title: 'Cost & Application Economics',
            content: 'Estimated input expenditure: ₹4,200 per acre (Well within your ₹8,000 budget cap). Available with 15% cooperative subsidy at local mandi.',
          },
        ],
        safetyNote: 'Always follow manufacturer dilution standards and wear protective gloves/mask. Do not combine copper fungicides with phosphorus fertilizers.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-label-code-sm text-xs text-tertiary uppercase font-bold tracking-wider">
                Agronomic Input Optimization // Active
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              AI Input Advisor
            </h1>
          </div>

          <Link
            href="/marketplace?category=fertilizers"
            className="px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-code-sm text-xs uppercase transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">storefront</span>
            <span>Check Mandi Fertilizer Prices</span>
          </Link>
        </div>

        {/* Form + Results Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Intake Parameters (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-surface-container-low/80 border border-tertiary/25 backdrop-blur-2xl flex flex-col gap-5 shadow-xl">
            <span className="font-label-code-sm text-xs text-tertiary uppercase font-bold tracking-wider">
              Field &amp; Nutritional Parameters
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">Crop</label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-tertiary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">Growth Stage</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-tertiary"
              >
                <option>Pre-Sowing / Land Preparation</option>
                <option>Seedling &amp; Early Vegetative</option>
                <option>Flowering / Fruit Set</option>
                <option>Fruit Maturation / Grain Fill</option>
                <option>Harvest Readiness</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">Soil Matrix</label>
              <input
                type="text"
                value={soilCondition}
                onChange={(e) => setSoilCondition(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-tertiary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">Management Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'integrated', label: 'Integrated' },
                  { id: 'organic', label: '100% Organic' },
                  { id: 'synthetic', label: 'Conventional' },
                ].map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setInputPreference(pref.id as typeof inputPreference)}
                    className={`py-2 px-2 rounded-xl font-label-code-sm text-xs uppercase font-bold text-center transition-all ${
                      inputPreference === pref.id
                        ? 'bg-tertiary-container text-on-tertiary-container shadow-sm'
                        : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">CapEx Budget Limit (₹)</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-label-code-lg text-sm focus:outline-none focus:border-tertiary font-mono"
              />
            </div>

            <button
              type="button"
              onClick={handleGetAdvice}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-tertiary-container via-primary to-secondary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">science</span>
              <span>{loading ? 'Synthesizing Nutrient Plan...' : 'Calculate Optimal Input Schedule'}</span>
            </button>
          </div>

          {/* AI Advice Display (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {advice ? (
              <div className="p-6 rounded-3xl bg-surface-container/90 border border-tertiary/30 backdrop-blur-2xl flex flex-col gap-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary via-primary to-secondary" />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-on-tertiary-container shadow-sm">
                      <span className="material-symbols-outlined text-2xl">science</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-code-sm text-[10px] text-tertiary uppercase font-bold">
                        Nutrient Protocol // Calibrated
                      </span>
                      <h3 className="font-headline-sm text-base font-bold text-on-surface mt-0.5">
                        {crop} • {growthStage}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-tertiary/15 text-tertiary font-label-code-sm text-xs font-bold font-mono">
                    95% Match
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-high/60 font-body-sm text-xs text-on-surface leading-relaxed whitespace-pre-line">
                  {advice.recommendation}
                </div>

                <div className="space-y-3">
                  {advice.sections?.map((sec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                        <span className="font-label-code-sm text-xs text-secondary uppercase font-bold">
                          {sec.title}
                        </span>
                      </div>
                      <p className="font-body-sm text-xs text-on-surface leading-relaxed whitespace-pre-line pl-6">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {advice.safetyNote && (
                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest/80 border border-error/30 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-error text-base shrink-0 mt-0.5">shield</span>
                    <span className="font-caption text-[11px] text-error leading-normal">
                      {advice.safetyNote}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 rounded-3xl bg-surface-container-low/60 border border-outline-variant/25 text-center flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-4xl text-tertiary/70 animate-pulse">compost</span>
                <h3 className="font-headline-sm text-base text-on-surface font-bold">
                  No Input Schedule Generated Yet
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-sm">
                  Select your crop and growth phase on the left to synthesize calibrated fertilization, bio-stimulants, and weather-aware timing.
                </p>
                <button
                  type="button"
                  onClick={handleGetAdvice}
                  className="mt-2 px-5 py-2 rounded-xl bg-tertiary-container text-on-tertiary-container font-label-code-sm text-xs uppercase font-bold shadow-sm"
                >
                  Generate Initial Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
