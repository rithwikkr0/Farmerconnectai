'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { getMarketplaceListings } from '@/lib/api'
import type { MarketplaceListing, MarketplaceCategory } from '@/lib/api'

export default function FarmMarketplacePage() {
  const { context, user, farmProfile } = useFarmContext()
  const [category, setCategory] = useState<string>('all')
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(false)

  // Buy / Enquire Modal State
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceListing | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false)
  const [enquirySuccess, setEnquirySuccess] = useState(false)

  const farmerName = user?.full_name || context.farmerName || 'Farmer'
  const farmerPhone = user?.mobile || context.farmerPhone || '+91 98450 12345'
  const farmerLocation = farmProfile?.location || context.location || 'Anekal, Bengaluru Urban, Karnataka'

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

  const handleOpenEnquire = (item: MarketplaceListing) => {
    setSelectedProduct(item)
    setQuantity(1)
    setEnquirySuccess(false)
  }

  const handlePlaceEnquiry = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingEnquiry(true)
    setTimeout(() => {
      setSubmittingEnquiry(false)
      setEnquirySuccess(true)
      toast.success(`Enquiry submitted for ${selectedProduct?.title}! Dealer will contact you.`)
      setTimeout(() => {
        setSelectedProduct(null)
        setEnquirySuccess(false)
      }, 1500)
    }, 600)
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
                Anekal Agronomic Marketplace // Verified Listings
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Farm Marketplace &amp; Inputs
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-surface-container-high border border-primary/30 font-label-code-sm text-xs text-primary font-bold uppercase">
              DEMO LISTING
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="p-4 rounded-2xl bg-surface-container-low/80 border border-primary/20 backdrop-blur-xl flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Listings', icon: 'storefront' },
            { id: 'fertilizers', label: 'Fertilizers & Bio-Inputs', icon: 'science' },
            { id: 'seeds', label: 'Certified Seeds', icon: 'grain' },
            { id: 'pesticides', label: 'Bio-Pesticides', icon: 'pest_control' },
            { id: 'equipment', label: 'Irrigation & Tools', icon: 'precision_manufacturing' },
            { id: 'produce', label: 'Farm Produce', icon: 'shopping_basket' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-surface-container/80 border border-primary/20 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-xl hover:border-primary transition-all group"
            >
              {/* Product Image Banner */}
              <div className="relative w-full h-44 bg-surface-container-high overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if Wikimedia block
                      ;(e.target as HTMLImageElement).src = '/logo.png'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <span className="material-symbols-outlined text-4xl text-primary/40">inventory_2</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md font-label-code-sm text-[10px] text-primary uppercase font-bold border border-primary/30">
                    DEMO LISTING
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-3 py-1 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md font-headline-sm text-sm text-primary font-bold font-mono border border-primary/30 shadow-md">
                    ₹{item.price_inr} / {item.unit}
                  </span>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-label-code-sm">
                    <span className="text-primary uppercase font-bold">{item.category}</span>
                    <span>{item.location}</span>
                  </div>

                  <h3 className="font-headline-sm text-base font-bold text-on-surface line-clamp-1">{item.title}</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1 text-[11px]">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Seller:</span>
                      <span className="text-secondary font-semibold">{item.sellerName}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEnquire(item)}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_cart_checkout</span>
                    <span>Buy / Enquire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success(`Calling seller ${item.sellerName}: ${item.sellerPhone_masked}`)}
                    className="p-2.5 rounded-xl bg-surface-container-high hover:text-primary transition-colors text-on-surface"
                    title="Contact Seller"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enquiry Modal (No payment, enquiry flow only) */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-surface-container-low border border-primary/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between border-b border-outline-variant/20 pb-4">
                <div className="flex flex-col">
                  <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold tracking-wider">
                    Place Product Enquiry // Demo Flow
                  </span>
                  <h2 className="font-headline-sm text-lg font-bold text-white mt-0.5">
                    {selectedProduct.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {enquirySuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h3 className="font-headline-sm text-lg text-white font-bold">Enquiry Submitted!</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant max-w-xs mx-auto">
                    The seller ({selectedProduct.sellerName}) has received your enquiry. They will contact you shortly on your registered phone.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePlaceEnquiry} className="space-y-4">
                  {/* Pricing and Quantity */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20">
                    <div>
                      <span className="font-label-code-sm text-[10px] uppercase text-on-surface-variant block">Unit Price</span>
                      <span className="font-headline-sm text-base text-primary font-bold font-mono">
                        ₹{selectedProduct.price_inr} / {selectedProduct.unit}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-code-sm text-[10px] uppercase text-on-surface-variant block">Quantity</span>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-white px-2">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Total */}
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30">
                    <span className="font-label-code-sm text-xs text-primary uppercase font-bold">Estimated Total:</span>
                    <span className="font-headline-sm text-lg text-primary font-bold font-mono">
                      ₹{selectedProduct.price_inr * quantity}
                    </span>
                  </div>

                  {/* Pre-filled Farmer Contact Details */}
                  <div className="space-y-2.5 pt-1">
                    <span className="font-label-code-sm text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                      Auto-filled Farmer Information (From Profile)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-label-code-sm text-on-surface-variant uppercase mb-1">Farmer Name</label>
                        <input
                          type="text"
                          disabled
                          value={farmerName}
                          className="w-full bg-surface-container-high/40 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface font-body-sm text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-label-code-sm text-on-surface-variant uppercase mb-1">Contact Phone</label>
                        <input
                          type="text"
                          disabled
                          value={farmerPhone}
                          className="w-full bg-surface-container-high/40 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface font-body-sm text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-label-code-sm text-on-surface-variant uppercase mb-1">Delivery Node / Farm Location</label>
                      <input
                        type="text"
                        disabled
                        value={farmerLocation}
                        className="w-full bg-surface-container-high/40 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface font-body-sm text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-code-sm text-xs uppercase font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingEnquiry}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>{submittingEnquiry ? 'Submitting...' : 'Place Enquiry'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </StitchShell>
  )
}
