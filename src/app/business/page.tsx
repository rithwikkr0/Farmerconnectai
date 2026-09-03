'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'

interface BusinessDeal {
  id: string
  company: string
  title: string
  type: 'contract' | 'bulk_procure' | 'subsidy' | 'carbon'
  value: string
  volume: string
  tenure: string
  description: string
  eligibility: string
  verified: boolean
}

const DEALS: BusinessDeal[] = [
  {
    id: 'b-1',
    company: 'AgriCorp Processing Foods Ltd',
    title: 'Contract Farming Buyback Agreement: Processing Tomato',
    type: 'contract',
    value: 'Guaranteed ₹32 / kg floor price',
    volume: '50 to 200 metric tons',
    tenure: '3 Seasons (18 Months)',
    description: 'Guaranteed off-take agreement for high-brix hybrid tomato varieties. Company provides subsidized certified seeds and agronomist inspection.',
    eligibility: 'Minimum 2 acres drip-irrigated plot within 40km of Mandya processing plant.',
    verified: true,
  },
  {
    id: 'b-2',
    company: 'FreshGlobal Exports Consortium',
    title: 'Export Grade Produce Sourcing: Clean Residue Lot',
    type: 'bulk_procure',
    value: '₹44 / kg + 10% Quality Bonus',
    volume: '20 metric tons',
    tenure: 'Immediate Harvest Cycle',
    description: 'Consortium sourcing export-certified vegetables for Middle East air-cargo. Zero organophosphate residue certificate required.',
    eligibility: 'APEDA certified or cooperative group with pesticide-tested soil records.',
    verified: true,
  },
  {
    id: 'b-3',
    company: 'PMKSY State Horticulture Dept',
    title: 'Micro-Irrigation (Drip / Sprinkler) Capital Subsidy',
    type: 'subsidy',
    value: 'Up to 75% Capital Grant (Max ₹55,000/ac)',
    volume: 'Direct to Vendor Subsidy',
    tenure: 'Fiscal Year 2026',
    description: 'Government subsidy for installing inline drip irrigation and automated venturi fertigation systems for small and marginal farmers.',
    eligibility: 'Land revenue records (RTC/Pahani) and valid Aadhaar linked bank account.',
    verified: true,
  },
  {
    id: 'b-4',
    company: 'Verra Soil Bio-Carbon Registry',
    title: 'Regenerative Agriculture Carbon Credit Program',
    type: 'carbon',
    value: '₹1,800 / acre per year recurring',
    volume: 'Soil Organic Carbon Offsets',
    tenure: '5 Year Program',
    description: 'Earn voluntary carbon credits by adopting no-till, cover cropping, and bio-char application verified by Sentinel-2 satellite biomass data.',
    eligibility: 'Continuous farming with verified minimum 0.5% organic carbon increase over baseline.',
    verified: true,
  },
]

export default function BusinessOpportunitiesPage() {
  const { context } = useFarmContext()
  const [filter, setFilter] = useState('all')

  const filteredDeals = DEALS.filter((d) => (filter === 'all' ? true : d.type === filter))

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-code-sm text-xs text-secondary uppercase font-bold tracking-wider">
                Enterprise &amp; Agribusiness Exchange // Demo &amp; Informational Desk
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Business Opportunities
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-surface-container-high border border-secondary/20 font-label-code-sm text-xs text-secondary font-bold">
              PILOT / DEMO DESK
            </span>
          </div>
        </div>

        {/* Transparency Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-surface-container-high/60 border border-secondary/20 flex items-start gap-3 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">info</span>
          <p className="leading-relaxed">
            <strong className="text-on-surface font-semibold">Transparency Notice:</strong> Contract farming lots and export tenders shown below are illustrative demonstration templates for agribusiness partnerships. Government subsidy entries represent informational scheme guides based on public PMKSY guidelines. Direct commercial onboarding is in closed pilot.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="p-4 rounded-2xl bg-surface-container-low/80 border border-secondary/20 backdrop-blur-xl flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Opportunities', icon: 'handshake' },
            { id: 'contract', label: 'Contract Farming', icon: 'history_edu' },
            { id: 'bulk_procure', label: 'Bulk Corporate Procurement', icon: 'storefront' },
            { id: 'subsidy', label: 'Government Subsidies', icon: 'account_balance' },
            { id: 'carbon', label: 'Carbon Credits', icon: 'eco' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-secondary-container text-on-secondary-container shadow-md'
                  : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="p-6 rounded-3xl bg-surface-container/80 border border-secondary/20 backdrop-blur-xl flex flex-col justify-between gap-5 shadow-xl hover:border-secondary transition-all group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-code-sm text-[10px] text-secondary uppercase font-bold tracking-wider">
                        {deal.company}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-[9px] font-label-code-sm uppercase font-bold text-on-surface-variant border border-outline-variant/20">
                        {deal.type === 'subsidy' ? 'Informational Scheme' : 'Demo Contract'}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1">{deal.title}</h3>
                  </div>

                  <span className="font-headline-sm text-xs text-secondary font-bold font-mono px-3 py-1 rounded-xl bg-secondary-container/20 border border-secondary/30">
                    {deal.tenure}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
                  <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase font-bold">
                    Commercial Terms &amp; Value:
                  </span>
                  <span className="font-headline-sm text-base text-primary font-bold font-mono">
                    {deal.value}
                  </span>
                  <span className="font-label-code-sm text-[11px] text-on-surface-variant">
                    Target Volume: {deal.volume}
                  </span>
                </div>

                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">{deal.description}</p>

                <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20 text-xs font-body-sm text-on-surface-variant">
                  <strong className="text-on-surface font-medium">Eligibility:</strong> {deal.eligibility}
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.success(`Application initiated for: ${deal.title}`)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-on-secondary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-secondary-container transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Apply for Partnership</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.info(`Detailed corporate prospectus requested from ${deal.company}`)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:text-secondary transition-colors font-body-sm text-xs font-semibold"
                >
                  Prospectus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StitchShell>
  )
}
