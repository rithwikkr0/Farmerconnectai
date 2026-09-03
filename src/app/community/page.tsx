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
    author: 'Ravi K. (DEMO)',
    village: 'Anekal Rural',
    crop: 'Tomato',
    title: 'Blight alert in Anekal belt following yesterday’s humidity spike',
    content: 'Noticed dark concentric rings on lower leaves of hybrid tomato crop. Extension officer recommended copper oxychloride drenching before tomorrow’s rain. Check your bottom foliage!',
    timeAgo: '2h ago',
    upvotes: 28,
    replies: 9,
    tag: 'Pest Alert',
    isUrgent: true,
  },
  {
    id: 'p-2',
    author: 'Manjunath R. (DEMO)',
    village: 'Jigani Cluster',
    crop: 'Ragi',
    title: 'Shared laser land leveler available this Thursday and Friday',
    content: 'Pooling laser leveler tractor for direct seeded rice and ragi preparation. Cost is ₹1,100/hr shared between adjacent plots. Reply if you want to join the run.',
    timeAgo: '5h ago',
    upvotes: 19,
    replies: 4,
    tag: 'Equipment Sharing',
  },
  {
    id: 'p-3',
    author: 'Geetha S. (DEMO)',
    village: 'Attibele Node',
    crop: 'Vegetables & Beans',
    title: 'Neem kernel aqueous extract recipe that controlled armyworm',
    content: 'Prepared 5% NSKE with soap emulsifier last season. Reduced pod borer damage by 80% without any synthetic spray. Happy to share step-by-step ratios.',
    timeAgo: '1d ago',
    upvotes: 42,
    replies: 14,
    tag: 'Organic Wisdom',
  },
]

