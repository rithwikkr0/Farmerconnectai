'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StitchShell } from '@/components/layout/stitch-shell'
import { PerspectiveGrid } from '@/components/three/perspective-grid'
import { useFarmContext } from '@/hooks/use-farm-context'

export default function SplashPage() {
  const router = useRouter()
  const { context } = useFarmContext()
  const [calibrated, setCalibrated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setCalibrated(true), 1400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <StitchShell>
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden">
        {/* Three.js 3D Grid & Particle Layer */}
        <PerspectiveGrid />

        {/* Ambient Gradient Flares */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-surface-container-lowest/60 via-transparent to-surface-container-lowest/90 z-0" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-container/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-secondary-container/25 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Top Status Sub-Header */}
        <div className="w-full max-w-7xl mx-auto relative z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-label-code-sm text-on-surface-variant tracking-widest uppercase">
                SYS.VER // 4.9.2
              </span>
            </div>
            <span className="font-label-code-sm text-label-code-sm text-primary tracking-wider opacity-90 uppercase">
              NEURAL GEO-SYNC: ONLINE
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container-low/70 backdrop-blur-xl border border-primary/20 shadow-[0_4px_20px_rgba(112,96,249,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-label-code-sm text-label-code-sm text-on-surface tracking-widest font-bold uppercase">
              AI POWERED • GEMINI 2.0
            </span>
          </div>
        </div>

        {/* Center Futuristic Splash Card */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4 py-6">
          <div className="w-full relative flex flex-col items-center text-center p-8 sm:p-12 rounded-3xl bg-surface-container-low/60 backdrop-blur-2xl border border-primary/25 shadow-[0_24px_50px_rgba(5,3,10,0.85)]">
            {/* Holographic Glowing Icon */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary-container/40 blur-2xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-surface-container-high/90 border border-primary/30 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-primary text-3xl font-bold filter drop-shadow-[0_0_12px_rgba(198,192,255,0.9)]">
                  eco
                </span>
              </div>
            </div>

            <h1 className="font-headline-lg text-headline-lg text-white tracking-tight drop-shadow-[0_2px_16px_rgba(198,192,255,0.4)] uppercase">
              BHOOMI <span className="text-primary font-bold">MITHRA</span>
            </h1>

            <div className="font-headline-sm text-lg sm:text-xl text-secondary mt-2 tracking-wider font-semibold">
              ಬೆಳಕಿನ ಮನೆ
            </div>

            <p className="font-body-lg text-body-lg text-on-surface mt-2 font-medium tracking-wide">
              Your farm. Your data. <span className="text-primary font-bold">Your AI.</span>
            </p>

            <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 max-w-md">
              AI-powered agricultural ecosystem helping farmers understand their farm, weather, crops, resources, and markets.
            </p>

            {/* Equalizer Frequency Pulse */}
            <div className="w-full max-w-xs mt-7 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5 h-6">
                <div className="w-1 h-3 rounded-full bg-primary/40 animate-[pulse_1.2s_ease-in-out_infinite]" />
                <div className="w-1 h-5 rounded-full bg-primary/70 animate-[pulse_1.4s_ease-in-out_infinite_100ms]" />
                <div className="w-1 h-6 rounded-full bg-primary animate-[pulse_1.1s_ease-in-out_infinite_200ms]" />
                <div className="w-1 h-4 rounded-full bg-primary/80 animate-[pulse_1.3s_ease-in-out_infinite_300ms]" />
                <div className="w-1 h-2 rounded-full bg-primary/50 animate-[pulse_1.5s_ease-in-out_infinite_150ms]" />
                <div className="w-1 h-5 rounded-full bg-primary/75 animate-[pulse_1.2s_ease-in-out_infinite_250ms]" />
                <div className="w-1 h-3 rounded-full bg-primary/40 animate-[pulse_1.6s_ease-in-out_infinite_50ms]" />
              </div>

              <span className="font-label-code-sm text-[10px] text-secondary tracking-widest uppercase opacity-90">
                {calibrated
                  ? `NODE CALIBRATED: ${context.location ? context.location.toUpperCase() : 'SECTOR 07-GAMMA'}`
                  : 'CALIBRATING BIO-SIGNALS & SOIL MATRICES...'}
              </span>
            </div>

            {/* Quick Access Dual CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md">
              <Link
                href="/dashboard"
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary-container text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-[0_0_24px_rgba(198,192,255,0.4)] hover:shadow-[0_0_36px_rgba(198,192,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Command Center</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>

              <Link
                href="/setup"
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-surface-container-high/80 hover:bg-surface-container-highest border border-primary/30 text-on-surface font-body-sm text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base text-primary">tune</span>
                <span>Configure Farm</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer Telemetry */}
        <div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col items-center gap-4 mt-auto">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-on-secondary-container animate-bounce [animation-delay:300ms]" />
          </div>

          <div className="text-center font-label-code-sm text-[10px] text-on-surface-variant/70 tracking-widest uppercase">
            BHOOMI MITHRA ECOSYSTEMS © 2026 • ಬೆಳಕಿನ ಮನೆ • ENTERPRISE AGRONOMIC INTELLIGENCE
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
