'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X, Star, MapPin } from 'lucide-react'
import type { Place } from '@/lib/types'
import {
  getTypeColor, getTypeLabel, getPriceLabel,
  getStatusLabel, PLACE_TYPES, STATUSES,
} from '@/lib/utils'

interface Props {
  places: Place[]
  onSelect: (place: Place) => void
}

const priceOptions = [
  { value: 1, label: '€' },
  { value: 2, label: '€€' },
  { value: 3, label: '€€€' },
  { value: 4, label: '€€€€' },
]

export default function PlaceList({ places, onSelect }: Props) {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPrice, setFilterPrice] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'price'>('date')

  const filtered = useMemo(() => {
    let result = [...places]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.cuisine?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        p.occasion_tags?.some(t => t.toLowerCase().includes(q)) ||
        p.ambiance_tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    if (filterType) result = result.filter(p => p.type === filterType)
    if (filterStatus) result = result.filter(p => p.status === filterStatus)
    if (filterPrice) result = result.filter(p => p.price_level === filterPrice)

    result.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
      if (sortBy === 'price') return (a.price_level ?? 5) - (b.price_level ?? 5)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return result
  }, [places, search, filterType, filterStatus, filterPrice, sortBy])

  const hasFilters = filterType || filterStatus || filterPrice

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, cuisine, tag..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${showFilters || hasFilters ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <SlidersHorizontal size={15} />
            {hasFilters && <span className="text-xs">•</span>}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-xl p-3 space-y-3">
            {/* Type */}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Type</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterType('')}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                    ${!filterType ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                >
                  All
                </button>
                {PLACE_TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setFilterType(filterType === t.value ? '' : t.value)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                      ${filterType === t.value ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    style={filterType === t.value ? { backgroundColor: getTypeColor(t.value) } : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Status</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterStatus('')}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                    ${!filterStatus ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                >
                  All
                </button>
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setFilterStatus(filterStatus === s.value ? '' : s.value)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                      ${filterStatus === s.value ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Price</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setFilterPrice(null)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                    ${!filterPrice ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                >
                  All
                </button>
                {priceOptions.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setFilterPrice(filterPrice === p.value ? null : p.value)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                      ${filterPrice === p.value ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Sort by</p>
              <div className="flex gap-1.5">
                {([['date', 'Date'], ['rating', 'Rating'], ['price', 'Price']] as const).map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setSortBy(val)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                      ${sortBy === val ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400">{filtered.length} place{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🍽</p>
            <p className="text-sm">No places found</p>
          </div>
        )}

        {filtered.map(place => (
          <PlaceListItem key={place.id} place={place} onClick={() => onSelect(place)} />
        ))}
      </div>
    </div>
  )
}

function PlaceListItem({ place, onClick }: { place: Place; onClick: () => void }) {
  const typeColor = getTypeColor(place.type)

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start gap-3">
        {/* Color dot */}
        <div
          className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
          style={{ backgroundColor: typeColor }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                {place.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {getTypeLabel(place.type)}
                {place.cuisine && ` · ${place.cuisine}`}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              {place.rating && (
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-semibold">{place.rating}</span>
                </div>
              )}
              {place.price_level && (
                <p className="text-xs text-gray-400">{getPriceLabel(place.price_level)}</p>
              )}
            </div>
          </div>

          {place.address && (
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin size={11} className="text-gray-300 flex-shrink-0" />
              <p className="text-xs text-gray-400 truncate">{place.address}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full
              ${place.status === 'favorite' ? 'bg-red-50 text-red-500' :
                place.status === 'tried' ? 'bg-gray-100 text-gray-500' :
                'bg-blue-50 text-blue-600'}`}
            >
              {getStatusLabel(place.status)}
            </span>

            {place.occasion_tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}
