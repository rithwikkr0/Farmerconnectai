'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { StitchShell } from '@/components/layout/stitch-shell'
import { BioCoreOrb } from '@/components/three/bio-core-orb'
import { useAICopilot } from '@/hooks/use-ai-copilot'
import { useFarmContext } from '@/hooks/use-farm-context'
import type { AITask } from '@/lib/api'

export default function FarmAICopilotPage() {
  const { messages, loading, error, sendMessage } = useAICopilot()
  const { context } = useFarmContext()

  const [inputQuery, setInputQuery] = useState('')
  const [selectedChannel, setSelectedChannel] = useState<AITask | 'all'>('all')
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [scannerModalOpen, setScannerModalOpen] = useState(false)

  const farmLocation = context.location || 'Mandya, Karnataka'
  const primaryCrop = context.primaryCrop || 'Tomato (Arka Rakshak)'

  const handleSend = async (customPrompt?: string) => {
    const q = customPrompt ?? inputQuery
    if (!q.trim() || loading) return
    setInputQuery('')
    await sendMessage(
      q,
      { location: farmLocation, crop: primaryCrop, soil: context.soilType },
      selectedChannel === 'all' ? undefined : selectedChannel,
    )
  }

  return (
    <StitchShell>
      <div className="w-full flex flex-col relative pb-24">
        {/* 3D AI INTELLIGENCE CORE HERO SECTION */}
        <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-12 pt-4 pb-6 bg-gradient-to-b from-surface-container-lowest via-surface-container-low/40 to-surface-container-lowest border-b border-outline-variant/25">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-primary/15 blur-[120px] pointer-events-none rounded-full" />

          <div className="max-w-[1600px] mx-auto flex flex-col items-center relative z-10">
            {/* 3D Core with Orbital Floating Telemetry Badges */}
            <div className="relative w-full max-w-4xl h-[320px] flex items-center justify-center">
              <BioCoreOrb height={320} />

              {/* BADGE 1: WEATHER */}
              <div className="absolute top-4 left-2 sm:left-10 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-container-high/90 border border-primary/25 backdrop-blur-md shadow-lg">
                <span className="material-symbols-outlined text-primary text-base">cloudy_snowing</span>
                <div className="flex flex-col">
                  <span className="font-label-code-sm text-[9px] text-primary uppercase font-bold">Live Weather</span>
                  <span className="font-body-sm text-xs text-on-surface">Open-Meteo API</span>
                </div>
              </div>

              {/* BADGE 2: CROP */}
              <div className="absolute top-4 right-2 sm:right-10 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-container-high/90 border border-secondary/25 backdrop-blur-md shadow-lg">
                <span className="material-symbols-outlined text-secondary text-base">eco</span>
                <div className="flex flex-col">
                  <span className="font-label-code-sm text-[9px] text-secondary uppercase font-bold">Your Crop</span>
                  <span className="font-body-sm text-xs text-on-surface">{primaryCrop.split('(')[0].trim()}</span>
                </div>
              </div>

              {/* BADGE 3: LABOR */}
              <div className="absolute bottom-4 left-4 sm:left-16 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-container-high/90 border border-secondary/25 backdrop-blur-md shadow-lg">
                <span className="material-symbols-outlined text-secondary text-base">engineering</span>
                <div className="flex flex-col">
                  <span className="font-label-code-sm text-[9px] text-secondary uppercase font-bold">Labor Network</span>
                  <span className="font-body-sm text-xs text-on-surface">Workers Near You</span>
                </div>
              </div>

              {/* BADGE 4: MARKET */}
              <div className="absolute bottom-4 right-4 sm:right-16 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-container-high/90 border border-primary/25 backdrop-blur-md shadow-lg">
                <span className="material-symbols-outlined text-primary text-base">storefront</span>
                <div className="flex flex-col">
                  <span className="font-label-code-sm text-[9px] text-primary uppercase font-bold">Marketplace</span>
                  <span className="font-body-sm text-xs text-on-surface">Browse Listings</span>
                </div>
              </div>
            </div>

            {/* Typography & AI Status */}
            <div className="flex flex-col items-center text-center mt-1 max-w-2xl">
              <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Bhoomi Mithra AI Copilot
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                Conversational intelligence layer connecting soil parameters, hyper-local weather, labor force, and market arbitrage.
              </p>
              <div className="inline-flex items-center gap-2 mt-3 px-3.5 py-1 rounded-full bg-surface-container-high/80 border border-primary/25 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="font-label-code-sm text-xs text-on-surface font-medium uppercase tracking-wide">
                  AI Thinking State:{' '}
                  <span className="text-primary font-bold">{loading ? 'Synthesizing Response...' : 'Ready'}</span> • Listening to Bio-Canopy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* THREE-COLUMN COMMAND WORKSPACE */}
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: AGRI-CHANNELS & FARM MEMORY (3 cols) */}
          <aside className="lg:col-span-3 flex flex-col gap-5">
            {/* Agri-Channels Navigation Bay */}
            <div className="rounded-2xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-md p-4 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between px-1">
                <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                  Agri-Channels
                </span>
                <span className="font-label-code-sm text-[10px] text-on-surface-variant font-mono">07 Active</span>
              </div>

              <div className="flex flex-col gap-1">
                {[
                  { id: 'all', label: 'All Inquiries', icon: 'auto_awesome', badge: 'Live' },
                  { id: 'crop_diagnosis', label: 'Crop Diagnostics', icon: 'vital_signs', badge: 'Vision' },
                  { id: 'weather_action', label: 'Weather & Flood Plan', icon: 'water', badge: 'Alert' },
                  { id: 'fertilizer_advice', label: 'Agri-Input & Nutrition', icon: 'inventory_2', badge: 'NPK' },
                  { id: 'crop_recommendation', label: 'Crop Recommendation', icon: 'grain', badge: 'Yield' },
                  { id: 'profit_analysis', label: 'Profit Simulation', icon: 'calculate', badge: 'Calc' },
                  { id: 'livestock_advice', label: 'Livestock Telemetry', icon: 'pets', badge: 'Herd' },
                ].map((channel) => {
                  const isSelected = selectedChannel === channel.id
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => setSelectedChannel(channel.id as AITask | 'all')}
                      className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(112,96,249,0.4)]'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-base">{channel.icon}</span>
                        <span className="font-body-sm text-xs">{channel.label}</span>
                      </div>
                      <span className="font-label-code-sm text-[9px] uppercase font-bold">{channel.badge}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* "TODAY I KNOW" AI Continuous Farm Memory Panel */}
            <div className="rounded-2xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-md p-4 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">memory</span>
                  <span className="font-label-code-sm text-xs text-on-surface font-bold uppercase tracking-wider">
                    Today I Know
                  </span>
                </div>
                <span className="font-label-code-sm text-[10px] text-primary uppercase font-mono">Memory v2</span>
              </div>

              <div className="space-y-2 pt-1 font-body-sm text-xs">
                <div className="flex items-start justify-between">
                  <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">Location</span>
                  <span className="text-on-surface text-right font-medium">{farmLocation}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">Active Plot</span>
                  <span className="text-on-surface text-right">Sector Alpha ({context.landSizeAcres || 5.5} Acres)</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">Soil Matrix</span>
                  <span className="text-on-surface text-right">{context.soilType || 'Loamy'} • 74% RH</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">Water Source</span>
                  <span className="text-on-surface text-right">{context.waterAvailability || 'Moderate'} Canal</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">Crop Phase</span>
                  <span className="text-secondary text-right font-semibold">{primaryCrop}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">Critical Flag</span>
                  <span className="text-error text-right font-bold">+18mm Rain Spike</span>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-on-surface-variant text-[10px] font-label-code-sm uppercase">
                <span>Last Sync</span>
                <span className="text-primary font-bold">Live Synced</span>
              </div>
            </div>

            {/* Expert Escalation Notice */}
            <div className="rounded-2xl bg-surface-container-low border border-outline-variant/30 p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-base">verified_user</span>
                <span className="font-label-code-sm text-[10px] uppercase font-bold tracking-wider">
                  Expert Oversight
                </span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                AI guidance optimizes agronomical planning. For regulated chemical treatments or acute livestock illness, verify with a certified Krishi Vigyan Kendra specialist.
              </p>
              <Link
                href="/farmers"
                className="w-full py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors font-body-sm text-xs text-primary flex items-center justify-center gap-1 font-semibold"
              >
                <span>Find Nearby Expert</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </aside>

          {/* CENTER COLUMN: CONVERSATIONAL REASONING CANVAS (6 cols) */}
          <main className="lg:col-span-6 flex flex-col gap-5">
            {/* If no user messages yet, show default welcome prompt & synthesis */}
            {messages.length === 0 ? (
              <>
                <div className="rounded-2xl bg-surface-container-low/80 border border-primary/20 backdrop-blur-md p-4 flex flex-col gap-2 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-xs font-bold">
                        FP
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-xs text-on-surface font-semibold">Farm Operator</span>
                        <span className="font-label-code-sm text-on-surface-variant uppercase text-[9px]">
                          Today • {farmLocation}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-surface-container-high text-primary font-label-code-sm text-[10px]">
                      Sample Inquiry
                    </span>
                  </div>
                  <p className="font-body-lg text-sm text-on-surface font-medium pl-11">
                    “Will the rain tomorrow affect my {primaryCrop} crop?”
                  </p>
                </div>

                {/* Multimodal Response Card */}
                <div className="rounded-2xl bg-surface-container/90 border border-primary/30 backdrop-blur-xl p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary-container" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary shadow-[0_0_16px_rgba(112,96,249,0.5)]">
                        <span className="material-symbols-outlined text-2xl">neurology</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold tracking-wider">
                            Multi-Factor Agri-Synthesis
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-label-code-sm bg-primary/10 text-primary uppercase font-bold font-mono">
                            Confidence: 96.4%
                          </span>
                        </div>
                        <h2 className="font-headline-sm text-sm text-on-surface font-bold mt-0.5">
                          Precipitation Risk: High Waterlogging Vulnerability on Sector Alpha
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-container-high/60 font-body-md text-xs text-on-surface leading-relaxed">
                    Rain is expected tomorrow in {farmLocation} (<strong className="text-primary">+18mm forecasted</strong>). Your field has {context.soilType || 'loamy'} soil with <strong className="text-secondary">74% current moisture</strong>, placing root systems at acute waterlogging hazard.
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-surface-container-low/90 flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">thunderstorm</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold">Insight Decomposition</span>
                        <p className="font-body-sm text-xs text-on-surface">Peak precipitation arriving midday with rate reaching 6.2 mm/hr.</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low/90 flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">science</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-label-code-sm text-[10px] text-secondary uppercase font-bold">Agronomic Reason</span>
                        <p className="font-body-sm text-xs text-on-surface">{primaryCrop} is in sensitive vegetative/flowering phase; prolonged water pooling causes root asphyxiation and increases fungal blight susceptibility.</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low/90 flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">task_alt</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold">Recommended Action</span>
                        <p className="font-body-sm text-xs text-on-surface">1. Inspect primary drainage trenches today.<br />2. Clear bund culverts on Sector Alpha.<br />3. <strong className="text-primary">Postpone foliar chemical applications</strong> until after rainfall.</p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Links */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <Link
                      href="/weather-protection"
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-white font-headline-sm text-[11px] font-semibold uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">water_damage</span>
                      <span>Open Drainage Plan</span>
                    </Link>

                    <Link
                      href="/labor"
                      className="px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-headline-sm text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">engineering</span>
                      <span>Find 3 Drainage Workers</span>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              // Live Conversation History
              messages.map((m) => (
                <div key={m.id} className="flex flex-col gap-3">
                  {m.role === 'user' ? (
                    <div className="rounded-2xl bg-surface-container-low/80 border border-primary/20 p-4 flex flex-col gap-1.5 shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-xs font-bold">
                          FP
                        </div>
                        <span className="font-headline-sm text-xs text-on-surface font-semibold">You</span>
                        <span className="font-label-code-sm text-[9px] text-on-surface-variant font-mono">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="font-body-md text-sm text-on-surface pl-9">{m.content}</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-surface-container/90 border border-primary/30 p-5 flex flex-col gap-3 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary-container" />
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-lg">neurology</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold">
                            Bhoomi Mithra AI Synthesis
                          </span>
                          {m.response && (
                            <span className="font-label-code-sm text-[9px] text-secondary font-mono">
                              Task: {m.response.task}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* AI Content */}
                      <p className="font-body-md text-sm text-on-surface whitespace-pre-line leading-relaxed">
                        {m.content}
                      </p>

                      {/* Sections breakdown */}
                      {m.response?.sections && m.response.sections.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {m.response.sections.map((sec, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-surface-container-low/90 border border-outline-variant/20 flex flex-col gap-1">
                              <span className="font-label-code-sm text-xs text-primary uppercase font-bold">
                                {sec.title}
                              </span>
                              <p className="font-body-sm text-xs text-on-surface whitespace-pre-line">
                                {sec.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Safety Notes */}
                      {m.response?.safetyNote && (
                        <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-error/30 flex items-start gap-2">
                          <span className="material-symbols-outlined text-error text-base shrink-0 mt-0.5">shield</span>
                          <span className="font-caption text-[11px] text-error leading-normal">
                            {m.response.safetyNote}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Error banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-error-container/30 border border-error/50 flex items-center gap-2.5 text-error text-xs">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className="rounded-2xl bg-surface-container/80 border border-primary/20 p-5 flex flex-col gap-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/20" />
                  <div className="h-4 w-40 bg-primary/20 rounded" />
                </div>
                <div className="h-3 w-full bg-primary/10 rounded" />
                <div className="h-3 w-3/4 bg-primary/10 rounded" />
              </div>
            )}

            {/* Multi-Turn Suggested Prompt Chips */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                Suggested Inquiries
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'What should I grow next season?',
                  'Heavy rain is coming. What should I do?',
                  'My tomato leaves are turning yellow.',
                  'Find 3 workers for weeding tomorrow',
                  'Who wants to buy my harvested crops?',
                  'How to protect cattle in sudden rainfall?',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/20 hover:border-primary hover:text-primary transition-all text-on-surface font-body-sm text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{prompt}</span>
                    <span className="material-symbols-outlined text-xs">north_east</span>
                  </button>
                ))}
              </div>
            </div>
          </main>

          {/* RIGHT COLUMN: LIVE VITALS & PROACTIVE ACTIONS (3 cols) */}
          <aside className="lg:col-span-3 flex flex-col gap-5">
            {/* Farm Summary Panel */}
            <div className="rounded-2xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-md p-4 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">agriculture</span>
                  <span className="font-label-code-sm text-xs text-on-surface font-bold uppercase tracking-wider">
                    Your Farm
                  </span>
                </div>
                <span className="font-label-code-sm text-[10px] text-secondary uppercase font-mono">Profile</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                  <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Location</span>
                  <span className="font-headline-sm text-xs text-primary font-bold mt-0.5 truncate">
                    {context.location?.split(',')[0] || 'Not set'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                  <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Crop</span>
                  <span className="font-headline-sm text-xs text-secondary font-bold mt-0.5 truncate">
                    {primaryCrop.split('(')[0].trim() || 'Not set'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                  <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Land</span>
                  <span className="font-headline-sm text-xs text-on-surface font-bold mt-0.5">
                    {context.landSizeAcres ? `${context.landSizeAcres} ac` : '—'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                  <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Water</span>
                  <span className="font-headline-sm text-xs text-on-surface font-bold mt-0.5 capitalize">
                    {context.waterAvailability || '—'}
                  </span>
                </div>
              </div>

              <p className="text-[10px] font-label-code-sm text-on-surface-variant text-center pt-1">
                Ask AI below to get personalized advice
              </p>
            </div>

            {/* Proactive Action Cards */}
            <div className="flex flex-col gap-3">
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider px-1">
                Proactive Actions
              </span>

              <div className="p-3.5 rounded-2xl bg-surface-container/70 border border-error/30 backdrop-blur-md flex flex-col gap-2 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-label-code-sm text-[10px] text-error uppercase font-bold">Weather Warning</span>
                  <span className="font-label-code-sm text-[9px] text-on-surface-variant font-mono">T-18h</span>
                </div>
                <p className="font-body-sm text-xs text-on-surface">
                  Heavy rain expected tomorrow (+18mm). Silt build-up detected in North bund.
                </p>
                <Link
                  href="/weather-protection"
                  className="mt-1 w-full py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-code-sm text-[10px] uppercase font-bold text-center transition-all"
                >
                  Review Drainage Plan →
                </Link>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-container/70 border border-secondary/30 backdrop-blur-md flex flex-col gap-2 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-label-code-sm text-[10px] text-secondary uppercase font-bold">Labor Dispatch</span>
                  <span className="font-label-code-sm text-[9px] text-on-surface-variant font-mono">5km Radial</span>
                </div>
                <p className="font-body-sm text-xs text-on-surface">
                  8 verified workers available for trench excavation &amp; harvesting.
                </p>
                <Link
                  href="/labor"
                  className="mt-1 w-full py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-secondary font-label-code-sm text-[10px] uppercase font-bold text-center transition-all"
                >
                  Book Workers Now →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* MULTIMODAL FLOATING INPUT DOCK (PERSISTENT COCKPIT BAR) */}
        <div className="fixed bottom-4 left-0 lg:left-72 right-0 z-40 px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-surface-container/95 border border-primary/30 backdrop-blur-2xl p-2.5 sm:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(112,96,249,0.25)] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-primary text-xl">auto_awesome</span>
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleSend()
                  }}
                  placeholder="Ask Farm AI anything about crop, soil, weather, labor, or markets..."
                  className="w-full h-11 pl-11 pr-4 rounded-2xl bg-surface-container-lowest/90 text-on-surface placeholder:text-on-surface-variant/70 font-body-md text-xs sm:text-sm focus:outline-none focus:border-primary border border-outline-variant/30 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setVoiceModalOpen(true)}
                  className="w-10 h-10 rounded-xl bg-surface-container-high hover:bg-primary/20 text-primary transition-all flex items-center justify-center relative"
                  title="Voice Mode"
                >
                  <span className="material-symbols-outlined text-lg">mic</span>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-ping" />
                </button>

                <button
                  type="button"
                  onClick={() => setScannerModalOpen(true)}
                  className="w-10 h-10 rounded-xl bg-surface-container-high hover:bg-secondary/20 text-secondary transition-all flex items-center justify-center"
                  title="Scan Crop Leaf"
                >
                  <span className="material-symbols-outlined text-lg">photo_camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={loading || !inputQuery.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-container to-secondary-container text-white shadow-[0_0_16px_rgba(112,96,249,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-40"
                  title="Send Inquiry"
                >
                  <span className="material-symbols-outlined text-lg font-bold">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL 1: VOICE AI MODE PREVIEW */}
        {voiceModalOpen && (
          <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-surface-container p-7 flex flex-col items-center text-center border border-primary/30 shadow-2xl">
              <button
                type="button"
                onClick={() => setVoiceModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <span className="font-label-code-sm text-[10px] text-primary uppercase tracking-widest font-bold">
                Multilingual Voice Mode
              </span>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1">Farm AI is Listening...</h3>

              {/* Concentric Audio Waveforms */}
              <div className="relative w-36 h-36 my-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping" />
                <div className="absolute inset-3 rounded-full bg-primary/20 animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-container to-primary shadow-[0_0_32px_rgba(112,96,249,0.8)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-3xl animate-bounce">graphic_eq</span>
                </div>
              </div>

              <div className="w-full p-3.5 rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/30 text-left flex flex-col gap-1">
                <span className="font-label-code-sm text-[9px] text-primary uppercase font-mono">
                  Real-Time Voice Processing
                </span>
                <p className="font-body-sm text-xs text-on-surface italic">
                  “Will the rain tomorrow affect my tomato plants?”
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setVoiceModalOpen(false)
                    void handleSend('Will the rain tomorrow affect my tomato plants?')
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-xs uppercase font-bold shadow-md"
                >
                  Process Voice Note
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant font-headline-sm text-xs uppercase font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: NEURAL CROP DIAGNOSTICS SCANNER */}
        {scannerModalOpen && (
          <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg rounded-3xl bg-surface-container p-6 flex flex-col gap-4 border border-primary/30 shadow-2xl">
              <button
                type="button"
                onClick={() => setScannerModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">document_scanner</span>
                <span className="font-headline-sm text-base font-bold text-on-surface">
                  Neural Crop Diagnostics Scanner
                </span>
              </div>

              {/* Scanner Viewport */}
              <div className="relative w-full h-64 rounded-2xl bg-surface-container-lowest overflow-hidden flex items-center justify-center border border-primary/40">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_16px_#7060f9] animate-pulse top-1/2" />
                <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-primary animate-pulse">
                    center_focus_strong
                  </span>
                  <span className="font-label-code-sm text-xs uppercase font-mono">
                    Align leaf within optical crosshairs
                  </span>
                </div>
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary" />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setScannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface-variant font-body-sm text-xs uppercase font-semibold"
                >
                  Close
                </button>
                <Link
                  href="/crop-doctor"
                  className="px-5 py-2 rounded-xl bg-primary-container text-on-primary-container font-body-sm text-xs uppercase font-bold shadow-md"
                >
                  Open Full Crop Doctor →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </StitchShell>
  )
}
