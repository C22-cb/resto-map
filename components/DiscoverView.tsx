'use client'

import { useState, useMemo } from 'react'
import { Search, X, Star, MapPin, SlidersHorizontal } from 'lucide-react'
import type { Place } from '@/lib/types'
import {
  getTypeColor, getTypeBg, getTypeLabel, getPriceLabel,
  getStatusLabel, getStatusStyle, PLACE_TYPES,
} from '@/lib/utils'

interface Props {
  places: Place[]
  onSelect: (place: Place) => void
}

export default function DiscoverView({ places, onSelect }: Props) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'price'>('date')
  const [showSort, setShowSort] = useState(false)

  const filtered = useMemo(() => {
    let r = [...places]

    if (search) {
      const q = search.toLowerCase()
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.cuisine?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        p.occasion_tags?.some(t => t.toLowerCase().includes(q)) ||
        p.ambiance_tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    if (filterType) r = r.filter(p => p.type === filterType)

    r.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
      if (sortBy === 'price') return (a.price_level ?? 5) - (b.price_level ?? 5)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return r
  }, [places, search, filterType, sortBy])

  return (
    <div className="flex flex-col h-full">
      {/* Fixed header */}
      <div className="flex-shrink-0 bg-app-bg px-4 pt-14 pb-3">
        {/* Title */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-ink-3 tracking-widest uppercase mb-1">Paris 9e</p>
            <h1 className="text-display text-ink leading-none">Discover</h1>
          </div>
          <button
            onClick={() => setShowSort(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors
              ${showSort ? 'bg-ink text-white' : 'bg-surface-2 text-ink-2'}`}
          >
            <SlidersHorizontal size={13} />
            {sortBy === 'date' ? 'New' : sortBy === 'rating' ? 'Rating' : 'Price'}
          </button>
        </div>

        {/* Sort options */}
        {showSort && (
          <div className="flex gap-2 mb-3">
            {(['date', 'rating', 'price'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setSortBy(s); setShowSort(false) }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors capitalize
                  ${sortBy === s ? 'bg-ink text-white' : 'bg-surface-2 text-ink-2'}`}
              >
                {s === 'date' ? 'Newest' : s === 'rating' ? 'Top Rated' : 'Price ↑'}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants, cuisine, vibe…"
            className="w-full pl-10 pr-10 py-3 bg-white rounded-2xl text-sm text-ink placeholder:text-ink-3 outline-none shadow-soft border border-app-border"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Type filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterType('')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border
              ${!filterType
                ? 'bg-ink text-white border-ink'
                : 'bg-white text-ink-2 border-app-border'}`}
          >
            All
          </button>
          {PLACE_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setFilterType(filterType === t.value ? '' : t.value)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border"
              style={filterType === t.value
                ? { backgroundColor: getTypeColor(t.value), color: 'white', borderColor: getTypeColor(t.value) }
                : { backgroundColor: 'white', color: '#6B6868', borderColor: '#E8E8E4' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-ink-3 font-medium mt-2">
          {filtered.length} place{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto scroll-area px-4 pb-24 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🍽</p>
            <p className="text-base font-semibold text-ink mb-1">No places found</p>
            <p className="text-sm text-ink-3">Try adjusting your search or filters</p>
          </div>
        )}
        {filtered.map(place => (
          <PlaceListCard key={place.id} place={place} onClick={() => onSelect(place)} />
        ))}
      </div>
    </div>
  )
}

function PlaceListCard({ place, onClick }: { place: Place; onClick: () => void }) {
  const typeColor = getTypeColor(place.type)
  const typeBg = getTypeBg(place.type)
  const statusStyle = getStatusStyle(place.status)
  const allTags = [...(place.occasion_tags ?? []), ...(place.ambiance_tags ?? [])].slice(0, 4)

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-3xl overflow-hidden shadow-card text-left press-scale border border-app-border/60"
    >
      {/* Color accent bar */}
      <div className="h-[3px]" style={{ backgroundColor: typeColor }} />

      <div className="p-4">
        {/* Row 1: type badge + status */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: typeBg, color: typeColor }}
          >
            {getTypeLabel(place.type)}
            {place.cuisine && ` · ${place.cuisine}`}
          </span>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
          >
            {getStatusLabel(place.status)}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-[20px] font-bold text-ink leading-tight tracking-tight mb-1">
          {place.name}
        </h3>

        {/* Subtitle */}
        {place.arrondissement && (
          <p className="text-xs text-ink-3 font-medium mb-3">Paris {place.arrondissement}e</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3">
          {place.rating && (
            <div className="flex items-center gap-1">
              <Star size={13} className="text-amber-400" fill="currentColor" />
              <span className="text-sm font-bold text-ink">{place.rating}</span>
            </div>
          )}
          {place.price_level && (
            <span className="text-sm font-semibold text-ink-2">
              {getPriceLabel(place.price_level)}
            </span>
          )}
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {allTags.map(tag => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 bg-surface-2 text-ink-2 rounded-full font-semibold capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Address */}
        {place.address && (
          <div className="flex items-center gap-1.5">
            <MapPin size={11} className="text-ink-3 flex-shrink-0" />
            <p className="text-[11px] text-ink-3 truncate font-medium">{place.address}</p>
          </div>
        )}
      </div>
    </button>
  )
}
