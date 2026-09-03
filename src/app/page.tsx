import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sprout,
  CloudSun,
  Users,
  HardHat,
  ShoppingBag,
  Bot,
  ArrowRight,
  Leaf,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — FarmConnect AI',
}

const features = [
  {
    icon: Bot,
    title: 'AI Copilot',
    description: 'Ask any farming question. Get instant, context-aware advice powered by Gemini.',
    href: '/copilot',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-950',
  },
  {
    icon: Sprout,
    title: 'Crop Advisor',
    description: 'Get personalised crop recommendations based on your soil, water, and season.',
    href: '/crops',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
  },
  {
    icon: CloudSun,
    title: 'Weather & Advisory',
    description: 'Local weather forecast with AI-generated crop-specific preventive actions.',
    href: '/weather',
    color: 'text-sky-600',
    bg: 'bg-sky-50 dark:bg-sky-950',
  },
  {
    icon: Users,
    title: 'Farmer Connect',
    description: 'Find nearby farmers who grow your crop or have solved your problem.',
    href: '/farmers',
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-950',
  },
  {
    icon: HardHat,
    title: 'Labor Hire',
    description: 'Find available agricultural workers near you. Post a request in seconds.',
    href: '/labor',
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-950',
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace',
    description: 'Browse seeds, fertilizers, equipment, and produce from local sellers.',
    href: '/marketplace',
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-950',
  },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Hero */}
      <section className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-green-100 dark:bg-green-900 flex size-16 items-center justify-center rounded-2xl">
            <Leaf className="text-green-600 size-8" />
          </div>
        </div>
        <Badge variant="secondary" className="mb-4">
          Powered by Gemini AI
        </Badge>
        <h1 className="text-foreground mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
          FarmConnect AI
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-base sm:text-lg">
          Your AI-powered agricultural copilot. Get crop advice, weather alerts, connect with
          farmers, hire labour, and browse the marketplace — all in one place.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/copilot" className={buttonVariants({ size: 'lg' }) + ' w-full sm:w-auto'}>
            <Bot className="mr-2 size-4" />
            Ask the AI Copilot
            <ArrowRight className="ml-2 size-4" />
          </Link>
          <Link href="/crops" className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' w-full sm:w-auto'}>
            <Sprout className="mr-2 size-4" />
            Get Crop Advice
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section>
        <h2 className="text-foreground mb-6 text-center text-xl font-semibold tracking-tight">
          What can FarmConnect AI do for you?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="group block">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div
                    className={`mb-3 flex size-10 items-center justify-center rounded-xl ${feature.bg}`}
                  >
                    <feature.icon className={`size-5 ${feature.color}`} />
                  </div>
                  <CardTitle className="flex items-center justify-between text-sm font-semibold">
                    {feature.title}
                    <ArrowRight className="text-muted-foreground size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
