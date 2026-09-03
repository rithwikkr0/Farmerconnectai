'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'

interface CommunityPost {
  id: string
  author: string
  village: string
  crop: string
  title: string
  content: string
  timeAgo: string
  upvotes: number
  replies: number
  tag: string
  isUrgent?: boolean
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'p-1',
    author: 'Suresh Gowda',
    village: 'Mandya Rural Node',
    crop: 'Tomato',
    title: 'Blight alert in sector 04 following yesterday’s humidity spike',
    content: 'Noticed dark concentric rings on lower leaves of hybrid tomato crop. Extension officer recommended copper oxychloride drenching before tomorrow’s rain. Check your bottom foliage!',
    timeAgo: '2h ago',
    upvotes: 28,
    replies: 9,
    tag: 'Pest Alert',
    isUrgent: true,
  },
  {
    id: 'p-2',
    author: 'Anand Murugan',
    village: 'Kaveri Basin Block 2',
    crop: 'Paddy',
    title: 'Shared laser land leveler available this Thursday and Friday',
    content: 'Pooling laser leveler tractor for direct seeded rice preparation. Cost is ₹1,100/hr shared between 3 adjacent plots. Reply if you want to join the run.',
    timeAgo: '5h ago',
    upvotes: 19,
    replies: 4,
    tag: 'Equipment Sharing',
  },
  {
    id: 'p-3',
    author: 'Lakshmi Devi',
    village: 'Huligere Farm Cluster',
    crop: 'Finger Millet & Pulses',
    title: 'Neem kernel aqueous extract recipe that controlled armyworm',
    content: 'Prepared 5% NSKE with soap emulsifier last season. Reduced pod borer damage by 80% without any synthetic spray. Happy to share step-by-step ratios.',
    timeAgo: '1d ago',
    upvotes: 42,
    replies: 14,
    tag: 'Organic Wisdom',
  },
]

export default function FarmerCommunityPage() {
  const { context } = useFarmContext()
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [activeTag, setActiveTag] = useState('all')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTitle, setNewPostTitle] = useState('')

  const handleUpvote = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p)))
    toast.success('Helpful vote recorded')
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostTitle.trim()) return

    const created: CommunityPost = {
      id: `p-${Date.now()}`,
      author: context.location ? `Farmer from ${context.location.split(',')[0]}` : 'Local Farmer',
      village: context.district || 'Sector 07-Gamma',
      crop: context.primaryCrop || 'Tomato',
      title: newPostTitle.trim(),
      content: newPostContent.trim() || 'Sharing observation with regional peer network.',
      timeAgo: 'Just now',
      upvotes: 1,
      replies: 0,
      tag: 'General Discussion',
    }

    setPosts([created, ...posts])
    setNewPostTitle('')
    setNewPostContent('')
    toast.success('Observation posted to regional farmer community')
  }

  const filteredPosts = posts.filter((p) => (activeTag === 'all' ? true : p.tag.toLowerCase().includes(activeTag.toLowerCase())))

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                Regional Knowledge Network // Synced
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Farmer Community
            </h1>
          </div>

          <Link
            href="/farmers"
            className="px-4 py-2 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-xs uppercase font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">person_search</span>
            <span>Match with 1-on-1 Peer Mentor</span>
          </Link>
        </div>

        {/* 2-Column Split: Feed on Left / Quick Post on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: COMMUNITY POSTS FEED (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Observations' },
                { id: 'pest', label: 'Pest & Disease Alerts' },
                { id: 'equipment', label: 'Equipment Sharing' },
                { id: 'organic', label: 'Organic Wisdom' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTag(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-label-code-sm text-xs uppercase font-bold transition-all ${
                    activeTag === tab.id
                      ? 'bg-primary-container text-on-primary-container shadow-md'
                      : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Post Stack */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={`p-6 rounded-3xl bg-surface-container/80 border backdrop-blur-xl flex flex-col gap-3.5 transition-all shadow-md ${
                    post.isUrgent ? 'border-error/40 shadow-[0_0_20px_rgba(255,180,171,0.1)]' : 'border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center font-headline-sm text-xs font-bold text-primary">
                        {post.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-xs font-bold text-on-surface">{post.author}</span>
                        <span className="font-label-code-sm text-[10px] text-on-surface-variant">
                          {post.village} • Crop: {post.crop}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-surface-container-highest font-label-code-sm text-[10px] text-secondary font-bold">
                        {post.tag}
                      </span>
                      <span className="font-label-code-sm text-[10px] text-on-surface-variant font-mono">
                        {post.timeAgo}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-headline-sm text-base font-bold text-on-surface mt-1">{post.title}</h3>
                  <p className="font-body-sm text-xs text-on-surface leading-relaxed">{post.content}</p>

                  <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleUpvote(post.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">thumb_up</span>
                      <span>{post.upvotes} Helpful</span>
                    </button>

                    <span className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">comment</span>
                      <span>{post.replies} Replies</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CREATE OBSERVATION (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-surface-container-low/80 border border-primary/25 backdrop-blur-2xl flex flex-col gap-4 shadow-xl">
            <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
              Share Local Observation
            </span>

            <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-label-code-sm text-xs text-on-surface uppercase">Topic / Heading</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Noticed pest spike, tractor available..."
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-code-sm text-xs text-on-surface uppercase">Details</label>
                <textarea
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe field conditions, dosage used, or details for neighboring farmers..."
                  className="w-full p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:bg-primary-container transition-all"
              >
                Post to Peer Network
              </button>
            </form>

            <div className="mt-2 p-3 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/20 flex flex-col gap-1 text-[11px] text-on-surface-variant">
              <span className="text-primary font-semibold">Verified Agronomic Feed:</span>
              <p>Posts from your sector are cross-referenced with regional satellite and weather telemetry.</p>
            </div>
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
