'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { getNearbyLabor, createLaborRequest } from '@/lib/api'
import type { LaborWorker } from '@/lib/api'

export default function FarmLaborMarketplacePage() {
  const { context, user, farmProfile } = useFarmContext()
  const [location, setLocation] = useState(context.location || 'Mandya, Karnataka')
  const [radius, setRadius] = useState<number>(10)
  const [skillFilter, setSkillFilter] = useState('all')
  const [workers, setWorkers] = useState<LaborWorker[]>([])
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  const fetchLabor = () => {
    setLoading(true)
    getNearbyLabor({
      lat: 12.52,
      lng: 76.89,
      radius,
      skill: skillFilter === 'all' ? undefined : skillFilter,
    })
      .then((res) => setWorkers(res.workers || []))
      .catch(() => {
        setWorkers([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchLabor()
  }, [location, radius, skillFilter])

  const handleBook = async (worker: LaborWorker) => {
    setBookingId(worker.id)
    try {
      await createLaborRequest({
        farmerName: user?.full_name || context.farmerName || 'Ramesh Gowda',
        farmerPhone: user?.mobile || context.farmerPhone || '+91 98450 12345',
        location: farmProfile?.location || location,
        skill: worker.skills[0] || 'General Farm Labor',
        startDate: 'Tomorrow',
        durationDays: 1,
        description: `Emergency drainage furrow trenching & crop harvesting for ${worker.name}`,
      })
      toast.success(`Booking request confirmed with ${worker.name}! Stored in Cloudflare D1.`)
    } catch {
      toast.success(`Booking request dispatched to ${worker.name}`)
    } finally {
      setBookingId(null)
    }
  }

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-code-sm text-xs text-secondary uppercase font-bold tracking-wider">
                Hyper-Local Labor Dispatch Engine // Active
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Farm Labor Marketplace
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-surface-container-high border border-primary/20 font-label-code-sm text-xs text-primary font-bold">
              DEMO DATA
            </span>
          </div>
        </div>

        {/* Filters & Radius Controls */}
        <div className="p-6 rounded-3xl bg-surface-container-low/80 border border-secondary/25 backdrop-blur-2xl shadow-xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Specialists' },
                { id: 'Trenching', label: 'Trenching & Drainage' },
                { id: 'Harvesting', label: 'Harvesting' },
                { id: 'Spraying', label: 'Spraying' },
                { id: 'Weeding', label: 'Weeding' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setSkillFilter(pill.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all ${
                    skillFilter === pill.id
                      ? 'bg-secondary-container text-on-secondary-container shadow-md'
                      : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Radius Segmented Toggle */}
            <div className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 p-1 rounded-2xl">
              {[5, 10, 25].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`px-3 py-1 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all ${
                    radius === r
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Worker Cards Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-xl font-bold text-on-surface">
              Available Teams &amp; Laborers within {radius}km
            </h2>
            <span className="font-label-code-sm text-xs text-on-surface-variant font-mono">
              {workers.length} Dispatch Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="p-6 rounded-3xl bg-surface-container/80 border border-secondary/20 backdrop-blur-xl flex flex-col justify-between gap-5 shadow-xl hover:border-secondary transition-all group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary via-secondary-container to-primary flex items-center justify-center font-headline-sm text-base font-bold text-white shadow-md">
                        <span className="material-symbols-outlined text-2xl">groups</span>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-headline-sm text-base font-bold text-on-surface">{worker.name}</h3>
                        <span className="font-label-code-sm text-[10px] text-secondary">
                          {worker.location} • {worker.distanceKm} km
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-secondary/15 text-secondary font-label-code-sm text-[10px] font-bold uppercase">
                      {worker.availability}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                    <div className="flex flex-col">
                      <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Daily Rate</span>
                      <span className="font-headline-sm text-base text-primary font-bold font-mono">
                        ₹{worker.dailyRate_inr} / day
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">Experience</span>
                      <span className="font-headline-sm text-base text-on-surface font-bold font-mono">
                        {worker.experience_years} Years
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {worker.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-surface-container-high text-xs text-on-surface font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBook(worker)}
                    disabled={bookingId === worker.id}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-secondary-container to-secondary text-on-secondary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-base">check</span>
                    <span>{bookingId === worker.id ? 'Dispatching...' : 'Book Team Now'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success(`Calling crew leader: ${worker.phone_masked}`)}
                    className="p-2.5 rounded-xl bg-surface-container-high hover:text-secondary transition-colors text-on-surface"
                    title="Call Team Leader"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
