'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { loginFarmer } from '@/lib/api'
import { useFarmContext } from '@/hooks/use-farm-context'

export default function LoginPage() {
  const router = useRouter()
  const { refreshAuth } = useFarmContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      const res = await loginFarmer({ email, password })
      toast.success(`Welcome back, ${res.user.full_name}!`)
      await refreshAuth()
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StitchShell>
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-label-code-sm text-primary uppercase tracking-widest font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Verified Farmer Access
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-white font-bold tracking-tight">
            Farmer Sign In
          </h1>
          <p className="text-on-surface-variant font-body-md text-sm">
            Access your persistent farm telemetry, AI recommendations, and D1 database records.
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-surface-container-low/70 backdrop-blur-2xl border border-outline-variant/30 rounded-3xl p-8 shadow-2xl space-y-6"
        >
          <div>
            <label className="block text-xs font-label-code-sm uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
              Email Address
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
              Password
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-surface font-bold shadow-[0_0_20px_rgba(112,96,249,0.4)] hover:shadow-[0_0_30px_rgba(112,96,249,0.6)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                <span>Authenticating with D1...</span>
              </>
            ) : (
              <>
                <span>Sign In to Bhoomi Mithra</span>
                <span className="material-symbols-outlined text-lg">login</span>
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-on-surface-variant border-t border-outline-variant/20">
            Don&apos;t have a farmer account yet?{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </StitchShell>
  )
}
