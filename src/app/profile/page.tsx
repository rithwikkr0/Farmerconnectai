'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { updateFarmerProfile } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const { user, farmProfile, isAuthenticated, logout, refreshAuth } = useFarmContext()

  const [village, setVillage] = useState('')
  const [district, setDistrict] = useState('')
  const [state, setState] = useState('')
  const [location, setLocation] = useState('')
  const [landSize, setLandSize] = useState('2.5')
  const [soilType, setSoilType] = useState('Red sandy loam')
  const [waterAvailability, setWaterAvailability] = useState('moderate')
  const [currentCrop, setCurrentCrop] = useState('Finger Millet (Ragi)')
  const [season, setSeason] = useState('Kharif')
  const [farmingGoal, setFarmingGoal] = useState('profit')
  const [livestock, setLivestock] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (farmProfile) {
      setVillage(farmProfile.village || '')
      setDistrict(farmProfile.district || '')
      setState(farmProfile.state || '')
      setLocation(farmProfile.location || '')
      setLandSize(String(farmProfile.land_size_acres || 2.5))
      setSoilType(farmProfile.soil_type || 'Red sandy loam')
      setWaterAvailability(farmProfile.water_availability || 'moderate')
      setCurrentCrop(farmProfile.current_crop || 'Finger Millet (Ragi)')
      setSeason(farmProfile.season || 'Kharif')
      setFarmingGoal(farmProfile.farming_goal || 'profit')
      setLivestock(farmProfile.livestock || '')
    }
  }, [farmProfile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateFarmerProfile({
        village,
        district,
        state,
        location: location || [village, district, state].filter(Boolean).join(', '),
        land_size_acres: parseFloat(landSize) || 2.5,
        soil_type: soilType,
        water_availability: waterAvailability,
        current_crop: currentCrop,
        season,
        farming_goal: farmingGoal,
        livestock,
      })
      toast.success('Farm profile updated in Cloudflare D1 successfully!')
      await refreshAuth()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Signed out successfully.')
    router.push('/')
  }

  return (
    <StitchShell>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low/80 backdrop-blur-2xl border border-outline-variant/30 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high/90 border border-primary/30 flex items-center justify-center p-1 shadow-lg">
              <img src="/logo.png" alt="Bhoomi Mithra Emblem" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-sm text-2xl text-white font-bold">
                  {user ? user.full_name : 'Guest Farmer'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-label-code-sm uppercase font-semibold">
                  {isAuthenticated ? 'Cloudflare D1 Verified' : 'Local Demo Mode'}
                </span>
              </div>
              <p className="text-on-surface-variant text-xs font-label-code-sm mt-1">
                {user ? `${user.email} • ${user.mobile}` : 'Sign in to link persistent D1 farm records'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-error/10 border border-error/30 text-error hover:bg-error/20 text-xs font-label-code-sm uppercase font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  href="/login"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-on-surface hover:text-white text-xs font-label-code-sm uppercase font-semibold text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-surface font-semibold text-xs font-label-code-sm uppercase text-center shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Profile Edit Form */}
        <form
          onSubmit={handleSave}
          className="bg-surface-container-low/70 backdrop-blur-2xl border border-outline-variant/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <h2 className="font-headline-sm text-lg text-white font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">psychiatry</span>
              Connected Agro-Profile Parameters
            </h2>
            <span className="text-xs text-on-surface-variant font-label-code-sm">
              Source: Cloudflare D1 (bhoomi-mithra-db)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                Village / Sector
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
              <input
                type="text"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
              />
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
              <input
                type="text"
                value={farmingGoal}
                onChange={(e) => setFarmingGoal(e.target.value)}
                className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
              Livestock / Dairy Profile
            </label>
            <input
              type="text"
              value={livestock}
              onChange={(e) => setLivestock(e.target.value)}
              className="w-full bg-surface-container-high/60 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-surface font-bold shadow-[0_0_20px_rgba(112,96,249,0.4)] hover:shadow-[0_0_30px_rgba(112,96,249,0.6)] transition-all flex items-center gap-2 text-sm"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  <span>Saving to D1...</span>
                </>
              ) : (
                <>
                  <span>Save Profile to D1</span>
                  <span className="material-symbols-outlined text-sm">save</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </StitchShell>
  )
}
