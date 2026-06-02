'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Link2 } from 'lucide-react'
import type { Place } from '@/lib/types'
import BottomNav from '@/components/BottomNav'
import PlaceCard from '@/components/PlaceCard'
import { getTypeColor } from '@/lib/utils'

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#EDE9E0]">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-ink-3 font-medium">Loading map…</p>
      </div>
    </div>
  ),
})

const TYPE_DOTS = [
  { type: 'restaurant', label: 'Restaurant' },
  { type: 'bar', label: 'Bar' },
  { type: 'cafe', label: 'Café' },
  { type: 'other', label: 'Other' },
]

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  useEffect(() => {
    fetch('/api/places')
      .then(r => r.json())
      .then(data => setPlaces(Array.isArray(data) ? data : []))
      .catch(() => setPlaces([]))
  }, [])

  return (
    <div className="relative h-full w-full bg-[#EDE9E0]">
      {/* Full-screen map */}
      <div className="absolute inset-0" style={{ paddingBottom: 'var(--nav-h)' }}>
        <MapView
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={setSelectedPlace}
        />
      </div>

      {/* Top-left: place count */}
      <div className="absolute top-4 left-4 z-[500]">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-card">
          <span className="text-sm font-bold text-ink">
            {places.length} place{places.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Top-right: legend */}
      <div className="absolute top-4 right-4 z-[500]">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-card">
          {TYPE_DOTS.map(({ type, label }) => (
            <div key={type} className="flex items-center gap-2 py-[3px]">
              <div
                className="w-2.5 h-2.5 rounded-full border-[2px] border-white shadow-sm"
                style={{ backgroundColor: getTypeColor(type) }}
              />
              <span className="text-[11px] font-semibold text-ink-2">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FABs — bottom right above nav */}
      <div
        className="absolute right-4 z-[500] flex flex-col gap-3 items-center"
        style={{ bottom: 'calc(var(--nav-h) + var(--safe-bottom) + 20px)' }}
      >
        <Link
          href="/import"
          className="w-12 h-12 bg-white rounded-full shadow-float flex items-center justify-center press-scale"
        >
          <Link2 size={20} className="text-ink-2" />
        </Link>
        <Link
          href="/add"
          className="w-14 h-14 bg-accent rounded-full shadow-accent flex items-center justify-center press-scale"
        >
          <Plus size={26} className="text-white" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Bottom sheet */}
      {selectedPlace && (
        <PlaceCard
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      <BottomNav />
    </div>
  )
}
