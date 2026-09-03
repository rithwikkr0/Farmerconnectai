'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useFarmContext } from '@/hooks/use-farm-context'

interface NavItem {
  name: string
  href: string
  icon: string
  badge?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Command Deck',
    items: [
      { name: 'Command Center', href: '/dashboard', icon: 'space_dashboard' },
      { name: 'AI Copilot', href: '/copilot', icon: 'psychology', badge: 'v4.9' },
      { name: 'Set Up Your Farm', href: '/setup', icon: 'tune' },
      { name: 'Splash Experience', href: '/', icon: 'satellite_alt' },
    ],
  },
  {
    label: 'Agronomic AI',
    items: [
      { name: 'Crop Intelligence', href: '/crops', icon: 'grain' },
      { name: 'AI Crop Doctor', href: '/crop-doctor', icon: 'document_scanner', badge: 'Vision' },
      { name: 'AI Input Advisor', href: '/input-advisor', icon: 'science' },
      { name: 'Weather Intelligence', href: '/weather', icon: 'thermostat' },
      { name: 'Weather Protection', href: '/weather-protection', icon: 'water_damage', badge: 'Alert' },
      { name: 'Farm Calendar', href: '/calendar', icon: 'calendar_month' },
      { name: 'Profit Simulator', href: '/profit', icon: 'calculate' },
    ],
  },
  {
    label: 'Ecosystem & Market',
    items: [
      { name: 'Find a Farmer', href: '/farmers', icon: 'person_search' },
      { name: 'Farmer Community', href: '/community', icon: 'groups' },
      { name: 'Labor Marketplace', href: '/labor', icon: 'engineering', badge: 'Live' },
      { name: 'Farm Marketplace', href: '/marketplace', icon: 'storefront' },
      { name: 'Agri Services', href: '/services', icon: 'precision_manufacturing' },
      { name: 'Livestock AI', href: '/livestock', icon: 'pets' },
      { name: 'Business Deals', href: '/business', icon: 'handshake' },
    ],
  },
]

export function StitchShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { context } = useFarmContext()

  const currentSector = context.district
    ? `${context.district} Sector`
    : context.location
      ? `${context.location} Node`
      : 'Sector 07-Gamma'

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface antialiased flex">
      {/* Dynamic Bio-Synthetic Perspective Floor & Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] left-[10%] w-[650px] h-[650px] rounded-full bg-primary-container/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[800px] h-[800px] rounded-full bg-secondary-container/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(198,192,255,0.05),transparent_70%)]" />
      </div>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-container-lowest/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* STITCH PERSISTENT SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low/95 backdrop-blur-2xl shadow-[0_1px_16px_rgba(0,0,0,0.5)] z-50 flex flex-col justify-between py-6 transition-transform duration-300 border-r border-outline-variant/30 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-5 overflow-y-auto scrollbar-none px-4">
          {/* Logo & Close button */}
          <div className="px-2 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high/90 border border-primary/30 flex items-center justify-center shadow-[0_0_16px_rgba(112,96,249,0.5)] shrink-0 overflow-hidden p-0.5">
                <img src="/logo.png" alt="Bhoomi Mithra" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-sm text-on-surface tracking-wider uppercase font-bold truncate">
                  Bhoomi Mithra
                </span>
                <span className="font-body-sm text-xs text-secondary font-medium tracking-wide">
                  ಬೆಳಕಿನ ಮನೆ
                </span>
              </div>
            </Link>
            <button
              type="button"
              className="lg:hidden w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center"
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* System Status Indicator */}
          <div className="px-2">
            <div className="p-2.5 rounded-xl bg-surface-container-lowest/90 border border-primary/20 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#c6c0ff]" />
                <span className="font-label-code-sm text-[10px] text-on-surface uppercase font-bold tracking-wider">
                  Bhoomi Node Synced
                </span>
              </div>
              <span className="font-label-code-sm text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">
                v4.9
              </span>
            </div>
          </div>

          {/* Navigation Items Grouped */}
          <nav className="flex flex-col gap-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                <span className="px-3 text-[10px] font-label-code-sm uppercase tracking-widest text-on-surface-variant/70">
                  {group.label}
                </span>
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_16px_rgba(139,128,255,0.4)]'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-lg ${
                            isActive ? 'text-on-primary-container' : 'text-primary/80'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-body-sm text-[13px]">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-label-code-sm uppercase font-bold ${
                            isActive
                              ? 'bg-on-primary-container text-primary-container'
                              : 'bg-primary/15 text-primary'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Stats */}
        <div className="px-5 pt-3 border-t border-outline-variant/30 flex flex-col gap-3">
          <div className="p-2.5 rounded-xl bg-surface-container/70 border border-outline-variant/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-code-sm text-[9px] text-on-surface-variant uppercase">
                Canopy Yield Target
              </span>
              <span className="font-headline-sm text-sm text-primary font-bold">98.4%</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-xl">speed</span>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant text-[10px] font-label-code-sm uppercase">
            <span>Neural Grid 1680px</span>
            <span className="text-primary font-bold">Synced</span>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <div className="w-full pl-0 lg:pl-72 flex flex-col min-h-screen relative z-10">
        {/* STITCH PERSISTENT TOP HEADER */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 z-40 h-16 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              className="lg:hidden w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open Navigation"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            <div className="flex items-center gap-2 bg-surface-container/70 border border-primary/20 px-3 py-1.5 rounded-xl shadow-inner">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-xs text-on-surface uppercase font-medium">
                {currentSector}
              </span>
            </div>

            <div className="hidden xl:flex items-center gap-2.5 text-xs">
              <img src="/icon.png" alt="Bhoomi Mithra" className="w-5 h-5 rounded-md object-cover border border-primary/30" />
              <span className="font-headline-sm font-bold text-on-surface">Bhoomi Mithra</span>
              <span className="text-secondary font-medium font-body-sm">ಬೆಳಕಿನ ಮನೆ</span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-on-surface-variant font-label-code-sm text-xs uppercase">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">water_drop</span>
                RH: 74%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-secondary">solar_power</span>
                PAR: 1,420 μmol/m²s
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">air</span>
                Wind: 8.4 km/h
              </span>
            </div>
          </div>

          {/* Quick Header Actions & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/copilot"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary-container/30 to-secondary-container/30 border border-primary/40 hover:border-primary text-primary font-label-code-sm text-xs uppercase tracking-wider transition-all"
            >
              <span className="material-symbols-outlined text-sm animate-pulse">neurology</span>
              <span>Bhoomi Mithra AI</span>
            </Link>

            <Link
              href="/weather"
              className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex items-center justify-center"
              title="Weather Telemetry"
            >
              <span className="material-symbols-outlined text-lg text-secondary">cloudy_snowing</span>
            </Link>

            <Link
              href="/copilot"
              className="relative w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex items-center justify-center"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-lg text-primary">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </Link>

            {/* Operator Profile Chip */}
            <div className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl bg-surface-container/70 border border-outline-variant/30">
              <div className="w-7 h-7 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-xs font-bold">
                FP
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-body-sm text-xs text-on-surface font-semibold leading-tight">
                  {context.location || 'Farm Operator'}
                </span>
                <span className="font-label-code-sm text-[9px] text-primary uppercase">
                  {context.primaryCrop || 'Canopy Lead'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY VIEWPORT */}
        <main className="w-full pt-16 flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}