export default function FarmerCommunityPage() {
  const { context, farmProfile } = useFarmContext()
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [activeTag, setActiveTag] = useState('all')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTitle, setNewPostTitle] = useState('')

  const farmLocation = farmProfile?.location || context.location || 'Anekal, Bengaluru Urban, Karnataka'

  const handleUpvote = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p)))
    toast.success('Helpful vote recorded')
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostTitle.trim()) return

    const created: CommunityPost = {
      id: `p-${Date.now()}`,
      author: context.farmerName ? `${context.farmerName} (DEMO)` : 'Local Farmer',
      village: 'Anekal Belt',
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
                Bhoomi Mithra Ecosystem Hub // Anekal Network
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Connect &amp; Agriculture Ecosystem
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-surface-container/60 border border-outline-variant/30 px-3.5 py-1.5 rounded-full text-on-surface-variant font-label-code-sm text-xs">
            <span className="material-symbols-outlined text-sm text-primary">hub</span>
            <span>{farmLocation}</span>
          </div>
        </div>

        {/* 1. ECOSYSTEM DASHBOARD SUMMARY (4 PRIMARY CARDS) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">grid_view</span>
              Anekal Agricultural Network
            </h2>
            <span className="font-label-code-sm text-xs text-on-surface-variant">Live Ecosystem Status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Farmers */}
            <div className="p-5 rounded-3xl bg-surface-container-low border border-primary/20 backdrop-blur-xl flex flex-col justify-between gap-4 shadow-xl hover:border-primary transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">person_search</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 font-label-code-sm text-xs font-bold font-mono">
                  5 Profiles
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-white">Farmers</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Learn from nearby experienced growers in Anekal, Jigani, and Attibele.
                </p>
              </div>
              <Link
                href="/farmers"
                className="w-full py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-surface font-label-code-sm text-xs uppercase font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Find Farmer</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Card 2: Labor */}
            <div className="p-5 rounded-3xl bg-surface-container-low border border-secondary/20 backdrop-blur-xl flex flex-col justify-between gap-4 shadow-xl hover:border-secondary transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">engineering</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-label-code-sm text-xs font-bold font-mono">
                  8 Workers
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-white">Labor</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Find available farm workers for harvesting, transplanting, and weeding.
                </p>
              </div>
              <Link
                href="/labor"
                className="w-full py-2.5 rounded-xl bg-secondary/20 hover:bg-secondary text-secondary hover:text-surface font-label-code-sm text-xs uppercase font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Hire Worker</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Card 3: Marketplace */}
            <div className="p-5 rounded-3xl bg-surface-container-low border border-primary/20 backdrop-blur-xl flex flex-col justify-between gap-4 shadow-xl hover:border-primary transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">storefront</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-code-sm text-xs font-bold font-mono">
                  8 Listings
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-white">Marketplace</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Buy certified seeds, urea, NPK, bio-inputs &amp; direct farm produce.
                </p>
              </div>
              <Link
                href="/marketplace"
                className="w-full py-2.5 rounded-xl bg-primary/20 hover:bg-primary text-primary hover:text-surface font-label-code-sm text-xs uppercase font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Buy Inputs</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Card 4: Services */}
            <div className="p-5 rounded-3xl bg-surface-container-low border border-secondary/20 backdrop-blur-xl flex flex-col justify-between gap-4 shadow-xl hover:border-secondary transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-label-code-sm text-xs font-bold font-mono">
                  5 Services
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-white">Services</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Sonalika tractor dealership, MS Agri Clinic, KVK testing, and inputs.
                </p>
              </div>
              <Link
                href="/services"
                className="w-full py-2.5 rounded-xl bg-secondary/20 hover:bg-secondary text-secondary hover:text-surface font-label-code-sm text-xs uppercase font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Find Service</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Business Opportunity Banner Below */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl">handshake</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-base font-bold text-white">Business Opportunities</h3>
                  <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[10px] font-label-code-sm font-bold uppercase">
                    4 Enquiries
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5 max-w-xl leading-relaxed">
                  Connect with seed companies, fertilizer dealers, machinery dealerships, and bulk produce buyers in Bengaluru Urban.
                </p>
              </div>
            </div>
            <Link
              href="/business"
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all shrink-0 flex items-center gap-2"
            >
              <span>Explore Business</span>
              <span className="material-symbols-outlined text-sm">north_east</span>
            </Link>
          </div>
        </section>

        {/* 2. REGIONAL FARMER PEER FORUM */}
        <section className="space-y-4 pt-4 border-t border-outline-variant/20">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-400 text-xl">forum</span>
              Anekal Farmer Discussions &amp; Alerts
            </h2>
            <span className="font-label-code-sm text-xs text-on-surface-variant">Peer Knowledge Sharing</span>
          </div>

          {/* Post Form */}
          <form onSubmit={handleCreatePost} className="p-5 rounded-3xl bg-surface-container-low/70 border border-outline-variant/25 space-y-3">
            <input
              type="text"
              placeholder="Share an observation or ask nearby farmers (e.g. Tomato blight treatment)..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full bg-surface-container-high/60 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-on-surface-variant focus:outline-none focus:border-primary"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-label-code-sm">
                Posting as: {context.farmerName || 'Farmer'} ({farmLocation.split(',')[0]})
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-surface font-label-code-sm text-xs uppercase font-bold transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Post Alert</span>
              </button>
            </div>
          </form>

          {/* Posts List */}
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-3xl bg-surface-container/70 border border-outline-variant/20 hover:border-outline-variant/40 transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                      {post.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-sm font-bold text-white">{post.author}</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-[9px] font-label-code-sm text-on-surface-variant font-bold uppercase">
                          {post.village}
                        </span>
                        {post.isUrgent && (
                          <span className="px-2 py-0.5 rounded bg-error/20 text-error text-[9px] font-label-code-sm font-bold uppercase">
                            Urgent
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-on-surface-variant font-label-code-sm">
                        Crop: {post.crop} • {post.timeAgo}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container-high text-[10px] font-label-code-sm text-primary uppercase font-bold">
                    {post.tag}
                  </span>
                </div>

                <p className="text-xs text-on-surface leading-relaxed">{post.content}</p>

                <div className="flex items-center gap-4 pt-2 border-t border-outline-variant/15 text-xs text-on-surface-variant font-label-code-sm">
                  <button
                    type="button"
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                    <span>{post.upvotes} Helpful</span>
                  </button>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                    <span>{post.replies} Replies</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </StitchShell>
  )
}
