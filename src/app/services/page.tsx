'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'

interface AgriService {
  id: string
  name: string
  type: 'drone' | 'machinery' | 'storage' | 'lab' | 'extension'
  location: string
  distance_km: number
  contact: string
  pricing: string
  description: string
  rating: number
  verified: boolean
}

const SERVICES: AgriService[] = [
  {
    id: 's-1',
    name: 'AeroKrishi Autonomous Drone Spraying',
    type: 'drone',
    location: 'Mandya Agro-Tech Corridor',
    distance_km: 4.2,
    contact: '+91 94480 88776',
    pricing: '₹450 / acre (10 min flight)',
    description: 'Ultra-low volume micron spray for blight protection and foliar nutrition. High canopy penetration with zero soil compaction.',
    rating: 4.9,
    verified: true,
  },
  {
    id: 's-2',
    name: 'Raitha Sanjeevini Cold Storage Facility',
    type: 'storage',
    location: 'Mysore-Bangalore Highway Node',
    distance_km: 8.5,
    contact: '+91 98800 22334',
    pricing: '₹1.80 / kg per month (Humidity Controlled)',
    description: '4°C to 12°C dynamic cold rooms optimized for tomatoes, chillies, and exotic horticulture. Warehouse receipt financing available.',
    rating: 4.85,
    verified: true,
  },
  {
    id: 's-3',
    name: 'ICAR-KVK Regional Soil & Leaf Testing Lab',
    type: 'lab',
    location: 'V.C. Farm Campus, Mandya',
    distance_km: 6.1,
    contact: '+91 82322 45678',
    pricing: '₹150 / complete sample profile',
    description: 'Comprehensive 12-parameter soil health card testing: Available N, P, K, Organic Carbon, EC, pH, and micronutrients (Zn, Fe, Cu, Mn, B).',
    rating: 4.95,
    verified: true,
  },
  {
    id: 's-4',
    name: 'Kaveri Custom Tractor & Harvester Pool',
    type: 'machinery',
    location: 'Maddur Taluk Center',
    distance_km: 7.0,
    contact: '+91 97410 66554',
    pricing: '₹850 / hr (Tractor) • ₹2,200 / hr (Combine Harvester)',
    description: 'Fleet of 8 modern tractors with multi-crop threshers, disc harrows, and reversible hydraulic ploughs. On-demand field delivery.',
    rating: 4.75,
    verified: true,
  },
]

export default function AgriServicesPage() {
  const { context } = useFarmContext()
  const [filterType, setFilterType] = useState('all')

  const filtered = SERVICES.filter((s) => (filterType === 'all' ? true : s.type === filterType))

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                Regional Mechanization &amp; Infrastructure Hub
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Nearby Agricultural Services
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-surface-container-high border border-primary/20 font-label-code-sm text-xs text-primary font-bold">
              DEMO DIRECTORY
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-surface-container-low/80 border border-primary/20 backdrop-blur-xl flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Services', icon: 'precision_manufacturing' },
            { id: 'drone', label: 'Drone Sprayers', icon: 'satellite_alt' },
            { id: 'storage', label: 'Cold Storage', icon: 'ac_unit' },
            { id: 'lab', label: 'Soil Testing Labs', icon: 'biotech' },
            { id: 'machinery', label: 'Tractors & Tillage', icon: 'agriculture' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-primary-container text-on-primary-container shadow-md'
                  : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-3xl bg-surface-container/80 border border-primary/20 backdrop-blur-xl flex flex-col justify-between gap-5 shadow-xl hover:border-primary transition-all group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-2xl">
                        {service.type === 'drone'
                          ? 'satellite_alt'
                          : service.type === 'storage'
                          ? 'ac_unit'
                          : service.type === 'lab'
                          ? 'biotech'
                          : 'agriculture'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-headline-sm text-base font-bold text-on-surface">{service.name}</h3>
                      <span className="font-label-code-sm text-[10px] text-primary">
                        {service.location} • {service.distance_km} km away
                      </span>
                    </div>
                  </div>

                  <span className="font-headline-sm text-sm font-bold text-secondary font-mono">
                    ★ {service.rating}
                  </span>
                </div>

                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">{service.description}</p>

                <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                  <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase">
                    Rate Tariff:
                  </span>
                  <span className="font-headline-sm text-xs text-primary font-bold font-mono">
                    {service.pricing}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.success(`Calling ${service.name}: ${service.contact}`)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>Book Service Call</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.info(`Service inquiry dispatched to ${service.name}`)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:text-primary transition-colors font-body-sm text-xs font-semibold"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StitchShell>
  )
}
