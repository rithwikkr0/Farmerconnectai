'use client'

/**
 * useAICopilot — manages state for the AI Agricultural Copilot chat.
 *
 * Handles:
 * - message queue
 * - loading state
 * - error state
 * - duplicate submission prevention
 * - task inference from free-text input
 */

import { useState, useCallback } from 'react'
import { askAI } from '@/lib/api'
import type { AITask, AIResponse } from '@/lib/api'

export interface CopilotMessage {
  id: string
  role: 'user' | 'assistant' | 'error'
  content: string
  response?: AIResponse
  timestamp: Date
}

/** Heuristically infer the best AI task from free-text */
function inferTask(question: string): AITask {
  const q = question.toLowerCase()
  if (q.match(/yellow|disease|spot|wilt|rot|pest|insect|fungus|blight|dying|symptom|problem with/))
    return 'crop_diagnosis'
  if (q.match(/rain|weather|flood|drought|storm|forecast|temperature|humidity|monsoon/))
    return 'weather_action'
  if (q.match(/fertiliz|npk|nitrogen|phosphorus|potassium|compost|manure|soil/))
    return 'fertilizer_advice'
  if (q.match(/cow|goat|chicken|poultry|livestock|animal|cattle|sheep|pig/))
    return 'livestock_advice'
  if (q.match(/profit|sell|market|price|income|revenue|earn|cost|invest/))
    return 'profit_analysis'
  if (q.match(/plan|season|schedule|calendar|next month|this year|prepare/))
    return 'farm_plan'
  return 'crop_recommendation'
}

export function useAICopilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(
    async (userText: string, farmContext: Record<string, unknown> = {}) => {
      if (loading || !userText.trim()) return

      const userMsg: CopilotMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: userText.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMsg])
      setLoading(true)

      try {
        const task = inferTask(userText)
        const context: Record<string, unknown> = {
          ...farmContext,
          question: userText.trim(),
        }

        const response = await askAI(task, context)

        const assistantMsg: CopilotMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: response.recommendation,
          response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMsg])
      } catch (err) {
        const errorMsg: CopilotMessage = {
          id: `e-${Date.now()}`,
          role: 'error',
          content:
            err instanceof Error
              ? err.message
              : 'Unable to connect to FarmConnect AI. Please try again.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, loading, sendMessage, clearMessages }
}
