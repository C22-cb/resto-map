'use client'

import { useState, useEffect } from 'react'
import { Map, Star, Bookmark, UtensilsCrossed } from 'lucide-react'
import type { Place } from '@/lib/types'
import BottomNav from '@/components/BottomNav'
import { getTypeColor, getTypeLabel } from '@/lib/utils'

export default function ProfilePage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/places')
      .then(r => r.json())
      .then(data => {
        setPlaces(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const favorites = places.filter(p => p.status === 'favorite')
  const tried = places.filter(p => p.status === 'tried')
  const wishlist = places.filter(p => p.status === 'to_try')
  const avgRating = places.filter(p => p.rating).length > 0
    ? (places.filter(p => p.rating).reduce((s, p) => s + (p.rating ?? 0), 0) / places.filter(p => p.rating).length).toFixed(1)
    : null

  const typeCounts = ['restaurant', 'bar', 'cafe', 'other'].map(type => ({
    type,
    count: places.filter(p => p.type === type).length,
  })).filter(t => t.count > 0)

  return (
    <div className="flex flex-col h-full bg-app-bg">
      <div className="flex-1 overflow-y-auto scroll-area">
        {/* Header */}
        <div className="px-4 pt-14 pb-6">
          <p className="text-xs font-bold text-ink-3 tracking-widest uppercase mb-1">Your</p>
          <h1 className="text-display text-ink leading-none">Profile</h1>
        </div>

        {/* Avatar + name */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-3xl p-5 shadow-card border border-app-border/60 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed size={28} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-lg font-bold text-ink">Paris Explorer</p>
              <p className="text-sm text-ink-3">Personal food guide</p>
              <p className="text-xs text-ink-3 mt-1">Paris 9e · Private</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="px-4 mb-6">
          <p className="text-xs font-bold text-ink-3 tracking-widest uppercase mb-3">Your Stats</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Places', value: loading ? '—' : places.length, icon: Map, color: '#0369A1' },
              { label: 'Favorites', value: loading ? '—' : favorites.length, icon: Star, color: '#E8472A' },
              { label: 'Tried', value: loading ? '—' : tried.length, icon: Bookmark, color: '#15803D' },
              { label: 'Avg Rating', value: loading ? '—' : (avgRating ?? '—'), icon: Star, color: '#B45309' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-3xl p-4 shadow-card border border-app-border/60">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: color + '15' }}
                >
                  <Icon size={18} style={{ color }} strokeWidth={2} />
                </div>
                <p className="text-2xl font-black text-ink">{value}</p>
                <p className="text-[10px] font-bold text-ink-3 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* By type breakdown */}
        {typeCounts.length > 0 && (
          <div className="px-4 mb-6">
            <p className="text-xs font-bold text-ink-3 tracking-widest uppercase mb-3">By Type</p>
            <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-app-border/60">
              {typeCounts.map(({ type, count }, i) => (
                <div
                  key={type}
                  className={`flex items-center px-5 py-4 ${i < typeCounts.length - 1 ? 'border-b border-app-border/60' : ''}`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: getTypeColor(type) }}
                  />
                  <span className="text-sm font-semibold text-ink flex-1">{getTypeLabel(type)}</span>
                  <span className="text-sm font-bold text-ink-2">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist teaser */}
        {wishlist.length > 0 && (
          <div className="px-4 mb-24">
            <p className="text-xs font-bold text-ink-3 tracking-widest uppercase mb-3">
              Up Next ({wishlist.length})
            </p>
            <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-app-border/60">
              {wishlist.slice(0, 3).map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center px-5 py-4 ${i < Math.min(wishlist.length, 3) - 1 ? 'border-b border-app-border/60' : ''}`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: getTypeColor(p.type) }}
                  />
                  <span className="text-sm font-semibold text-ink flex-1 truncate">{p.name}</span>
                  {p.cuisine && <span className="text-xs text-ink-3 ml-2">{p.cuisine}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
