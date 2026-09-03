export const SITE_NAME = 'Bhoomi Mithra — ಬೆಳಕಿನ ಮನೆ'
export const BRAND_NAME = 'Bhoomi Mithra'
export const BRAND_TAGLINE = 'ಬೆಳಕಿನ ಮನೆ'
export const SITE_DESCRIPTION =
  'Bhoomi Mithra is an AI-powered agricultural ecosystem that helps farmers understand their farm, weather, crops, resources, people and markets.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const NAV_LINKS = [
  { label: 'Command Center', href: '/dashboard' },
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
