'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { getAgriculturalServices } from '@/lib/api'

interface ServiceRecord {
  id: string
  name: string
  service_type: string
  provider_name: string
  contact_phone: string
  pricing: string
  description: string
  location: string
  is_verified?: boolean
  _demo?: boolean
}

export default function AgriServicesPage() {
  const { context } = useFarmContext()
  const [filterType, setFilterType] = useState('all')
  const [services, setServices] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(false)

  const farmLocation = context.location || 'Anekal, Bengaluru Urban, Karnataka'

  useEffect(() => {
    setLoading(true)
    getAgriculturalServices({
      type: filterType === 'all' ? undefined : filterType,
    })
      .then((res) => {
        setServices(res.services || [])
      })
      .catch(() => {
        setServices([])
      })
      .finally(() => setLoading(false))
  }, [filterType])

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-code-sm text-xs text-secondary uppercase font-bold tracking-wider">
                Agricultural Services Hub
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Nearby Farm &amp; Machinery Services
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-surface-container/60 border border-outline-variant/30 px-3.5 py-1.5 rounded-full text-on-surface-variant font-label-code-sm text-xs">
            <span className="material-symbols-outlined text-sm text-secondary">pin_drop</span>
            <span>{farmLocation}</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low/80 border border-outline-variant/30 backdrop-blur-xl flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Services', icon: 'precision_manufacturing' },
            { id: 'drone', label: 'Drone Spraying', icon: 'flight' },
            { id: 'storage', label: 'Cold Storage', icon: 'ac_unit' },
            { id: 'lab', label: 'Soil Testing Labs', icon: 'science' },
            { id: 'machinery', label: 'Custom Hiring Centers', icon: 'agriculture' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-secondary text-surface shadow-md'
                  : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center text-on-surface-variant flex flex-col items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-3xl text-secondary">progress_activity</span>
            <span className="text-xs font-label-code-sm uppercase">Loading services from D1 directory...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <div className="p-12 rounded-3xl bg-surface-container-low/60 border border-outline-variant/30 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high mx-auto flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl">build</span>
            </div>
            <h3 className="font-headline-sm text-base text-white font-bold">
              No verified agricultural services found
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto">
              Connect a verified local service provider directory to enable this section.
            </p>
          </div>
        )}

        {/* Services Grid */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="p-6 rounded-3xl bg-surface-container-low/80 border border-outline-variant/30 backdrop-blur-xl flex flex-col justify-between gap-5 shadow-xl hover:border-secondary/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-label-code-sm text-secondary uppercase tracking-wider font-bold">
                          {svc.service_type.toUpperCase()}
                        </span>
                        {svc._demo ? (
                          <span className="px-2 py-0.5 rounded-md bg-surface-container text-[9px] font-label-code-sm uppercase font-bold text-on-surface-variant border border-outline-variant/30">
                            DEMO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-secondary/15 text-[9px] font-label-code-sm uppercase font-bold text-secondary border border-secondary/30">
                            REAL PUBLIC LISTING
                          </span>
                        )}
                      </div>
                      <h3 className="font-headline-sm text-lg font-bold text-white mt-1">{svc.name}</h3>
                    </div>

                    <span className="font-headline-sm text-xs text-secondary font-bold font-mono px-3 py-1 rounded-xl bg-secondary/10 border border-secondary/25 shrink-0">
                      {svc.pricing}
                    </span>
                  </div>

                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    {svc.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20 flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Location:</span>
                      <span className="text-white font-semibold">{svc.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Provider:</span>
                      <span className="text-secondary font-semibold">{svc.provider_name}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => toast.info(`${svc.provider_name}: ${svc.location}`)}
                    className="w-full py-2.5 rounded-xl bg-secondary text-surface font-headline-sm text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">storefront</span>
                    <span>View Location &amp; Listing Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StitchShell>
  )
}
