'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { matchFarmers } from '@/lib/api'
import type { FarmerMatch } from '@/lib/api'

export default function FindFarmerPage() {
  const { context } = useFarmContext()
  const [crop, setCrop] = useState(context.primaryCrop || 'Tomato')
  const [location, setLocation] = useState(context.location || 'Mandya')
  const [problem, setProblem] = useState('')
  const [matches, setMatches] = useState<FarmerMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [isDemo, setIsDemo] = useState(true)

  const handleSearch = () => {
    setLoading(true)
    matchFarmers({ crop, location, problem: problem || undefined })
      .then((res) => {
        setMatches(res.matches || [])
        setIsDemo(Boolean(res._demo))
      })
      .catch(() => {
        setMatches([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="font-label-code-sm text-xs text-teal-400 uppercase font-bold tracking-wider">
                Agronomic Peer Network
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Farmers with Relevant Experience
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-surface-container-high border border-teal-500/30 font-label-code-sm text-xs text-teal-400 font-bold uppercase">
              {isDemo ? 'EXAMPLE PEER PROFILES' : 'VERIFIED NETWORK'}
            </span>
          </div>
        </div>

        {/* Search Parameter Bar */}
        <div className="p-6 rounded-3xl bg-surface-container-low/80 border border-primary/25 backdrop-blur-2xl shadow-xl flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">Target Crop</label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Tomato, Paddy, Cotton"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">Location / District</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mandya, Thanjavur"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-code-sm text-xs text-on-surface uppercase">Specific Challenge</label>
              <input
                type="text"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. Blight, waterlogging, drip setup"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">person_search</span>
              <span>{loading ? 'Matching Peers...' : 'Search Peer Network'}</span>
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-xl font-bold text-on-surface">
              Matched Experienced Farmers Near You
            </h2>
            <span className="font-label-code-sm text-xs text-on-surface-variant font-mono">
              {matches.length} Matches Found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((item) => {
              const { farmer, matchScore, matchReasons, distanceKm } = item
              return (
                <div
                  key={farmer.id}
                  className="p-6 rounded-3xl bg-surface-container/80 border border-primary/20 backdrop-blur-xl flex flex-col justify-between gap-5 shadow-xl hover:border-primary transition-all group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary flex items-center justify-center font-headline-sm text-base font-bold text-white shadow-md">
                          {farmer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-headline-sm text-base font-bold text-on-surface">{farmer.name}</h3>
                          <span className="font-label-code-sm text-[10px] text-primary">
                            {farmer.location} {distanceKm ? `• ${distanceKm} km away` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-lg text-xs font-bold text-primary font-mono">
                        <span>{matchScore}% Match</span>
                      </div>
                    </div>

                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">{farmer.bio}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-body-sm text-on-surface-variant">
                      <div>
                        <span className="font-label-code-sm text-[9px] uppercase block">Experience</span>
                        <span className="text-on-surface font-semibold">{farmer.experience_years} Years</span>
                      </div>
                      <div>
                        <span className="font-label-code-sm text-[9px] uppercase block">Land Size</span>
                        <span className="text-secondary font-semibold font-mono">{farmer.land_size_acres} Acres</span>
                      </div>
                    </div>

                    {matchReasons && matchReasons.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
                        <span className="font-label-code-sm text-[9px] text-primary uppercase font-bold">Why Matched:</span>
                        <span className="text-[11px] text-on-surface font-medium">{matchReasons.join(' • ')}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {farmer.crops.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-md bg-surface-container-high text-[10px] text-on-surface font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toast.success(`Connecting call to ${farmer.name}: ${farmer.phone_masked}`)}
                      className="flex-1 py-2 rounded-xl bg-primary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                      <span>Connect Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toast.info(`Message request sent to ${farmer.name}`)}
                      className="px-3 py-2 rounded-xl bg-surface-container-high text-on-surface hover:text-primary transition-colors"
                      title="Send Message"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
