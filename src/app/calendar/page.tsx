'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'

interface CalendarTask {
  id: string
  title: string
  date: string
  category: 'irrigation' | 'nutrition' | 'protection' | 'labor' | 'harvest'
  priority: 'high' | 'medium' | 'normal'
  completed: boolean
  weatherSensitive?: boolean
}

const DEFAULT_TASKS: CalendarTask[] = [
  {
    id: 't-1',
    title: 'Postpone foliar spray & clear drainage furrows',
    date: 'Tomorrow (Wed)',
    category: 'protection',
    priority: 'high',
    completed: false,
    weatherSensitive: true,
  },
  {
    id: 't-2',
    title: 'Book 3 workers for trenching & weeding',
    date: 'Thursday',
    category: 'labor',
    priority: 'medium',
    completed: false,
  },
  {
    id: 't-3',
    title: 'Top-dressing: Potassium Nitrate (13:0:45) via drip',
    date: 'Saturday',
    category: 'nutrition',
    priority: 'medium',
    completed: false,
  },
  {
    id: 't-4',
    title: 'Inspect leaf margins for Early Blight spores',
    date: 'Sunday',
    category: 'protection',
    priority: 'normal',
    completed: true,
  },
  {
    id: 't-5',
    title: 'First tomato selective harvest for local mandi',
    date: 'Next Tuesday',
    category: 'harvest',
    priority: 'high',
    completed: false,
  },
]

export default function FarmCalendarPage() {
  const { context } = useFarmContext()
  const [tasks, setTasks] = useState<CalendarTask[]>([])
  const [filter, setFilter] = useState('all')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState<CalendarTask['category']>('nutrition')

  useEffect(() => {
    const saved =
      localStorage.getItem('bhoomimithra_calendar_tasks') ||
      localStorage.getItem('farmconnect_calendar_tasks')
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch {
        setTasks(DEFAULT_TASKS)
      }
    } else {
      setTasks(DEFAULT_TASKS)
    }
  }, [])

  const saveTasks = (newTasks: CalendarTask[]) => {
    setTasks(newTasks)
    localStorage.setItem('bhoomimithra_calendar_tasks', JSON.stringify(newTasks))
  }

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    saveTasks(updated)
    toast.info('Task state updated')
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    const created: CalendarTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      date: 'This Week',
      category: newTaskCategory,
      priority: 'medium',
      completed: false,
    }
    saveTasks([created, ...tasks])
    setNewTaskTitle('')
    toast.success('New agronomic task added to calendar')
  }

  const filteredTasks = tasks.filter((t) => (filter === 'all' ? true : t.category === filter))

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                Agronomic Operations Scheduler // Local Persistent
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              AI Farm Calendar
            </h1>
          </div>

          <Link
            href="/copilot"
            className="px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-code-sm text-xs uppercase transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Ask AI to Auto-Schedule Season</span>
          </Link>
        </div>

        {/* Calendar Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Task List & Quick Filters (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'protection', label: 'Protection' },
                { id: 'nutrition', label: 'Nutrition' },
                { id: 'labor', label: 'Labor Sync' },
                { id: 'harvest', label: 'Harvest' },
                { id: 'irrigation', label: 'Irrigation' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all ${
                    filter === tab.id
                      ? 'bg-primary-container text-on-primary-container shadow-md'
                      : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Task Card Stack */}
            <div className="space-y-3">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`p-4 rounded-2xl border backdrop-blur-xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    t.completed
                      ? 'bg-surface-container/40 border-outline-variant/20 opacity-60'
                      : 'bg-surface-container/80 border-primary/25 hover:border-primary shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                        t.completed
                          ? 'bg-primary text-on-primary border-primary'
                          : 'border-outline-variant/50 bg-surface-container-high'
                      }`}
                    >
                      {t.completed && <span className="material-symbols-outlined text-sm">check</span>}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-body-md text-sm font-semibold truncate ${
                            t.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'
                          }`}
                        >
                          {t.title}
                        </span>
                        {t.weatherSensitive && (
                          <span className="px-2 py-0.5 rounded-full bg-error-container/30 text-error font-label-code-sm text-[9px] uppercase font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                            Weather Risk
                          </span>
                        )}
                      </div>
                      <span className="font-label-code-sm text-[10px] text-on-surface-variant font-mono">
                        {t.date} • Category: {t.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold shrink-0">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Add New Scheduled Task (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-surface-container-low/80 border border-primary/25 backdrop-blur-2xl flex flex-col gap-4 shadow-xl">
            <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
              Add Operational Task
            </span>

            <form onSubmit={handleAddTask} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-code-sm text-xs text-on-surface uppercase">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Apply vermicompost, inspect bunds..."
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-code-sm text-xs text-on-surface uppercase">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as CalendarTask['category'])}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
                >
                  <option value="nutrition">Nutrition &amp; Fertilizer</option>
                  <option value="protection">Crop Protection &amp; Disease</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="labor">Labor Sync</option>
                  <option value="harvest">Harvesting</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all"
              >
                Schedule Task
              </button>
            </form>

            <div className="mt-2 p-3 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/20 flex flex-col gap-1 text-[11px] text-on-surface-variant">
              <span className="text-secondary font-semibold">Local State Retention:</span>
              <p>Tasks are persisted in client storage and synchronized with your farm context.</p>
            </div>
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
