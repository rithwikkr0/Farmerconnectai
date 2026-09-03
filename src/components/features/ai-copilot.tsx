'use client'

import { useRef, useEffect, useState } from 'react'
import { Bot, Send, User, AlertCircle, Trash2, Leaf, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAICopilot } from '@/hooks/use-ai-copilot'
import { useFarmContext } from '@/hooks/use-farm-context'
import { FarmContextForm } from '@/components/features/farm-context-form'
import type { AISection } from '@/lib/api'

const SUGGESTED_QUESTIONS = [
  'What should I grow this season?',
  'Heavy rain expected tomorrow. What should I do?',
  'My tomato leaves are turning yellow. What could be wrong?',
  'How can I improve my soil fertility?',
  'What fertilizer should I use for rice at tillering stage?',
  'Is this a good time to sell my produce?',
]

function priorityColor(priority?: 'high' | 'medium' | 'low') {
  if (priority === 'high') return 'border-l-red-400'
  if (priority === 'medium') return 'border-l-yellow-400'
  return 'border-l-green-400'
}

function SectionCard({ section }: { section: AISection }) {
  const [open, setOpen] = useState(true)
  return (
    <div className={`border-l-2 pl-3 ${priorityColor(section.priority)}`}>
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-foreground text-xs font-semibold">{section.title}</span>
        {open ? (
          <ChevronUp className="text-muted-foreground size-3" />
        ) : (
          <ChevronDown className="text-muted-foreground size-3" />
        )}
      </button>
      {open && <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{section.content}</p>}
    </div>
  )
}

export function AICopilot() {
  const { messages, loading, sendMessage, clearMessages } = useAICopilot()
  const { toAIContext, loaded } = useFarmContext()
  const [input, setInput] = useState('')
  const [showContext, setShowContext] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    await sendMessage(text, toAIContext())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Farm context toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowContext((v) => !v)}
          className="gap-1.5 text-xs"
        >
          <Leaf className="size-3.5 text-green-600" />
          {showContext ? 'Hide Farm Profile' : 'Set Farm Profile'}
        </Button>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-muted-foreground gap-1.5 text-xs"
          >
            <Trash2 className="size-3.5" />
            Clear chat
          </Button>
        )}
      </div>

      {showContext && (
        <FarmContextForm onSaved={() => setShowContext(false)} />
      )}

      {/* Chat area */}
      <Card className="min-h-[400px]">
        <CardContent className="flex flex-col gap-3 p-4">
          {/* Empty state */}
          {messages.length === 0 && !loading && loaded && (
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <div className="bg-green-100 dark:bg-green-900 mb-4 flex size-12 items-center justify-center rounded-full">
                <Bot className="text-green-600 size-6" />
              </div>
              <p className="text-foreground mb-1 text-sm font-medium">
                Ask me anything about farming
              </p>
              <p className="text-muted-foreground mb-6 text-xs">
                I understand your crop, soil, weather, and location.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setInput(q)
                    }}
                    className="bg-muted hover:bg-muted/80 rounded-full px-3 py-1.5 text-xs transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role !== 'user' && (
                <div
                  className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${
                    msg.role === 'error'
                      ? 'bg-red-100 dark:bg-red-900'
                      : 'bg-green-100 dark:bg-green-900'
                  }`}
                >
                  {msg.role === 'error' ? (
                    <AlertCircle className="size-3.5 text-red-600" />
                  ) : (
                    <Bot className="text-green-600 size-3.5" />
                  )}
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : msg.role === 'error'
                      ? 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
                      : 'bg-muted'
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>

                {/* Structured sections from Gemini */}
                {msg.response?.sections && msg.response.sections.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2 border-t pt-3">
                    {msg.response.sections.map((section, i) => (
                      <SectionCard key={i} section={section} />
                    ))}
                  </div>
                )}

                {/* Safety note */}
                {msg.response?.safetyNote && (
                  <p className="text-muted-foreground mt-3 border-t pt-2 text-xs italic">
                    ⚠️ {msg.response.safetyNote}
                  </p>
                )}

                {/* Task badge */}
                {msg.response && (
                  <div className="mt-2 flex justify-end">
                    <Badge variant="secondary" className="text-xs">
                      {msg.response.task.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="bg-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                  <User className="text-primary-foreground size-3.5" />
                </div>
              )}
            </div>
          ))}

          {/* Loading state */}
          {loading && (
            <div className="flex gap-2">
              <div className="bg-green-100 dark:bg-green-900 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                <Bot className="text-green-600 size-3.5 animate-pulse" />
              </div>
              <div className="bg-muted max-w-[75%] rounded-xl px-3 py-2">
                <Skeleton className="mb-1.5 h-3 w-40 rounded" />
                <Skeleton className="mb-1.5 h-3 w-56 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
                <p className="text-muted-foreground mt-1.5 text-xs">Analyzing your farm…</p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </CardContent>
      </Card>

      {/* Input area */}
      <div className="flex gap-2">
        <Textarea
          placeholder="Ask a farming question… (Enter to send, Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={2}
          className="resize-none text-sm"
        />
        <Button
          onClick={() => void handleSend()}
          disabled={loading || !input.trim()}
          size="icon"
          className="shrink-0 self-end"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </div>
      <p className="text-muted-foreground text-center text-xs">
        AI responses are for guidance only. Consult a certified agronomist for critical decisions.
      </p>
    </div>
  )
}
