'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Link2 } from 'lucide-react'
import type { Place } from '@/lib/types'
import BottomNav from '@/components/BottomNav'
import PlaceCard from '@/components/PlaceCard'
import DiscoverView from '@/components/DiscoverView'

export default function DiscoverPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="flex flex-col h-full bg-app-bg">
      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex flex-col h-full px-4 pt-14">
            <div className="mb-4">
              <div className="w-16 h-3 bg-surface-3 rounded-full animate-skeleton mb-2" />
              <div className="w-40 h-8 bg-surface-3 rounded-xl animate-skeleton" />
            </div>
            <div className="w-full h-11 bg-surface-3 rounded-2xl animate-skeleton mb-3" />
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden mb-3 shadow-soft border border-app-border/60">
                <div className="h-[3px] bg-surface-3 animate-skeleton" />
                <div className="p-4 space-y-2">
                  <div className="w-24 h-5 bg-surface-3 rounded-full animate-skeleton" />
                  <div className="w-48 h-6 bg-surface-3 rounded-xl animate-skeleton" />
                  <div className="w-20 h-4 bg-surface-3 rounded-lg animate-skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DiscoverView places={places} onSelect={setSelectedPlace} />
        )}
      </main>

      {/* FABs */}
      <div
        className="fixed right-4 z-[500] flex flex-col gap-3 items-center"
        style={{ bottom: 'calc(var(--nav-h) + var(--safe-bottom) + 20px)' }}
      >
        <Link
          href="/import"
          className="w-12 h-12 bg-white rounded-full shadow-float flex items-center justify-center press-scale border border-app-border"
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

      {selectedPlace && (
        <PlaceCard place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}

      <BottomNav />
    </div>
  )
}
