'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { registerFarmer } from '@/lib/api'
import { useFarmContext } from '@/hooks/use-farm-context'

export default function RegisterPage() {
  const router = useRouter()
  const { refreshAuth } = useFarmContext()

  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [village, setVillage] = useState('Anekal')
  const [district, setDistrict] = useState('Bengaluru Urban')
  const [state, setState] = useState('Karnataka')
  const [landSize, setLandSize] = useState('3.5')
  const [soilType, setSoilType] = useState('Red sandy loam')
  const [waterAvailability, setWaterAvailability] = useState('moderate')
  const [currentCrop, setCurrentCrop] = useState('Tomato')
  const [season, setSeason] = useState('Kharif')
  const [farmingGoal, setFarmingGoal] = useState('profit')
  const [livestock, setLivestock] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !mobile || !password) {
      toast.error('Please fill in all required user account fields.')
      return
    }

    setLoading(true)
    try {
      const location = [village, district, state].filter(Boolean).join(', ')
      const res = await registerFarmer({
        fullName,
        email,
        mobile,
        password,
        village,
        district,
        state,
        location,
        landSizeAcres: parseFloat(landSize) || 2.5,
        soilType,
        waterAvailability,
        currentCrop,
        season,
        farmingGoal,
        livestock,
      })

      toast.success(`Welcome to Bhoomi Mithra, ${res.user.full_name}!`)
      await refreshAuth()
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create farmer account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StitchShell>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-label-code-sm text-primary uppercase tracking-widest font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Farmer Identity Registration
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-white font-bold tracking-tight">
            Create Your <span className="text-primary">Bhoomi Mithra</span> Account
          </h1>
          <p className="text-on-surface-variant font-body-md max-w-xl mx-auto text-sm">
            Join the autonomous agrarian intelligence network. Link your real farm credentials and soil parameters to activate personalized Gemini advisory.
          </p>
        </div>

        {/* Registration Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-low/70 backdrop-blur-2xl border border-outline-variant/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8"
        >
          {/* Section 1: Account Credentials */}
          <div className="space-y-4">
            <h2 className="font-headline-sm text-lg text-white font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-primary text-xl">badge</span>
              Farmer Account Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Gowda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98450 12345"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh.gowda@krishi.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Password (min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Farm Location & Boundaries */}
          <div className="space-y-4">
            <h2 className="font-headline-sm text-lg text-white font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-secondary text-xl">location_on</span>
              Regional Farm Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Village / Town
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Agro-Ecological Parameters */}
          <div className="space-y-4">
            <h2 className="font-headline-sm text-lg text-white font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-primary text-xl">psychiatry</span>
              Soil, Crop & Operational Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Land Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
                >
                  <option value="Red sandy loam">Red sandy loam</option>
                  <option value="Black cotton">Black cotton (Regur)</option>
                  <option value="Alluvial clay loam">Alluvial clay loam</option>
                  <option value="Laterite soil">Laterite soil</option>
                  <option value="Sandy loam">Sandy loam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Water Availability
                </label>
                <select
                  value={waterAvailability}
                  onChange={(e) => setWaterAvailability(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
                >
                  <option value="high">High (Perennial Canal / Borewell)</option>
                  <option value="moderate">Moderate (Seasonal Well / Rainfed)</option>
                  <option value="low">Low (Arid / Pure Rainfed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Primary Crop
                </label>
                <input
                  type="text"
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  placeholder="e.g. Finger Millet (Ragi)"
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Season
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
                >
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Summer">Summer (Zaid)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                  Farming Goal
                </label>
                <select
                  value={farmingGoal}
                  onChange={(e) => setFarmingGoal(e.target.value)}
                  className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
                >
                  <option value="profit">Commercial Profit Optimization</option>
                  <option value="subsistence">Household Subsistence</option>
                  <option value="mixed">Mixed Dairy & Cash Crop</option>
                  <option value="export">Export Quality Horticulture</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                Livestock / Dairy Assets
              </label>
              <input
                type="text"
                value={livestock}
                onChange={(e) => setLivestock(e.target.value)}
                placeholder="e.g. 2 Indigenous Hallikar Dairy Cattle, 4 Goats"
                className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/20">
            <p className="text-xs text-on-surface-variant">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in here
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-surface font-bold shadow-[0_0_20px_rgba(112,96,249,0.4)] hover:shadow-[0_0_30px_rgba(112,96,249,0.6)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Provisioning Account in D1...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Launch Dashboard</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </StitchShell>
  )
}
