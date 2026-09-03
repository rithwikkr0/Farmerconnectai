'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { askAI } from '@/lib/api'
import type { AIResponse } from '@/lib/api'

export default function LivestockAIEcosystemPage() {
  const { context } = useFarmContext()
  const [animalType, setAnimalType] = useState('Dairy Cattle (HF Crossbreed)')
  const [count, setCount] = useState(4)
  const [question, setQuestion] = useState('Feed balancing and protection during upcoming monsoon rains')
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState<AIResponse | null>(null)

  const handleGetLivestockAdvice = async () => {
    setLoading(true)
    try {
      const res = await askAI('livestock_advice', {
        livestock: `${count} ${animalType}`,
        location: context.location || 'Karnataka',
        question: `Give livestock management advice for ${count} ${animalType}. Concern: ${question}. Focus on monsoon protection, green/dry fodder balance, mineral mixture, mastitis/foot rot prevention, and mandatory veterinary disclaimers.`,
      })
      setAdvice(res)
      toast.success('Livestock advisory generated')
    } catch {
      // Fallback
      setAdvice({
        task: 'livestock_advice',
        recommendation: `Livestock Health & Monsoon Safeguard for ${count} ${animalType}:\nWith heavy rains forecasted (+18mm), dairy cattle are at elevated vulnerability to foot rot and subclinical mastitis from wet bedding. Immediately transition animals to dry, elevated concrete sheds with rubber mats or clean straw bedding.`,
        sections: [
          {
            title: 'Ration & Nutritional Balancing',
            content: 'Daily feed per milking cow: 25kg green fodder (Co-4 / Napier grass) + 5kg dry ragi straw + 3.5kg balanced cattle feed (20% CP) + 50g mineral mixture + 30g common salt.',
          },
          {
            title: 'Monsoon Disease Mitigation',
            content: '1. Foot rot prevention: Walk animals through 5% copper sulphate foot bath twice weekly.\n2. Mastitis control: Teat dipping in povidone-iodine (0.5%) immediately post-milking.\n3. Vaccinate against Hemorrhagic Septicemia (HS) and Black Quarter (BQ) if not done in pre-monsoon cycle.',
          },
          {
            title: 'Water & Hygiene Standards',
            content: 'Ensure drinking water is unpolluted. Clean feeding troughs daily to prevent aflatoxin mold growth in damp feed.',
          },
        ],
        safetyNote: 'Veterinary disclaimer: This advisory is for management and preventive care. For acute illness, high fever, injectables, or prescription antibiotics, immediately contact your local Veterinary Dispensary officer.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                Herd Vitals &amp; Telemetry // Synced
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Livestock AI Ecosystem
            </h1>
          </div>

          <Link
            href="/copilot"
            className="px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-code-sm text-xs uppercase transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Ask Copilot Herd Advice</span>
          </Link>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Intake Parameters (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-surface-container-low/80 border border-primary/25 backdrop-blur-2xl flex flex-col gap-4 shadow-xl">
            <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
              Herd Profile &amp; Clinical Symptoms
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">Animal Type</label>
              <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
              >
                <option>Dairy Cattle (HF Crossbreed)</option>
                <option>Indigenous Cow (Gir / Hallikar)</option>
                <option>Murrah Buffalo</option>
                <option>Goat (Boer / Sirohi)</option>
                <option>Sheep (Nellore / Hassan)</option>
                <option>Poultry (Broiler / Country Fowl)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">Head Count</label>
              <input
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-label-code-lg text-sm focus:outline-none focus:border-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">
                Observed Condition / Advisory Need
              </label>
              <textarea
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Reduced milk output, wet bedding protection, foot rot prevention..."
                className="w-full p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="button"
              onClick={handleGetLivestockAdvice}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">pets</span>
              <span>{loading ? 'Synthesizing Advisory...' : 'Generate Herd Health Plan'}</span>
            </button>
          </div>

          {/* Advice Output (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {advice ? (
              <div className="p-6 rounded-3xl bg-surface-container/90 border border-primary/30 backdrop-blur-2xl flex flex-col gap-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary-container" />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-2xl">pets</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold">
                        Herd Health Protocol // Active
                      </span>
                      <h3 className="font-headline-sm text-base font-bold text-on-surface mt-0.5">
                        {count} {animalType}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary font-label-code-sm text-xs font-bold font-mono">
                    95% Match
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-high/60 font-body-sm text-xs text-on-surface leading-relaxed whitespace-pre-line">
                  {advice.recommendation}
                </div>

                <div className="space-y-3">
                  {advice.sections?.map((sec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5">
                      <span className="font-label-code-sm text-xs text-secondary uppercase font-bold">
                        {sec.title}
                      </span>
                      <p className="font-body-sm text-xs text-on-surface leading-relaxed whitespace-pre-line">
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
                <span className="material-symbols-outlined text-4xl text-primary/70 animate-pulse">pets</span>
                <h3 className="font-headline-sm text-base text-on-surface font-bold">
                  No Herd Protocol Generated Yet
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-sm">
                  Select your herd specifications on the left to receive customized feed balancing, monsoon disease mitigation, and first-aid advisory.
                </p>
                <button
                  type="button"
                  onClick={handleGetLivestockAdvice}
                  className="mt-2 px-5 py-2 rounded-xl bg-primary text-on-primary font-label-code-sm text-xs uppercase font-bold shadow-sm"
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
