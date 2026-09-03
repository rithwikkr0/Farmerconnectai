import type { Metadata } from 'next'
import { AICopilot } from '@/components/features/ai-copilot'

export const metadata: Metadata = {
  title: 'AI Copilot',
}

export default function CopilotPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">AI Agricultural Copilot</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Ask any farming question. Powered by Gemini — understands your farm context.
        </p>
      </div>
      <AICopilot />
    </div>
  )
}
