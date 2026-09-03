export const SITE_NAME = 'FarmConnect AI'
export const SITE_DESCRIPTION =
  'AI-powered agricultural advisor for Indian farmers — crop recommendations, weather advice, farmer matching, and more.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const NAV_LINKS = [
  { label: 'Dashboard', href: '/' },
  { label: 'AI Copilot', href: '/copilot' },
  { label: 'Crops', href: '/crops' },
  { label: 'Weather', href: '/weather' },
  { label: 'Farmers', href: '/farmers' },
  { label: 'Labor', href: '/labor' },
  { label: 'Marketplace', href: '/marketplace' },
] as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const
