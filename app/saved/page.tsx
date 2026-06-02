'use client'

import { useState, useEffect, useMemo } from 'react'
import { Bookmark, Star, MapPin } from 'lucide-react'
import type { Place } from '@/lib/types'
import BottomNav from '@/components/BottomNav'
import PlaceCard from '@/components/PlaceCard'
import { getTypeColor, getTypeBg, getTypeLabel, getPriceLabel, getStatusLabel, getStatusStyle } from '@/lib/utils'

const FILTERS = [
  { value: '', label: 'All Saved' },
  { value: 'favorite', label: 'Favorites' },
  { value: 'tried', label: 'Tried' },
  { value: 'to_try', label: 'Wishlist' },
] as const

export default function SavedPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  useEffect(() => {
    fetch('/api/places')
      .then(r => r.json())
      .then(data => {
        setPlaces(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!filter) return places
    return places.filter(p => p.status === filter)
  }, [places, filter])

  const counts = useMemo(() => ({
    favorite: places.filter(p => p.status === 'favorite').length,
    tried: places.filter(p => p.status === 'tried').length,
    to_try: places.filter(p => p.status === 'to_try').length,
  }), [places])

  return (
    <div className="flex flex-col h-full bg-app-bg">
      {/* Header */}
      <header className="flex-shrink-0 bg-app-bg px-4 pt-14 pb-3">
        <p className="text-xs font-bold text-ink-3 tracking-widest uppercase mb-1">Your Collection</p>
        <h1 className="text-display text-ink leading-none mb-5">Saved</h1>

        {/* Stats row */}
        <div className="flex gap-3 mb-4">
          {[
            { label: 'Favorites', count: counts.favorite, color: '#E8472A' },
            { label: 'Tried', count: counts.tried, color: '#15803D' },
            { label: 'Wishlist', count: counts.to_try, color: '#1D4ED8' },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex-1 bg-white rounded-2xl p-3 shadow-soft border border-app-border/60">
              <p className="text-xl font-black" style={{ color }}>{count}</p>
              <p className="text-[10px] font-bold text-ink-3 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border
                ${filter === f.value
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-ink-2 border-app-border'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-ink-3 font-medium mt-2">
          {filtered.length} place{filtered.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* List */}
      <main className="flex-1 overflow-y-auto scroll-area px-4 pb-24 space-y-3">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-soft border border-app-border/60 p-4 space-y-2">
              <div className="w-24 h-4 bg-surface-3 rounded-full animate-skeleton" />
              <div className="w-48 h-6 bg-surface-3 rounded-xl animate-skeleton" />
              <div className="w-20 h-3 bg-surface-3 rounded-lg animate-skeleton" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark size={48} className="mx-auto text-ink-3 mb-4" strokeWidth={1} />
            <p className="text-base font-semibold text-ink mb-1">
              {filter ? 'No places here yet' : 'Nothing saved yet'}
            </p>
            <p className="text-sm text-ink-3">
              Add places from the Map or Discover tab
            </p>
          </div>
        ) : (
          filtered.map(place => (
            <SavedCard key={place.id} place={place} onClick={() => setSelectedPlace(place)} />
          ))
        )}
      </main>

      {selectedPlace && (
        <PlaceCard place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}

      <BottomNav />
    </div>
  )
}

function SavedCard({ place, onClick }: { place: Place; onClick: () => void }) {
  const typeColor = getTypeColor(place.type)
  const typeBg = getTypeBg(place.type)
  const statusStyle = getStatusStyle(place.status)

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-3xl overflow-hidden shadow-card text-left press-scale border border-app-border/60"
    >
      <div className="h-[3px]" style={{ backgroundColor: typeColor }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{ backgroundColor: typeBg, color: typeColor }}
              >
                {getTypeLabel(place.type)}{place.cuisine ? ` · ${place.cuisine}` : ''}
              </span>
            </div>
            <h3 className="text-lg font-bold text-ink leading-tight mb-1 truncate">{place.name}</h3>
            {place.address && (
              <div className="flex items-center gap-1">
                <MapPin size={11} className="text-ink-3" />
                <p className="text-[11px] text-ink-3 truncate">{place.address}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
            >
              {getStatusLabel(place.status)}
            </span>
            {place.rating && (
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-400" fill="currentColor" />
                <span className="text-sm font-bold text-ink">{place.rating}</span>
              </div>
            )}
            {place.price_level && (
              <span className="text-xs font-semibold text-ink-2">{getPriceLabel(place.price_level)}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
