'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { getMarketplaceListings } from '@/lib/api'
import type { MarketplaceListing, MarketplaceCategory } from '@/lib/api'

export default function FarmMarketplacePage() {
  const { context } = useFarmContext()
  const [category, setCategory] = useState<string>('all')
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(false)

  const fetchListings = () => {
    setLoading(true)
    const cat = category === 'all' ? undefined : (category as MarketplaceCategory)
    getMarketplaceListings({ category: cat })
      .then((res) => setListings(res.listings || []))
      .catch(() => {
        setListings([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchListings()
  }, [category])

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                Agronomic Exchange &amp; Direct Procurement // Active
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Farm Marketplace &amp; Buyers
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-surface-container-high border border-primary/20 font-label-code-sm text-xs text-primary font-bold">
              DEMO DATA
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="p-4 rounded-2xl bg-surface-container-low/80 border border-primary/20 backdrop-blur-xl flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Exchange Lots', icon: 'storefront' },
            { id: 'produce', label: 'Produce Buyers', icon: 'shopping_basket' },
            { id: 'seeds', label: 'Certified Seeds', icon: 'grain' },
            { id: 'fertilizers', label: 'Bio-Inputs & Fertilizer', icon: 'science' },
            { id: 'equipment', label: 'Machinery Rentals', icon: 'precision_manufacturing' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className={`px-4 py-2 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                category === tab.id
                  ? 'bg-primary-container text-on-primary-container shadow-md'
                  : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-surface-container/80 border border-primary/20 backdrop-blur-xl flex flex-col justify-between gap-5 shadow-xl hover:border-primary transition-all group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold tracking-wider">
                      {item.category.toUpperCase()} • Posted {item.postedAt}
                    </span>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1">{item.title}</h3>
                  </div>

                  <span className="font-headline-sm text-base text-primary font-bold font-mono px-3 py-1 rounded-xl bg-primary-container/20 border border-primary/30">
                    ₹{item.price_inr} / {item.unit}
                  </span>
                </div>

                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">{item.description}</p>

                <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Node / Location:</span>
                    <span className="text-on-surface font-semibold">{item.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Counterparty:</span>
                    <span className="text-secondary font-semibold">{item.sellerName}</span>
                  </div>
                </div>

                {item.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-lg bg-surface-container-high text-[11px] text-on-surface-variant font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.success(`Connecting call to ${item.sellerName}: ${item.sellerPhone_masked}`)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>Contact Dealer / Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.info(`Offer initiated for: ${item.title}`)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:text-primary transition-colors font-body-sm text-xs font-semibold"
                >
                  Place Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StitchShell>
  )
}
